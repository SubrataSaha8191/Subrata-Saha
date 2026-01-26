"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CastleProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
  name: string;
}

export default function Castle({
  position,
  scale = 1,
  color = "#6B7280",
  name,
}: CastleProps) {
  const flagRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (flagRef.current) {
      const time = clock.getElapsedTime();
      flagRef.current.rotation.y = Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Main castle body */}
      <mesh castShadow receiveShadow position={[0, 4, 0]}>
        <boxGeometry args={[8, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Front wall with door opening */}
      <mesh castShadow receiveShadow position={[0, 2, 4.1]}>
        <boxGeometry args={[8, 4, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Corner towers */}
      {[
        [-4, 0, -4],
        [4, 0, -4],
        [-4, 0, 4],
        [4, 0, 4],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Tower body */}
          <mesh castShadow receiveShadow position={[0, 5, 0]}>
            <cylinderGeometry args={[1.5, 1.8, 10, 8]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
          {/* Tower roof */}
          <mesh castShadow position={[0, 11, 0]}>
            <coneGeometry args={[2, 3, 8]} />
            <meshStandardMaterial color="#8B0000" roughness={0.7} />
          </mesh>
          {/* Tower battlements */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
            <mesh
              key={j}
              castShadow
              position={[
                Math.cos((j / 8) * Math.PI * 2) * 1.5,
                9.5,
                Math.sin((j / 8) * Math.PI * 2) * 1.5,
              ]}
            >
              <boxGeometry args={[0.5, 1, 0.5]} />
              <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Main battlements */}
      {[-3, -1, 1, 3].map((x) => (
        <mesh key={x} castShadow position={[x, 8.5, 0]}>
          <boxGeometry args={[1, 1, 8]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}

      {/* Central tower with flag */}
      <mesh castShadow receiveShadow position={[0, 10, 0]}>
        <cylinderGeometry args={[1.2, 1.5, 6, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 14, 0]}>
        <coneGeometry args={[1.8, 2.5, 8]} />
        <meshStandardMaterial color="#8B0000" roughness={0.7} />
      </mesh>

      {/* Flag pole */}
      <mesh position={[0, 16.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 6]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Flag */}
      <mesh ref={flagRef} position={[0.6, 17, 0]}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial color="#FFD700" side={THREE.DoubleSide} />
      </mesh>

      {/* Windows */}
      {[
        [0, 5, 4.2],
        [2.5, 5, 4.2],
        [-2.5, 5, 4.2],
        [0, 3, 4.2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.8, 1.2, 0.1]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      ))}

      {/* Torches */}
      {[
        [-2, 2.5, 4.3],
        [2, 2.5, 4.3],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.1, 0.5, 6]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          <pointLight
            position={[0, 0.4, 0]}
            color="#ff6600"
            intensity={2}
            distance={5}
          />
          {/* Flame effect */}
          <mesh position={[0, 0.4, 0]}>
            <coneGeometry args={[0.1, 0.3, 6]} />
            <meshStandardMaterial
              color="#ff4500"
              emissive="#ff4500"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}

      {/* Castle name sign */}
      <mesh position={[0, 0.5, 5]} castShadow>
        <boxGeometry args={[3, 0.8, 0.1]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
    </group>
  );
}
