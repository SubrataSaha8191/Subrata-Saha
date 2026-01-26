"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RealisticLighting() {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      // Subtle sun movement
      const time = clock.getElapsedTime() * 0.01;
      sunRef.current.position.x = 50 + Math.sin(time) * 10;
    }
  });

  return (
    <>
      {/* Main sunlight */}
      <directionalLight
        ref={sunRef}
        position={[50, 80, 30]}
        intensity={2}
        color="#FFF5E1"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={200}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.0001}
      />

      {/* Ambient light for soft fill */}
      <ambientLight intensity={0.4} color="#87CEEB" />

      {/* Hemisphere light for natural outdoor feel */}
      <hemisphereLight
        args={["#87CEEB", "#228B22", 0.6]}
      />

      {/* Subtle fill light from opposite side */}
      <directionalLight
        position={[-30, 20, -20]}
        intensity={0.3}
        color="#FFE4B5"
      />

      {/* Rim light for depth */}
      <directionalLight
        position={[0, 10, -50]}
        intensity={0.2}
        color="#FFA500"
      />
    </>
  );
}
