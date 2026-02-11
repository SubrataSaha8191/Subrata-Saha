"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function CanvasRoot({ children }: { children: React.ReactNode }) {
  const isLoading = useGameStore((s) => s.isLoading);
  const isMobile = useIsMobile();

  return (
    <Canvas
      shadows={!isLoading && !isMobile}
      frameloop={isLoading ? "never" : "always"}
      camera={{ fov: isMobile ? 70 : 60, near: 0.1, far: 300, position: [0, 8, 30] }}
      gl={{
        antialias: false,
        powerPreference: isMobile ? "low-power" : "high-performance",
        stencil: false,
        depth: true,
        alpha: false,
        preserveDrawingBuffer: false,
      }}
      dpr={isMobile ? 1 : [1, 2]}
      performance={{ min: 0.5 }}
      style={{ touchAction: "none" }}
    >
      <Suspense
        fallback={
          <>
            <color attach="background" args={["#0b0f17"]} />
            <ambientLight intensity={0.6} />
          </>
        }
      >
        {/* Fog for atmosphere and depth */}
        <fog attach="fog" args={["#87CEEB", 50, 200]} />

        {children}
      </Suspense>
    </Canvas>
  );
}