"use client";

import { useUIStore } from "@/store/useUIStore";
import { useGameStore } from "@/store/useGameStore";

export default function InteractionPrompt() {
  const prompt = useUIStore((s) => s.interactionPrompt);
  const isNearExitDoor = useUIStore((s) => s.isNearExitDoor);
  const isInRoom = useGameStore((s) => s.isInRoom);

  const isExitPrompt =
    isInRoom && (isNearExitDoor || !!prompt?.toLowerCase().includes("exit room"));

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
      }}
    >
      <span style={{ opacity: 0.9 }}>{isExitPrompt ? "Leave room" : prompt}</span>
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
        {isExitPrompt ? "Leave" : "E"}
      </span>
    </div>
  );
}