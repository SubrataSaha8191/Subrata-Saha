"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BridgeProps {
  position?: [number, number, number];
  length?: number;
  width?: number;
}

export default function HangingBridge({
  position = [0, 0, 20],
  length = 12,
  width = 3,
}: BridgeProps) {
  const bridgeRef = useRef<THREE.Group>(null);
  const planksRef = useRef<THREE.Group>(null);
  const ropesRef = useRef<THREE.Group>(null);

  const plankCount = Math.floor(length * 2);

  // Animation for gentle swaying
  useFrame(({ clock }) => {
    if (bridgeRef.current) {
      const time = clock.getElapsedTime();
      bridgeRef.current.rotation.z = Math.sin(time * 0.5) * 0.01;
      bridgeRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.03;
    }
  });

  const planks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < plankCount; i++) {
      const z = (i / plankCount - 0.5) * length;
      const sag = Math.sin((i / plankCount) * Math.PI) * 0.5;
      arr.push({ z, y: -sag });
    }
    return arr;
  }, [plankCount, length]);

  return (
    <group ref={bridgeRef} position={position}>
      {/* Wooden planks */}
      <group ref={planksRef}>
        {planks.map((plank, i) => (
          <mesh
            key={i}
            position={[0, plank.y, plank.z]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, 0.1, 0.4]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#8B4513" : "#A0522D"}
              roughness={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Support posts at start */}
      <mesh position={[-width / 2 - 0.15, 1.5, -length / 2]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 4, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.8} />
      </mesh>
      <mesh position={[width / 2 + 0.15, 1.5, -length / 2]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 4, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.8} />
      </mesh>

      {/* Support posts at end */}
      <mesh position={[-width / 2 - 0.15, 1.5, length / 2]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 4, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.8} />
      </mesh>
      <mesh position={[width / 2 + 0.15, 1.5, length / 2]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 4, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.8} />
      </mesh>

      {/* Rope rails - left side */}
      <group ref={ropesRef}>
        {planks.map((plank, i) => (
          <mesh
            key={`rope-l-${i}`}
            position={[-width / 2 - 0.1, plank.y + 1.2, plank.z]}
          >
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#8B7355" roughness={1} />
          </mesh>
        ))}
        {/* Rope rails - right side */}
        {planks.map((plank, i) => (
          <mesh
            key={`rope-r-${i}`}
            position={[width / 2 + 0.1, plank.y + 1.2, plank.z]}
          >
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#8B7355" roughness={1} />
          </mesh>
        ))}
      </group>

      {/* Rope lines connecting posts */}
      <mesh position={[-width / 2 - 0.1, 1.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, length, 8]} />
        <meshStandardMaterial color="#8B7355" />
        <mesh rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      <mesh position={[width / 2 + 0.1, 1.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, length, 8]} />
        <meshStandardMaterial color="#8B7355" />
        <mesh rotation={[Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Water/chasm below */}
      <mesh position={[0, -3, 0]} receiveShadow>
        <boxGeometry args={[width + 4, 0.5, length + 2]} />
        <meshStandardMaterial
          color="#1a5276"
          transparent
          opacity={0.8}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Rock walls on sides */}
      <mesh position={[-width - 2, -1, 0]} castShadow>
        <boxGeometry args={[3, 4, length + 4]} />
        <meshStandardMaterial color="#4a4a4a" roughness={1} />
      </mesh>
      <mesh position={[width + 2, -1, 0]} castShadow>
        <boxGeometry args={[3, 4, length + 4]} />
        <meshStandardMaterial color="#4a4a4a" roughness={1} />
      </mesh>
    </group>
  );
}
