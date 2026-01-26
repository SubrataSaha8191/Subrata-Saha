"use client";

import { useMemo } from "react";
import Block from "./Block";
import { generateFlatChunk } from "./ChunkGenerator";

export default function VoxelTerrain({ size = 30 }: { size?: number }) {
  const blocks = useMemo(() => generateFlatChunk(size), [size]);

  return (
    <group>
      {blocks.map((pos) => (
        <Block key={`${pos[0]}_${pos[1]}_${pos[2]}`} position={pos} color="#16a34a" />
      ))}

      {/* invisible base to catch shadows */}
      <mesh position={[0, -0.51, 0]} receiveShadow>
        <boxGeometry args={[size + 2, 1, size + 2]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>
    </group>
  );
}