"use client";

import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";

export default function AboutPage() {
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
        <div style={{ fontWeight: 700, marginBottom: 6 }}>About</div>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.4 }}>
          Replace this with your About section. You can also make a dedicated 3D
          room later.
        </div>
      </div>
    </>
  );
}