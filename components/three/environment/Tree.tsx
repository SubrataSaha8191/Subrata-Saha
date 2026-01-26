"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TreeProps {
  position: [number, number, number];
  scale?: number;
  trunkColor?: string;
  leafColor?: string;
}

export default function Tree({
  position,
  scale = 1,
  trunkColor = "#8B4513",
  leafColor = "#228B22",
}: TreeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (leavesRef.current) {
      const time = clock.getElapsedTime();
      // Gentle swaying
      leavesRef.current.rotation.z = Math.sin(time * 0.5 + phase) * 0.02;
      leavesRef.current.rotation.x = Math.cos(time * 0.3 + phase) * 0.015;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Trunk */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.35, 3, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* Leaves - multiple layers for fullness */}
      <group ref={leavesRef}>
        <mesh castShadow receiveShadow position={[0, 3.5, 0]}>
          <coneGeometry args={[1.8, 2.5, 8]} />
          <meshStandardMaterial color={leafColor} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 4.5, 0]}>
          <coneGeometry args={[1.4, 2, 8]} />
          <meshStandardMaterial color={leafColor} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 5.3, 0]}>
          <coneGeometry args={[1, 1.5, 8]} />
          <meshStandardMaterial color={leafColor} flatShading />
        </mesh>
      </group>
    </group>
  );
}

// Forest of trees
export function Forest({ count = 30, area = 60, avoidCenter = 15 }: { count?: number; area?: number; avoidCenter?: number }) {
  const trees = useMemo(() => {
    const positions: { pos: [number, number, number]; scale: number; leafColor: string }[] = [];
    
    for (let i = 0; i < count; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * area;
        z = (Math.random() - 0.5) * area;
      } while (
        // Avoid center area (bridge + main area)
        (Math.abs(x) < avoidCenter && Math.abs(z) < avoidCenter) ||
        // Avoid castle areas
        (Math.abs(x - 25) < 12 && Math.abs(z + 20) < 12) ||
        (Math.abs(x + 25) < 12 && Math.abs(z + 20) < 12)
      );
      
      const scale = 0.8 + Math.random() * 0.8;
      const leafColors = ["#228B22", "#2E8B57", "#32CD32", "#006400", "#3CB371"];
      const leafColor = leafColors[Math.floor(Math.random() * leafColors.length)];
      
      positions.push({ pos: [x, 0, z], scale, leafColor });
    }
    return positions;
  }, [count, area, avoidCenter]);

  return (
    <group>
      {trees.map((tree, i) => (
        <Tree
          key={i}
          position={tree.pos}
          scale={tree.scale}
          leafColor={tree.leafColor}
        />
      ))}
    </group>
  );
}
