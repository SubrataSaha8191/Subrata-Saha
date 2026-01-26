"use client";

import VoxelTerrain from "../world/VoxelTerrain";
import Portal from "../interactables/Portal";

export default function SkillsRoom() {
  return (
    <group>
      <VoxelTerrain size={28} />

      <mesh position={[0, 2, -6]} castShadow>
        <boxGeometry args={[10, 4, 1]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      <Portal position={[0, 0, 10]} label="Back to Hub" href="/" />
    </group>
  );
}