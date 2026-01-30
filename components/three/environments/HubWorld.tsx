"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import FantasySky from "../environment/Sky";
import RealisticGround from "../environment/Ground";
import AnimatedGrass from "../environment/Grass";
import { Forest } from "../environment/Tree";
import HangingBridge from "../environment/HangingBridge";
import CastlePortal from "../interactables/CastlePortal";
import Flowers from "../environment/Flowers";
import Butterflies from "../environment/Butterflies";
import Fireflies from "../environment/Fireflies";
import Rocks, { Pond } from "../environment/Rocks";
import RealisticLighting from "../environment/Lighting";
import AmbientSounds from "../environment/AmbientSounds";
import { useGameStore } from "@/store/useGameStore";

// Component to switch between butterflies (day) and fireflies (night)
function DayNightCreatures() {
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  
  // Day time: 6am (6) to 6pm (18) = butterflies
  // Night time: 6pm (18) to 6am (6) = fireflies
  const isDayTime = timeOfDay >= 6 && timeOfDay < 18;
  
  if (isDayTime) {
    return <Butterflies count={20} />;
  } else {
    return <Fireflies count={30} />;
  }
}

// Animated Fire Torch component
function FireTorch({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const flame2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(time * 8) * 0.15;
      flameRef.current.scale.x = 1 + Math.cos(time * 6) * 0.1;
      flameRef.current.rotation.z = Math.sin(time * 5) * 0.1;
    }
    if (flame2Ref.current) {
      flame2Ref.current.scale.y = 1 + Math.cos(time * 7) * 0.2;
      flame2Ref.current.rotation.z = Math.cos(time * 4) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Torch holder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>
      {/* Bowl */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.12, 0.2, 8]} />
        <meshStandardMaterial color="#3E2723" roughness={0.8} />
      </mesh>
      {/* Main flame */}
      <mesh ref={flameRef} position={[0, 0.65, 0]}>
        <coneGeometry args={[0.15, 0.5, 8]} />
        <meshStandardMaterial
          color="#FF4500"
          emissive="#FF4500"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Inner flame */}
      <mesh ref={flame2Ref} position={[0, 0.6, 0]}>
        <coneGeometry args={[0.08, 0.35, 6]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={3}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* Light */}
      <pointLight
        position={[0, 0.6, 0]}
        color="#ff6600"
        intensity={5}
        distance={12}
        decay={2}
      />
    </group>
  );
}

// Animated Tail Fire component
function TailFire() {
  const flame1Ref = useRef<THREE.Mesh>(null);
  const flame2Ref = useRef<THREE.Mesh>(null);
  const flame3Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (flame1Ref.current) {
      flame1Ref.current.scale.y = 1 + Math.sin(time * 10) * 0.3;
      flame1Ref.current.scale.x = 1 + Math.cos(time * 8) * 0.2;
      flame1Ref.current.rotation.x = Math.sin(time * 6) * 0.2;
      flame1Ref.current.rotation.z = Math.cos(time * 7) * 0.2;
    }
    if (flame2Ref.current) {
      flame2Ref.current.scale.y = 1 + Math.cos(time * 9) * 0.25;
      flame2Ref.current.rotation.x = Math.cos(time * 5) * 0.15;
      flame2Ref.current.rotation.z = Math.sin(time * 8) * 0.15;
    }
    if (flame3Ref.current) {
      flame3Ref.current.scale.y = 1 + Math.sin(time * 11) * 0.2;
      flame3Ref.current.rotation.x = Math.sin(time * 7) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Main flame */}
      <mesh ref={flame1Ref}>
        <coneGeometry args={[0.15, 0.5, 8]} />
        <meshStandardMaterial
          color="#FF4500"
          emissive="#FF4500"
          emissiveIntensity={3}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Secondary flame */}
      <mesh ref={flame2Ref} position={[0.05, 0.1, 0]}>
        <coneGeometry args={[0.1, 0.4, 6]} />
        <meshStandardMaterial
          color="#FF6600"
          emissive="#FF6600"
          emissiveIntensity={2.5}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Inner flame */}
      <mesh ref={flame3Ref} position={[-0.02, 0.05, 0]}>
        <coneGeometry args={[0.06, 0.3, 6]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={4}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* Fire light */}
      <pointLight
        color="#ff4500"
        intensity={8}
        distance={8}
        decay={2}
      />
    </group>
  );
}

