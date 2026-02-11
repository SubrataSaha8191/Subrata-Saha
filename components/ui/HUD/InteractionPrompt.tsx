"use client";

import { useUIStore } from "@/store/useUIStore";
import { useGameStore } from "@/store/useGameStore";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function InteractionPrompt() {
  const prompt = useUIStore((s) => s.interactionPrompt);
  const isNearExitDoor = useUIStore((s) => s.isNearExitDoor);
  const isInRoom = useGameStore((s) => s.isInRoom);
  const isMobile = useIsMobile();

  const isExitPrompt =
    isInRoom && (isNearExitDoor || !!prompt?.toLowerCase().includes("exit room"));

  const promptText = prompt?.toLowerCase() ?? "";
  const isDoorPrompt =
    isExitPrompt ||
    promptText.includes("exit room") ||
    promptText.startsWith("enter ") ||
    promptText.includes("press e to enter") ||
    (promptText.includes("door") && promptText.includes("interact"));

  let displayPrompt = isExitPrompt ? "Leave room" : prompt;

  if (isMobile && displayPrompt) {
    if (promptText.includes("press e to ")) {
      displayPrompt = displayPrompt.replace(/press e to\s+/i, "");
      displayPrompt = displayPrompt.charAt(0).toUpperCase() + displayPrompt.slice(1);
    }
    if (promptText.includes("interact with") && promptText.includes("door")) {
      displayPrompt = displayPrompt.replace(/interact with\s+/i, "");
    }
    if (promptText.includes("exit room")) {
      displayPrompt = "Leave room";
    }
  }

  if (!prompt && !isExitPrompt) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "58%",
        transform: "translateX(-50%)",
        padding: "10px 14px",
        borderRadius: 14,
        border: "1px solid var(--border)",
        background: "var(--panel)",
        backdropFilter: "blur(10px)",
        fontSize: 14,
        color: "var(--fg)",
        zIndex: 6000,
      }}
    >
      <span style={{ opacity: 0.9 }}>{displayPrompt}</span>
      <span
        style={{
          marginLeft: 10,
          padding: "2px 8px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "rgba(232,238,252,0.06)",
          fontWeight: 700,
        }}
      >
        {isExitPrompt ? "Leave" : isMobile && isDoorPrompt ? "Enter" : "E"}
      </span>
    </div>
  );
}