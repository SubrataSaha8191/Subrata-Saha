"use client";

import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";

export default function ContactPage() {
  return (
    <>
      <SceneRoot scene="hub" />
      <HUD />
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 16,
          padding: 12,
          border: "1px solid var(--border)",
          borderRadius: 12,
          background: "var(--panel)",
          maxWidth: 420,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Contact</div>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.4 }}>
          Add a form or your social links here.
        </div>
      </div>
    </>
  );
}