// Dragon Statue component with fire tail
function DragonStatue() {
  const dragonRef = useRef<THREE.Group>(null);
  const wingsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    // Subtle breathing animation
    if (dragonRef.current) {
      dragonRef.current.scale.y = 1 + Math.sin(time * 0.5) * 0.01;
    }
    // Subtle wing movement
    if (wingsRef.current) {
      wingsRef.current.rotation.y = Math.sin(time * 0.3) * 0.05;
    }
  });

  return (
    <group ref={dragonRef} position={[0, 1.2, 0]}>
      {/* Dragon body - main torso */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <capsuleGeometry args={[0.5, 1.2, 12, 6]} />
        <meshStandardMaterial
          color="#fc032c"
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Dragon neck */}
      <mesh castShadow position={[0, 2.5, 0.3]} rotation={[-0.4, 0, 0]}>
        <capsuleGeometry args={[0.25, 0.8, 8, 16]} />
        <meshStandardMaterial
          color="#fc032c"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Dragon head */}
      <mesh castShadow position={[0, 3.2, 0.6]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.7]} />
        <meshStandardMaterial
          color="#fc032c"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Snout */}
      <mesh castShadow position={[0, 3.1, 1.05]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.5]} />
        <meshStandardMaterial
          color="#fc032c"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Dragon eyes */}
      <mesh position={[-0.18, 3.3, 0.85]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#FF4500"
          emissive="#FF4500"
          emissiveIntensity={1}
        />
      </mesh>
      <mesh position={[0.18, 3.3, 0.85]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#FF4500"
          emissive="#FF4500"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Horns */}
      <mesh castShadow position={[-0.2, 3.45, 0.4]} rotation={[0.5, 0.3, -0.2]}>
        <coneGeometry args={[0.08, 0.4, 6]} />
        <meshStandardMaterial color="#2D3748" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0.2, 3.45, 0.4]} rotation={[0.5, -0.3, 0.2]}>
        <coneGeometry args={[0.08, 0.4, 6]} />
        <meshStandardMaterial color="#2D3748" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Ears/Fins */}
      <mesh castShadow position={[-0.3, 3.35, 0.5]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.12, 0.25, 4]} />
        <meshStandardMaterial color="#553C3C" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0.3, 3.35, 0.5]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.12, 0.25, 4]} />
        <meshStandardMaterial color="#553C3C" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Wings group - Scaled UP */}
      <group ref={wingsRef} scale={[1.8, 1.8, 1.8]}>
        {/* Left wing */}
        <group position={[-0.3, 1, 0]} rotation={[0.2, -0.3, -0.5]}>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.6, 0.5]} />
            <meshStandardMaterial color="#fc032c" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh castShadow position={[-0.4, 0.1, 0]}>
            <planeGeometry args={[0.8, 0.7]} />
            <meshStandardMaterial
              color="#fc032c"
              metalness={0.6}
              roughness={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* Right wing */}
        <group position={[0.3, 1, 0]} rotation={[-0.2, 0.1, 0.5]}>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.6, 0.5]} />
            <meshStandardMaterial color="#fc032c" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh castShadow position={[0.4, 0.1, 0]}>
            <planeGeometry args={[0.8, 0.7]} />
            <meshStandardMaterial
              color="#fc032c"
              metalness={0.6}
              roughness={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* Tail - Curved Upwards */}
      {/* Base segment */}
      <mesh castShadow position={[0, 1.2, -0.7]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.3, 1.0, 8]} />
        <meshStandardMaterial color="#fc032c" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Middle segment - curving up */}
      <mesh castShadow position={[0, 0.5, -1.2]} rotation={[0.8, 0, 0]}>
        <coneGeometry args={[0.2, 0.9, 8]} />
        <meshStandardMaterial color="#fc032c" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Tip segment - pointing up */}
      <mesh castShadow position={[0, 0.2, -1.6]} rotation={[1.5, 0, 0]}>
        <coneGeometry args={[0.12, 0.8, 6]} />
        <meshStandardMaterial color="#fc032c" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* FIRE ON TAIL - Adjusted for new tip position */}
      {/* Moved a little under and facing opposite */}
      <group position={[0, 0.2, -2.2]} rotation={[-1.4, 0, 0]}>
        <TailFire />
      </group>

      {/* Front legs */}
      <mesh castShadow position={[-0.35, 0.8, 0.5]} rotation={[-10, -7, 0.2]}>
        <capsuleGeometry args={[0.12, 0.5, 6, 12]} />
        <meshStandardMaterial color="#fc032c" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[0.35, 0.8, 0.5]} rotation={[-10, 7, -0.2]}>
        <capsuleGeometry args={[0.12, 0.5, 6, 12]} />
        <meshStandardMaterial color="#fc032c" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Back legs */}
      <mesh castShadow position={[-0.35, 0.6, -0.3]} rotation={[0.3, 0, 0.15]}>
        <capsuleGeometry args={[0.15, 0.6, 6, 12]} />
        <meshStandardMaterial color="#fc032c" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[0.35, 0.6, -0.3]} rotation={[0.3, 0, -0.15]}>
        <capsuleGeometry args={[0.15, 0.6, 6, 12]} />
        <meshStandardMaterial color="#fc032c" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Base pedestal */}
      <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.3, 8]} />
        <meshStandardMaterial color="#fc032csa" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function HubWorld() {
  return (
    <group>
      {/* Sky and atmosphere */}
      <FantasySky />

      {/* Ambient sounds based on time of day */}
      <AmbientSounds />

      {/* Realistic lighting */}
      <RealisticLighting />

      {/* Ground with terrain - at y=0 */}
      <RealisticGround />

      {/* Animated grass */}
      <AnimatedGrass />

      {/* Forest of trees */}
      <Forest count={50} area={80} avoidCenter={18} />

      {/* Flowers scattered around */}
      <Flowers count={150} area={70} />

      {/* Butterflies during day (6am-6pm), Fireflies at night */}
      <DayNightCreatures />

      {/* Rocks scattered around */}
      <Rocks count={50} area={70} />

      {/* Water pond */}
      <Pond position={[15, 0, 10]} />

      {/* Hanging bridge at the start */}
      <HangingBridge position={[0, 0.5, 20]} length={10} width={3} />

      {/* Castle Portals with realistic doors - scaled up */}
      <CastlePortal
        position={[-25, 0, -25]}
        rotation={[0, Math.PI / 4.6, 0]}
        label="Projects"
        href="/projects"
        castleColor="#4A5568"
        scale={1.5}
      />
      <CastlePortal
        position={[23, 0, -25]}
        rotation={[0, -Math.PI / 6, 0]}
        label="Skills"
        href="/skills"
        castleColor="#5D4E37"
        scale={1.5}
      />
      <CastlePortal
        position={[-27, 0, 9]}
        rotation={[0, Math.PI / 1.6, 0]}
        label="About"
        href="/about"
        castleColor="#2D3748"
        scale={1.5}
      />
      <CastlePortal
        position={[30, 0, 12]}
        rotation={[0, -Math.PI / 1.5, 0]}
        label="Contact"
        href="/contact"
        castleColor="#553C3C"
        scale={1.5}
      />

      {/* Central fountain/pedestal with Dragon statue */}
      <group position={[0, 0, 0]}>
        {/* Fountain base - on ground */}
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
          <meshStandardMaterial color="#2D3748" roughness={0.6} metalness={0.4} />
        </mesh>

        {/* Dragon Statue on top */}
        <DragonStatue />
      </group>

      {/* Decorative stone pillars with fire torches - FIXED: positioned on ground */}
      {[
        [4, 1.5, 5],
        [-4, 1.5, 5],
        [8, 1.5, -2],
        [0, 1.5, -5],
        [-8, 1.5, -2],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Pillar - base at y=0 */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.4, 0.5, 3, 8]} />
            <meshStandardMaterial color="#696969" roughness={0.9} />
          </mesh>
          {/* Pillar top cap */}
          <mesh castShadow position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.5, 0.4, 0.2, 8]} />
            <meshStandardMaterial color="#555555" roughness={0.8} />
          </mesh>
          {/* Fire torch on top */}
          <FireTorch position={[0, 1.9, 0]} />
        </group>
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