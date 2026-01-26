"use client";

import FantasySky from "../environment/Sky";
import RealisticGround from "../environment/Ground";
import AnimatedGrass from "../environment/Grass";
import { Forest } from "../environment/Tree";
import HangingBridge from "../environment/HangingBridge";
import CastlePortal from "../interactables/CastlePortal";
import Flowers from "../environment/Flowers";
import Butterflies from "../environment/Butterflies";
import Rocks, { Pond } from "../environment/Rocks";
import RealisticLighting from "../environment/Lighting";

export default function HubWorld() {
  return (
    <group>
      {/* Sky and atmosphere */}
      <FantasySky />

      {/* Realistic lighting */}
      <RealisticLighting />

      {/* Ground with terrain */}
      <RealisticGround />

      {/* Animated grass */}
      <AnimatedGrass />

      {/* Forest of trees */}
      <Forest count={50} area={80} avoidCenter={18} />

      {/* Flowers scattered around */}
      <Flowers count={150} area={70} />

      {/* Butterflies flying around */}
      <Butterflies count={20} />

      {/* Rocks scattered around */}
      <Rocks count={50} area={70} />

      {/* Water pond */}
      <Pond position={[15, 0, 10]} />

      {/* Hanging bridge at the start */}
      <HangingBridge position={[0, 0.5, 20]} length={10} width={3} />

      {/* Castle Portals with realistic doors */}
      <CastlePortal
        position={[-25, 0, -25]}
        rotation={[0, Math.PI / 6, 0]}
        label="Projects"
        href="/projects"
        castleColor="#4A5568"
      />
      <CastlePortal
        position={[25, 0, -25]}
        rotation={[0, -Math.PI / 6, 0]}
        label="Skills"
        href="/skills"
        castleColor="#5D4E37"
      />
      <CastlePortal
        position={[-30, 0, 10]}
        rotation={[0, Math.PI / 3, 0]}
        label="About"
        href="/about"
        castleColor="#2D3748"
      />
      <CastlePortal
        position={[30, 0, 10]}
        rotation={[0, -Math.PI / 3, 0]}
        label="Contact"
        href="/contact"
        castleColor="#553C3C"
      />

      {/* Central fountain/landmark */}
      <group position={[0, 0, 0]}>
        {/* Fountain base */}
        <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
          <cylinderGeometry args={[3, 3.5, 0.6, 16]} />
          <meshStandardMaterial color="#808080" roughness={0.7} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
          <cylinderGeometry args={[2, 2.5, 0.4, 16]} />
          <meshStandardMaterial color="#808080" roughness={0.7} />
        </mesh>
        {/* Water in fountain */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[2.3, 2.3, 0.1, 16]} />
          <meshStandardMaterial
            color="#4169E1"
            transparent
            opacity={0.7}
            metalness={0.2}
            roughness={0.1}
          />
        </mesh>
        {/* Central pillar */}
        <mesh castShadow position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
          <meshStandardMaterial color="#696969" roughness={0.8} />
        </mesh>
        {/* Statue on top */}
        <mesh castShadow position={[0, 3.5, 0]}>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Decorative stone walls/pillars along paths */}
      {[
        [5, 0, 5],
        [-5, 0, 5],
        [8, 0, -5],
        [-8, 0, -5],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos as [number, number, number]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.4, 0.5, 3, 8]} />
          <meshStandardMaterial color="#696969" roughness={0.9} />
        </mesh>
      ))}

      {/* Welcome arch at bridge exit */}
      <group position={[0, 0, 13]}>
        {/* Left pillar */}
        <mesh castShadow position={[-2.5, 2.5, 0]}>
          <boxGeometry args={[0.8, 5, 0.8]} />
          <meshStandardMaterial color="#696969" roughness={0.8} />
        </mesh>
        {/* Right pillar */}
        <mesh castShadow position={[2.5, 2.5, 0]}>
          <boxGeometry args={[0.8, 5, 0.8]} />
          <meshStandardMaterial color="#696969" roughness={0.8} />
        </mesh>
        {/* Arch top */}
        <mesh castShadow position={[0, 5.3, 0]}>
          <boxGeometry args={[6, 0.6, 0.8]} />
          <meshStandardMaterial color="#696969" roughness={0.8} />
        </mesh>
        {/* Decorative top */}
        <mesh castShadow position={[0, 6, 0]}>
          <coneGeometry args={[0.5, 1, 4]} />
          <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}