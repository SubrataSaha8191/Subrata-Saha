"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RockProps {
  position: [number, number, number];
  scale?: number;
}

function Rock({ position, scale = 1 }: RockProps) {
  const rotation = useMemo(
    () => [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
    []
  );

  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#696969" roughness={0.9} flatShading />
    </mesh>
  );
}

export default function Rocks({ count = 40, area = 60 }: { count?: number; area?: number }) {
  const rocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * area;
        z = (Math.random() - 0.5) * area;
      } while (
        // Avoid paths
        (Math.abs(x) < 5 && z > 0) ||
        (Math.abs(x - 12) < 5 && Math.abs(z + 10) < 20) ||
        (Math.abs(x + 12) < 5 && Math.abs(z + 10) < 20)
      );

      arr.push({
        pos: [x, 0.2, z] as [number, number, number],
        scale: 0.5 + Math.random() * 1.5,
      });
    }
    return arr;
  }, [count, area]);

  return (
    <group>
      {rocks.map((rock, i) => (
        <Rock key={i} position={rock.pos} scale={rock.scale} />
      ))}
    </group>
  );
}

// Water pond component
export function Pond({ position = [0, 0, 0] as [number, number, number] }) {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (waterRef.current) {
      const time = clock.getElapsedTime();
      waterRef.current.position.y = -0.05 + Math.sin(time) * 0.02;
    }
  });

  return (
    <group position={position}>
      {/* Pond border rocks */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 3.5;
        return (
          <Rock
            key={i}
            position={[
              Math.cos(angle) * radius,
              0.1,
              Math.sin(angle) * radius,
            ]}
            scale={0.8 + Math.random() * 0.5}
          />
        );
      })}

      {/* Water */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial
          color="#1E90FF"
          transparent
          opacity={0.7}
          metalness={0.2}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}
