"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky as DreiSky, Cloud, Stars } from "@react-three/drei";
import * as THREE from "three";

export default function FantasySky() {
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.002;
    }
  });

  return (
    <>
      {/* Realistic sky with sun */}
      <DreiSky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.6}
        azimuth={0.25}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        rayleigh={0.5}
        turbidity={10}
      />

      {/* Stars visible at edges */}
      <Stars
        radius={300}
        depth={60}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Floating clouds */}
      <group ref={cloudsRef}>
        <Cloud position={[-30, 25, -40]} speed={0.2} opacity={0.6} />
        <Cloud position={[40, 30, -60]} speed={0.1} opacity={0.5} />
        <Cloud position={[20, 22, 50]} speed={0.15} opacity={0.7} />
        <Cloud position={[-50, 28, 30]} speed={0.1} opacity={0.4} />
        <Cloud position={[0, 35, -80]} speed={0.05} opacity={0.5} />
        <Cloud position={[60, 26, 0]} speed={0.12} opacity={0.6} />
      </group>
    </>
  );
}
