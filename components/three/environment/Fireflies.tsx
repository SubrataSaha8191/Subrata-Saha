"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Fireflies({ count = 25 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const fireflies = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      startPos: [
        (Math.random() - 0.5) * 50,
        1 + Math.random() * 5,
        (Math.random() - 0.5) * 50,
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.6,
      radius: 1 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      glowColor: ["#7CFC00", "#ADFF2F", "#32CD32", "#00FF7F", "#98FB98"][
        Math.floor(Math.random() * 5)
      ],
      blinkSpeed: 2 + Math.random() * 3,
      blinkOffset: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();

    groupRef.current.children.forEach((firefly, i) => {
      const data = fireflies[i];
      const t = time * data.speed + data.phase;

      // Gentle floating movement
      firefly.position.x = data.startPos[0] + Math.sin(t) * data.radius;
      firefly.position.y = data.startPos[1] + Math.sin(t * 1.5) * 0.8;
      firefly.position.z = data.startPos[2] + Math.cos(t * 0.8) * data.radius;

      // Blinking glow effect
      const blink = (Math.sin(time * data.blinkSpeed + data.blinkOffset) + 1) / 2;
      const glowMesh = firefly.children[0] as THREE.Mesh;
      const light = firefly.children[1] as THREE.PointLight;
      
      if (glowMesh && glowMesh.material) {
        const mat = glowMesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1 + blink * 3;
        mat.opacity = 0.6 + blink * 0.4;
      }
      
      if (light) {
        light.intensity = 0.5 + blink * 2;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {fireflies.map((f, i) => (
        <group key={i} position={f.startPos}>
          {/* Glowing body */}
          <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial
              color={f.glowColor}
              emissive={f.glowColor}
              emissiveIntensity={2}
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Point light for glow effect */}
          <pointLight
            color={f.glowColor}
            intensity={1.5}
            distance={4}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}
