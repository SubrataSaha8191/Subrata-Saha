"use client";

import { useCallback, useRef, useEffect } from "react";
import { useMobileControlsStore } from "@/store/useMobileControlsStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useGameStore } from "@/store/useGameStore";
import { useUIStore } from "@/store/useUIStore";

export default function MobileActionButtons() {
  const isMobile = useIsMobile();
  
  const setIsJumpPressed = useMobileControlsStore((s) => s.setIsJumpPressed);
  const isSprintActive = useMobileControlsStore((s) => s.isSprintActive);
  const setIsSprintActive = useMobileControlsStore((s) => s.setIsSprintActive);
  const setIsInteractPressed = useMobileControlsStore((s) => s.setIsInteractPressed);
  const setIsBackPressed = useMobileControlsStore((s) => s.setIsBackPressed);
  
  const isInRoom = useGameStore((s) => s.isInRoom);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);
  const sittingState = useGameStore((s) => s.sittingState);
  const interactionPrompt = useUIStore((s) => s.interactionPrompt);
  
  const jumpTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const interactTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const backTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine what buttons to show based on state
  const showJump = !sittingState.isSitting && roomInteractionState === "none";
  const showSprint = !sittingState.isSitting && roomInteractionState === "none";
  const showInteract = !!interactionPrompt || roomInteractionState !== "none";
  const showBack = isInRoom || roomInteractionState !== "none" || sittingState.isSitting;

  const handleJumpStart = useCallback(() => {
    setIsJumpPressed(true);
    if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current);
    jumpTimeoutRef.current = setTimeout(() => setIsJumpPressed(false), 100);
  }, [setIsJumpPressed]);

  const handleSprintToggle = useCallback(() => {
    setIsSprintActive(!isSprintActive);
  }, [isSprintActive, setIsSprintActive]);

  const handleInteractStart = useCallback(() => {
    setIsInteractPressed(true);
    if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
    interactTimeoutRef.current = setTimeout(() => setIsInteractPressed(false), 100);
  }, [setIsInteractPressed]);

  const handleBackStart = useCallback(() => {
    setIsBackPressed(true);
    if (backTimeoutRef.current) clearTimeout(backTimeoutRef.current);
    backTimeoutRef.current = setTimeout(() => setIsBackPressed(false), 100);
  }, [setIsBackPressed]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current);
      if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
      if (backTimeoutRef.current) clearTimeout(backTimeoutRef.current);
    };
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed right-4 bottom-20 z-50 flex flex-col gap-3 touch-none select-none">
      {/* Back/Exit Button */}
      {showBack && (
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            handleBackStart();
          }}
          className="w-14 h-14 rounded-full flex items-center justify-center
                     active:scale-90 transition-transform"
          style={{
            background: "linear-gradient(145deg, rgba(239,68,68,0.9), rgba(185,28,28,0.9))",
            boxShadow: "0 4px 15px rgba(239,68,68,0.4), inset 0 2px 4px rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          <span className="text-white text-xl font-bold">✕</span>
        </button>
      )}

      {/* Interact Button */}
      {showInteract && (
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            handleInteractStart();
          }}
          className="w-14 h-14 rounded-full flex items-center justify-center
                     active:scale-90 transition-transform"
          style={{
            background: "linear-gradient(145deg, rgba(34,197,94,0.9), rgba(22,163,74,0.9))",
            boxShadow: "0 4px 15px rgba(34,197,94,0.4), inset 0 2px 4px rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          <span className="text-white text-xl font-bold">E</span>
        </button>
      )}

      {/* Sprint Toggle Button */}
      {showSprint && (
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            handleSprintToggle();
          }}
          className="w-14 h-14 rounded-full flex items-center justify-center
                     active:scale-90 transition-transform"
          style={{
            background: isSprintActive 
              ? "linear-gradient(145deg, rgba(249,115,22,0.95), rgba(234,88,12,0.95))"
              : "linear-gradient(145deg, rgba(100,100,100,0.9), rgba(70,70,70,0.9))",
            boxShadow: isSprintActive 
              ? "0 4px 15px rgba(249,115,22,0.5), inset 0 2px 4px rgba(255,255,255,0.2)"
              : "0 4px 15px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          <span className="text-white text-lg font-bold">🏃</span>
        </button>
      )}

      {/* Jump Button */}
      {showJump && (
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            handleJumpStart();
          }}
          className="w-16 h-16 rounded-full flex items-center justify-center
                     active:scale-90 transition-transform"
          style={{
            background: "linear-gradient(145deg, rgba(59,130,246,0.9), rgba(37,99,235,0.9))",
            boxShadow: "0 4px 15px rgba(59,130,246,0.4), inset 0 2px 4px rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          <span className="text-white text-2xl">⬆</span>
        </button>
      )}
    </div>
  );
}
