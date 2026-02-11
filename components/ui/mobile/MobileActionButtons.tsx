"use client";

import { useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMobileControlsStore } from "@/store/useMobileControlsStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useGameStore } from "@/store/useGameStore";
import { useUIStore } from "@/store/useUIStore";

export default function MobileActionButtons() {
  const isMobile = useIsMobile();
  const router = useRouter();
  
  const setIsJumpPressed = useMobileControlsStore((s) => s.setIsJumpPressed);
  const isSprintActive = useMobileControlsStore((s) => s.isSprintActive);
  const setIsSprintActive = useMobileControlsStore((s) => s.setIsSprintActive);
  const setIsInteractPressed = useMobileControlsStore((s) => s.setIsInteractPressed);
  const setIsBackPressed = useMobileControlsStore((s) => s.setIsBackPressed);
  const setIsSipPressed = useMobileControlsStore((s) => s.setIsSipPressed);
  const setIsNextPressed = useMobileControlsStore((s) => s.setIsNextPressed);
  
  const isInRoom = useGameStore((s) => s.isInRoom);
  const currentRoom = useGameStore((s) => s.currentRoom);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);
  const exitRoom = useGameStore((s) => s.exitRoom);
  const setLoading = useGameStore((s) => s.setLoading);
  const setLoadingStyle = useGameStore((s) => s.setLoadingStyle);
  const sittingState = useGameStore((s) => s.sittingState);
  const interactionPrompt = useUIStore((s) => s.interactionPrompt);
  const setPrompt = useUIStore((s) => s.setInteractionPrompt);
  const isNearExitDoor = useUIStore((s) => s.isNearExitDoor);
  
  const jumpTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const interactTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const backTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine what buttons to show based on state
  const promptText = interactionPrompt?.toLowerCase() ?? "";
  const isDoorEnterPrompt = promptText.includes("enter");
  const isDoorExitPrompt = promptText.includes("exit room");
  const isCastleDoorPrompt =
    promptText.includes("interact") && promptText.includes("door");
  const showJump = !sittingState.isSitting && roomInteractionState === "none";
  const showSprint = !sittingState.isSitting && roomInteractionState === "none";
  const showInteract =
    roomInteractionState !== "none" ||
    (!!interactionPrompt && !isDoorEnterPrompt && !isDoorExitPrompt && !isCastleDoorPrompt);
  const showBack = isInRoom || roomInteractionState !== "none" || sittingState.isSitting;
  const showSip =
    isInRoom && currentRoom === "about" && roomInteractionState === "holding_coffee";
  const showNext =
    isInRoom && currentRoom === "skills" && roomInteractionState === "using_computer";

  const showDoorAction =
    roomInteractionState === "none" &&
    (isInRoom
      ? isNearExitDoor || isDoorExitPrompt
      : !!interactionPrompt && (isDoorEnterPrompt || isCastleDoorPrompt));

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

  const handleSipStart = useCallback(() => {
    setIsSipPressed(true);
    if (sipTimeoutRef.current) clearTimeout(sipTimeoutRef.current);
    sipTimeoutRef.current = setTimeout(() => setIsSipPressed(false), 100);
  }, [setIsSipPressed]);

  const handleNextStart = useCallback(() => {
    setIsNextPressed(true);
    if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current);
    nextTimeoutRef.current = setTimeout(() => setIsNextPressed(false), 100);
  }, [setIsNextPressed]);

  const handleLeaveStart = useCallback(() => {
    setLoadingStyle("dots");
    setLoading(true);
    exitRoom();
    setPrompt(null);
    router.push("/");
  }, [exitRoom, router, setLoading, setLoadingStyle, setPrompt]);

  const handleDoorActionStart = useCallback(() => {
    if (isInRoom && (isDoorExitPrompt || isNearExitDoor)) {
      handleLeaveStart();
      return;
    }
    if (!isInRoom && (isDoorEnterPrompt || isCastleDoorPrompt)) {
      handleInteractStart();
    }
  }, [
    handleInteractStart,
    handleLeaveStart,
    isDoorEnterPrompt,
    isDoorExitPrompt,
    isCastleDoorPrompt,
    isInRoom,
    isNearExitDoor,
  ]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current);
      if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
      if (backTimeoutRef.current) clearTimeout(backTimeoutRef.current);
      if (sipTimeoutRef.current) clearTimeout(sipTimeoutRef.current);
      if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current);
    };
  }, []);

  if (!isMobile) return null;

  return (
    <div
      className="fixed right-4 bottom-36 z-50 flex flex-col-reverse gap-4 touch-none select-none"
      style={{ zIndex: 3000 }}
      data-mobile-control
    >
      {/* Jump Button - bottom */}
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
          <span className="text-white" aria-label="Jump">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </span>
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
          <span className="text-white" aria-label="Sprint">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
            </svg>
          </span>
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

      {/* Sip Button */}
      {showSip && (
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            handleSipStart();
          }}
          className="w-14 h-14 rounded-full flex items-center justify-center
                     active:scale-90 transition-transform"
          style={{
            background: "linear-gradient(145deg, rgba(168,85,247,0.9), rgba(126,34,206,0.9))",
            boxShadow: "0 4px 15px rgba(168,85,247,0.4), inset 0 2px 4px rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          <span className="text-white text-xs font-bold">Sip</span>
        </button>
      )}

      {/* Next Button */}
      {showNext && (
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            handleNextStart();
          }}
          className="w-14 h-14 rounded-full flex items-center justify-center
                     active:scale-90 transition-transform"
          style={{
            background: "linear-gradient(145deg, rgba(14,165,233,0.95), rgba(2,132,199,0.95))",
            boxShadow: "0 4px 15px rgba(14,165,233,0.4), inset 0 2px 4px rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          <span className="text-white text-xs font-bold">Next</span>
        </button>
      )}

      {/* Back/Exit Button - top */}
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

      {/* Door Action Button (enter/leave) */}
      {showDoorAction && (
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            handleDoorActionStart();
          }}
          onClick={(e) => {
            e.preventDefault();
            handleDoorActionStart();
          }}
          className="w-14 h-14 rounded-full flex items-center justify-center
                     active:scale-90 transition-transform"
          style={{
            background: isInRoom
              ? "linear-gradient(145deg, rgba(14,116,144,0.95), rgba(8,47,73,0.95))"
              : "linear-gradient(145deg, rgba(16,185,129,0.95), rgba(5,150,105,0.95))",
            boxShadow: isInRoom
              ? "0 4px 15px rgba(8,145,178,0.45), inset 0 2px 4px rgba(255,255,255,0.2)"
              : "0 4px 15px rgba(16,185,129,0.45), inset 0 2px 4px rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          <span className="text-white text-xs font-bold">
            {isInRoom ? "Leave" : "Enter"}
          </span>
        </button>
      )}
    </div>
  );
}
