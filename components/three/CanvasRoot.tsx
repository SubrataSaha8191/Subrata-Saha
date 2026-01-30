"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useGameStore } from "@/store/useGameStore";

export default function CanvasRoot({ children }: { children: React.ReactNode }) {
  const isLoading = useGameStore((s) => s.isLoading);

  return (
    <Canvas
      shadows={!isLoading}
      frameloop={isLoading ? "never" : "always"}
      camera={{ fov: 60, near: 0.1, far: 500, position: [0, 8, 30] }}
      gl={{ antialias: !isLoading, powerPreference: isLoading ? "low-power" : "high-performance" }}
      dpr={isLoading ? 1 : [1, 2]}
    >
      <Suspense fallback={null}>
        {/* Fog for atmosphere and depth */}
        <fog attach="fog" args={["#87CEEB", 50, 200]} />

        {children}
      </Suspense>
    </Canvas>
  );
}