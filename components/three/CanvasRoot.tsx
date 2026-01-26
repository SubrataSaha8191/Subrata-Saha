"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

export default function CanvasRoot({ children }: { children: React.ReactNode }) {
  return (
    <Canvas
      shadows
      camera={{ fov: 60, near: 0.1, far: 500, position: [0, 8, 30] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        {/* Fog for atmosphere and depth */}
        <fog attach="fog" args={["#87CEEB", 50, 200]} />

        {children}
      </Suspense>
    </Canvas>
  );
}