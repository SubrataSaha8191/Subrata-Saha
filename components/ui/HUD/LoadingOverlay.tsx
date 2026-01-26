"use client";

import { useGameStore } from "@/store/useGameStore";

export default function LoadingOverlay() {
  const isLoading = useGameStore((s) => s.isLoading);

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "rgba(0,0,0,0.45)",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          padding: 16,
          borderRadius: 16,
          border: "1px solid var(--border)",
          background: "var(--panel)",
          backdropFilter: "blur(10px)",
          textAlign: "center",
          minWidth: 260,
        }}
      >
        <div style={{ fontWeight: 800 }}>Loading…</div>
        <div style={{ marginTop: 6, fontSize: 13, color: "var(--muted)" }}>
          Preparing the world
        </div>
      </div>
    </div>
  );
}