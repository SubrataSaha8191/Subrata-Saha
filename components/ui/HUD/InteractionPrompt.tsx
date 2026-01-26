"use client";

import { useUIStore } from "@/store/useUIStore";

export default function InteractionPrompt() {
  const prompt = useUIStore((s) => s.interactionPrompt);

  if (!prompt) return null;

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
      <span style={{ opacity: 0.9 }}>{prompt}</span>
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
        E
      </span>
    </div>
  );
}