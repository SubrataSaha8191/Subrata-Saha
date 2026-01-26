"use client";

import VoxelTerrain from "../world/VoxelTerrain";
import Portal from "../interactables/Portal";

export default function ProjectsRoom() {
  return (
    <group>
      <VoxelTerrain size={28} />

      <mesh position={[0, 2, -6]} castShadow>
        <boxGeometry args={[10, 4, 1]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <Portal position={[0, 0, 10]} label="Back to Hub" href="/" />
    </group>
  );
}