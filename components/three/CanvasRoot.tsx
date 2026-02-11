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
      camera={{ fov: 60, near: 0.1, far: 300, position: [0, 8, 30] }}
      gl={{ 
        antialias: false, 
        powerPreference: "high-performance", 
        stencil: false, 
        depth: true,
        alpha: false,
        preserveDrawingBuffer: false,
      }}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      style={{ touchAction: "none" }}
    >
      <Suspense fallback={null}>
        {/* Fog for atmosphere and depth */}
        <fog attach="fog" args={["#87CEEB", 50, 200]} />

        {children}
      </Suspense>
    </Canvas>
  );
}