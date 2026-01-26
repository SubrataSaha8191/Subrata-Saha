"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DoorProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  frameColor?: string;
  isOpen?: boolean;
}

export default function RealisticDoor({
  position,
  rotation = [0, 0, 0],
  color = "#8B4513",
  frameColor = "#5D4037",
  isOpen = false,
}: DoorProps) {
  const doorRef = useRef<THREE.Group>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const targetRotation = isOpen ? -Math.PI / 2 : 0;

  useFrame((_, delta) => {
    if (doorRef.current) {
      const diff = targetRotation - currentRotation;
      if (Math.abs(diff) > 0.01) {
        const newRotation = currentRotation + diff * delta * 3;
        setCurrentRotation(newRotation);
        doorRef.current.rotation.y = newRotation;
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Door frame */}
      {/* Left frame */}
      <mesh castShadow position={[-1.1, 1.5, 0]}>
        <boxGeometry args={[0.2, 3.2, 0.3]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      {/* Right frame */}
      <mesh castShadow position={[1.1, 1.5, 0]}>
        <boxGeometry args={[0.2, 3.2, 0.3]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      {/* Top frame */}
      <mesh castShadow position={[0, 3.1, 0]}>
        <boxGeometry args={[2.4, 0.2, 0.3]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>

      {/* Door (with hinge pivot) */}
      <group ref={doorRef} position={[-0.9, 0, 0]}>
        <mesh castShadow receiveShadow position={[0.9, 1.5, 0]}>
          <boxGeometry args={[1.8, 3, 0.15]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>

        {/* Door panels */}
        {[
          [0.5, 2.2, 0.08],
          [1.3, 2.2, 0.08],
          [0.5, 0.8, 0.08],
          [1.3, 0.8, 0.08],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <boxGeometry args={[0.6, 1, 0.05]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
        ))}

        {/* Door handle */}
        <mesh position={[1.5, 1.5, 0.15]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1.5, 1.5, 0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
          <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Door hinges */}
        {[0.5, 1.5, 2.5].map((y, i) => (
          <mesh key={i} position={[0.05, y, 0.08]} castShadow>
            <boxGeometry args={[0.1, 0.2, 0.05]} />
            <meshStandardMaterial color="#333" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Decorative arch */}
      <mesh position={[0, 3.3, -0.1]} castShadow>
        <torusGeometry args={[1, 0.1, 8, 16, Math.PI]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
    </group>
  );
}
