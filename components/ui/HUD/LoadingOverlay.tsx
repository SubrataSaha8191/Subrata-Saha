"use client";

import { useGameStore } from "@/store/useGameStore";

export default function LoadingOverlay() {
  const isLoading = useGameStore((s) => s.isLoading);
  const loadingStyle = useGameStore((s) => s.loadingStyle);

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
      {loadingStyle === "dots" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: 14,
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: "rgba(10,10,10,0.65)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <style jsx>{`
            .dot {
              width: 8px;
              height: 8px;
              border-radius: 999px;
              background: #ffffff;
              opacity: 0.35;
              animation: dotPulse 0.9s infinite ease-in-out;
            }
            .dot:nth-child(2) {
              animation-delay: 0.15s;
            }
            .dot:nth-child(3) {
              animation-delay: 0.3s;
            }
            @keyframes dotPulse {
              0%,
              80%,
              100% {
                transform: translateY(0);
                opacity: 0.35;
              }
              40% {
                transform: translateY(-5px);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      ) : (
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
          <div style={{ fontWeight: 800 }}>Loading...</div>
          <div style={{ marginTop: 6, fontSize: 13, color: "var(--muted)" }}>
            Preparing the world
          </div>
        </div>
      )}
    </div>
  );
}