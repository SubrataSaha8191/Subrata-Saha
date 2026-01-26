"use client";

import Crosshair from "./Crosshair";
import InteractionPrompt from "./InteractionPrompt";
import LoadingOverlay from "./LoadingOverlay";

export default function HUD() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <Crosshair />
      <InteractionPrompt />
      <LoadingOverlay />

      <div
        style={{
          position: "absolute",
          left: 16,
          bottom: 16,
          padding: "10px 12px",
          border: "1px solid var(--border)",
          borderRadius: 14,
          background: "var(--panel)",
          backdropFilter: "blur(10px)",
          pointerEvents: "auto",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 14 }}>Controls</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          WASD / Arrow keys to move • Shift to sprint • E to enter portal
        </div>
      </div>
    </div>
  );
}