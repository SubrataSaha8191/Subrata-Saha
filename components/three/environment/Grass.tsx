"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GRASS_COUNT = 15000;
const GRASS_AREA = 80;

export default function AnimatedGrass() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-calculate grass positions and properties
  const grassData = useMemo(() => {
    const data = [];
    for (let i = 0; i < GRASS_COUNT; i++) {
      const x = (Math.random() - 0.5) * GRASS_AREA;
      const z = (Math.random() - 0.5) * GRASS_AREA;
      // Avoid bridge area
      if (Math.abs(x) < 3 && z > 5 && z < 25) continue;
      // Avoid castle areas
      if (Math.abs(x - 25) < 8 && Math.abs(z + 20) < 8) continue;
      if (Math.abs(x + 25) < 8 && Math.abs(z + 20) < 8) continue;
      
      data.push({
        x,
        z,
        scale: 0.3 + Math.random() * 0.5,
        rotationY: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      });
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    grassData.forEach((grass, i) => {
      // Sway animation
      const sway = Math.sin(time * grass.speed + grass.phase) * 0.15;
      
      dummy.position.set(grass.x, grass.scale * 0.5, grass.z);
      dummy.rotation.set(sway, grass.rotationY, sway * 0.5);
      dummy.scale.set(0.1, grass.scale, 0.1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, grassData.length]}
      castShadow
      receiveShadow
    >
      <coneGeometry args={[1, 2, 4]} />
      <meshStandardMaterial
        color="#228B22"
        side={THREE.DoubleSide}
        flatShading
      />
    </instancedMesh>
  );
}
