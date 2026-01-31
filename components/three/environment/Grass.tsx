"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isOnPath } from "./Ground";

const GRASS_COUNT = 4000;
const GRASS_AREA = 80;
const GRASS_HEIGHT_MIN = 0.08; // Shorter grass
const GRASS_HEIGHT_MAX = 0.15;

export default function AnimatedGrass() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const frameCount = useRef(0);

  // Pre-calculate grass positions and properties
  const grassData = useMemo(() => {
    const data = [];
    let attempts = 0;
    const maxAttempts = GRASS_COUNT * 3;

    while (data.length < GRASS_COUNT && attempts < maxAttempts) {
      attempts++;
      const x = (Math.random() - 0.5) * GRASS_AREA;
      const z = (Math.random() - 0.5) * GRASS_AREA;

      // Skip if on any path
      if (isOnPath(x, z)) continue;

      // Avoid bridge area
      if (Math.abs(x) < 3 && z > 5 && z < 25) continue;

      // Avoid castle areas (larger exclusion zone)
      const castlePositions = [
        { x: -25, z: -25 },
        { x: 25, z: -25 },
        { x: -30, z: 10 },
        { x: 30, z: 10 },
      ];

      let nearCastle = false;
      for (const castle of castlePositions) {
        const dist = Math.sqrt((x - castle.x) ** 2 + (z - castle.z) ** 2);
        if (dist < 12) {
          nearCastle = true;
          break;
        }
      }
      if (nearCastle) continue;

      // Avoid fountain area
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter < 6) continue;

      data.push({
        x,
        z,
        scale: GRASS_HEIGHT_MIN + Math.random() * (GRASS_HEIGHT_MAX - GRASS_HEIGHT_MIN),
        rotationY: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      });
    }
    return data;
  }, []);

  // Initialize grass positions on mount
  useEffect(() => {
    if (!meshRef.current) return;

    grassData.forEach((grass, i) => {
      dummy.position.set(grass.x, grass.scale, grass.z);
      dummy.rotation.set(0, grass.rotationY, 0);
      dummy.scale.set(0.08, grass.scale, 0.08);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [grassData, dummy]);

  useFrame(({ clock }) => {
    // Skip frames to reduce CPU usage
    frameCount.current++;
    if (frameCount.current % 2 !== 0) return;
    
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    grassData.forEach((grass, i) => {
      // Sway animation
      const sway = Math.sin(time * grass.speed + grass.phase) * 0.15;

      // Position grass on ground (y = grass height / 2 since cone is centered, so we shift up by half height)
      // Cone geometry height is 2, scaled by S. Effective height 2S. Center (0) is at S above base. 
      // So to put base at 0, we position at S.
      dummy.position.set(grass.x, grass.scale, grass.z);
      dummy.rotation.set(sway, grass.rotationY, sway * 0.5);
      dummy.scale.set(0.08, grass.scale, 0.08);
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
        color="#2E8B2E"
        side={THREE.DoubleSide}
        flatShading
      />
    </instancedMesh>
  );
}
