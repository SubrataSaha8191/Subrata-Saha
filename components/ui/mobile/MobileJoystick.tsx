"use client";

import { useRef, useCallback, useEffect } from "react";
import { useMobileControlsStore } from "@/store/useMobileControlsStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useGameStore } from "@/store/useGameStore";

const JOYSTICK_SIZE = 120;
const KNOB_SIZE = 50;
const MAX_DISTANCE = (JOYSTICK_SIZE - KNOB_SIZE) / 2;

export default function MobileJoystick() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });

  const setJoystick = useMobileControlsStore((s) => s.setJoystick);
  const setIsJoystickActive = useMobileControlsStore((s) => s.setIsJoystickActive);
  
  const sittingState = useGameStore((s) => s.sittingState);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);

  // Don't show joystick when sitting or in interaction
  const shouldHide = sittingState.isSitting || roomInteractionState !== "none";

  const updateKnobPosition = useCallback((clientX: number, clientY: number) => {
    if (!knobRef.current) return;

    const deltaX = clientX - centerRef.current.x;
    const deltaY = clientY - centerRef.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    let clampedX = deltaX;
    let clampedY = deltaY;
    
    if (distance > MAX_DISTANCE) {
      const scale = MAX_DISTANCE / distance;
      clampedX = deltaX * scale;
      clampedY = deltaY * scale;
    }

    // Update visual position
    knobRef.current.style.transform = `translate(${clampedX}px, ${clampedY}px)`;

    // Normalize to -1 to 1 range
    const normalizedX = clampedX / MAX_DISTANCE;
    const normalizedY = -clampedY / MAX_DISTANCE; // Invert Y for game coordinates

    setJoystick(normalizedX, normalizedY);
  }, [setJoystick]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    
    const touch = e.touches[0];
    touchIdRef.current = touch.identifier;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    
    setIsJoystickActive(true);
    updateKnobPosition(touch.clientX, touch.clientY);
  }, [setIsJoystickActive, updateKnobPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;
    
    const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current);
    if (touch) {
      updateKnobPosition(touch.clientX, touch.clientY);
    }
  }, [updateKnobPosition]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current);
    if (touch) {
      touchIdRef.current = null;
      setIsJoystickActive(false);
      setJoystick(0, 0);
      
      if (knobRef.current) {
        knobRef.current.style.transform = "translate(0px, 0px)";
      }
    }
  }, [setJoystick, setIsJoystickActive]);

  // Reset joystick on unmount
  useEffect(() => {
    return () => {
      setJoystick(0, 0);
      setIsJoystickActive(false);
    };
  }, [setJoystick, setIsJoystickActive]);

  if (!isMobile || shouldHide) return null;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="fixed left-6 bottom-24 z-50 touch-none select-none"
      style={{
        width: JOYSTICK_SIZE,
        height: JOYSTICK_SIZE,
      }}
    >
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          border: "2px solid rgba(255,255,255,0.2)",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 4px 15px rgba(0,0,0,0.3)",
        }}
      />
      
      {/* Direction indicators */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-2 text-white/30 text-xs font-bold">W</div>
        <div className="absolute bottom-2 text-white/30 text-xs font-bold">S</div>
        <div className="absolute left-2 text-white/30 text-xs font-bold">A</div>
        <div className="absolute right-2 text-white/30 text-xs font-bold">D</div>
      </div>
      
      {/* Knob */}
      <div
        ref={knobRef}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          left: "50%",
          top: "50%",
          marginLeft: -KNOB_SIZE / 2,
          marginTop: -KNOB_SIZE / 2,
          background: "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(200,200,200,0.8))",
          boxShadow: "0 4px 15px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.5)",
          transition: "box-shadow 0.1s ease",
        }}
      />
    </div>
  );
}
