"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FlowerProps {
  position: [number, number, number];
  color?: string;
}

function Flower({ position, color = "#FF69B4" }: FlowerProps) {
  const flowerRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (flowerRef.current) {
      const time = clock.getElapsedTime();
      flowerRef.current.rotation.z = Math.sin(time + position[0]) * 0.05;
    }
  });

  return (
    <group ref={flowerRef} position={position}>
      {/* Stem */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.03, 0.4, 6]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      {/* Flower petals */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.1,
            0.25,
            Math.sin((i / 6) * Math.PI * 2) * 0.1,
          ]}
          rotation={[0.3, 0, (i / 6) * Math.PI * 2]}
        >
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      {/* Center */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}

export default function Flowers({ count = 100, area = 60 }: { count?: number; area?: number }) {
  const flowers = [];
  const colors = ["#FF69B4", "#FF6347", "#FFD700", "#9370DB", "#00CED1", "#FF4500"];

  for (let i = 0; i < count; i++) {
    let x, z;
    do {
      x = (Math.random() - 0.5) * area;
      z = (Math.random() - 0.5) * area;
    } while (
      // Avoid paths and bridge
      (Math.abs(x) < 4 && z > 0) ||
      (Math.abs(x - 12) < 4 && Math.abs(z + 10) < 15) ||
      (Math.abs(x + 12) < 4 && Math.abs(z + 10) < 15)
    );

    flowers.push({
      pos: [x, 0.2, z] as [number, number, number],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  return (
    <group>
      {flowers.map((flower, i) => (
        <Flower key={i} position={flower.pos} color={flower.color} />
      ))}
    </group>
  );
}
