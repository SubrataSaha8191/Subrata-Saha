"use client";

import { useRef, useCallback, useEffect } from "react";
import { useMobileControlsStore } from "@/store/useMobileControlsStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useGameStore } from "@/store/useGameStore";
import { clamp } from "@/lib/utils/clamp";

export default function MobileTouchCamera() {
  const isMobile = useIsMobile();
  const touchIdRef = useRef<number | null>(null);
  const lastTouchRef = useRef({ x: 0, y: 0 });
  
  const setYaw = useGameStore((s) => s.setCameraYaw);
  const setPitch = useGameStore((s) => s.setCameraPitch);
  const yaw = useGameStore((s) => s.cameraYaw);
  const pitch = useGameStore((s) => s.cameraPitch);
  const sittingState = useGameStore((s) => s.sittingState);
  
  const yawRef = useRef(yaw);
  const pitchRef = useRef(pitch);
  
  // Keep refs in sync
  useEffect(() => {
    yawRef.current = yaw;
    pitchRef.current = pitch;
  }, [yaw, pitch]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only handle touches on the right side of the screen (camera area)
    const touch = e.touches[0];
    if (touch.clientX < window.innerWidth / 2) return;
    
    // Ignore if touch is on a button
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-mobile-control]')) return;
    
    if (touchIdRef.current !== null) return;
    
    touchIdRef.current = touch.identifier;
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (touchIdRef.current === null) return;
    
    const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current);
    if (!touch) return;
    
    const deltaX = touch.clientX - lastTouchRef.current.x;
    const deltaY = touch.clientY - lastTouchRef.current.y;
    
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    
    const sensitivity = 0.005;
    
    if (sittingState.isSitting) {
      // Allow full yaw with limited pitch when sitting
      const nextYaw = yawRef.current - deltaX * sensitivity;
      const nextPitch = pitchRef.current + deltaY * sensitivity;
      setYaw(nextYaw);
      setPitch(clamp(nextPitch, -0.3, 0.5));
    } else {
      const nextYaw = yawRef.current - deltaX * sensitivity;
      const nextPitch = pitchRef.current + deltaY * sensitivity;
      
      setYaw(nextYaw);
      setPitch(clamp(nextPitch, -1.4, 1.4));
    }
  }, [setYaw, setPitch, sittingState.isSitting]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current);
    if (touch) {
      touchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: false });
    
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isMobile, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return null;
}
