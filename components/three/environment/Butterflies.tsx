"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Butterflies({ count = 15 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const frameCount = useRef(0);

  const butterflies = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      startPos: [
        (Math.random() - 0.5) * 40,
        2 + Math.random() * 4,
        (Math.random() - 0.5) * 40,
      ] as [number, number, number],
      speed: 0.5 + Math.random() * 1,
      radius: 2 + Math.random() * 4,
      phase: Math.random() * Math.PI * 2,
      color: ["#FF69B4", "#FFD700", "#00CED1", "#FF6347", "#9370DB"][
        Math.floor(Math.random() * 5)
      ],
    }));
  }, [count]);

  useFrame(({ clock }) => {
    // Skip frames to reduce CPU usage
    frameCount.current++;
    if (frameCount.current % 2 !== 0) return;
    
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();

    groupRef.current.children.forEach((butterfly, i) => {
      const data = butterflies[i];
      const t = time * data.speed + data.phase;

      butterfly.position.x = data.startPos[0] + Math.sin(t) * data.radius;
      butterfly.position.y = data.startPos[1] + Math.sin(t * 2) * 0.5;
      butterfly.position.z = data.startPos[2] + Math.cos(t) * data.radius;

      // Face movement direction
      butterfly.rotation.y = t + Math.PI / 2;

      // Wing flap
      const wings = butterfly.children;
      if (wings[0] && wings[1]) {
        const flap = Math.sin(time * 15) * 0.5;
        wings[0].rotation.y = flap;
        wings[1].rotation.y = -flap;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {butterflies.map((b, i) => (
        <group key={i} position={b.startPos}>
          {/* Left wing */}
          <mesh position={[-0.1, 0, 0]} rotation={[0, 0, 0]}>
            <planeGeometry args={[0.2, 0.15]} />
            <meshStandardMaterial
              color={b.color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Right wing */}
          <mesh position={[0.1, 0, 0]} rotation={[0, 0, 0]}>
            <planeGeometry args={[0.2, 0.15]} />
            <meshStandardMaterial
              color={b.color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Body */}
          <mesh>
            <capsuleGeometry args={[0.02, 0.1, 4, 6]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
