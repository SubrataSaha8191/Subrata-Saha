"use client";

import React from "react";

export default function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        pointerEvents: "auto",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 100%)",
          borderRadius: 18,
          border: "1px solid var(--border)",
          background: "var(--panel)",
          backdropFilter: "blur(12px)",
          padding: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div style={{ fontWeight: 800 }}>{title ?? "Details"}</div>
          <button
            onClick={onClose}
            style={{
              border: "1px solid var(--border)",
              background: "rgba(232,238,252,0.06)",
              color: "var(--fg)",
              borderRadius: 12,
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}