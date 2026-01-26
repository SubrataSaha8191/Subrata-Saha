"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useGameStore } from "@/store/useGameStore";
import { useUIStore } from "@/store/useUIStore";

interface CastlePortalProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  label: string;
  href: string;
  castleColor?: string;
}

export default function CastlePortal({
  position,
  rotation = [0, 0, 0],
  label,
  href,
  castleColor = "#6B7280",
}: CastlePortalProps) {
  const router = useRouter();
  const flagRef = useRef<THREE.Mesh>(null);
  const doorRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const isLoading = useGameStore((s) => s.isLoading);
  const setLoading = useGameStore((s) => s.setLoading);
  const playerPos = useGameStore((s) => s.playerPosition);
  const setPrompt = useUIStore((s) => s.setInteractionPrompt);

  const pressE = useKeyPress("KeyE");
  const [canEnter, setCanEnter] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const lastPressedRef = useRef(false);

  // Check if player is near the castle door
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Animate flag
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(time * 2) * 0.2;
    }

    // Animate door glow
    if (glowRef.current) {
      const mat = glowRef.current.material;
      // material can be Material or Material[]; guard and cast to MeshStandardMaterial
      if (!Array.isArray(mat)) {
        (mat as THREE.MeshStandardMaterial).opacity = 0.3 + Math.sin(time * 2) * 0.15;
      }
    }

    // Animate door when opening
    if (doorRef.current) {
      const targetRotation = doorOpen ? -Math.PI / 2 : 0;
      doorRef.current.rotation.y = THREE.MathUtils.lerp(
        doorRef.current.rotation.y,
        targetRotation,
        0.05
      );
    }

    // Check distance to door
    const doorWorldPos = new THREE.Vector3(
      position[0],
      position[1],
      position[2] + 5
    );
    const playerVec = new THREE.Vector3(playerPos[0], playerPos[1], playerPos[2]);
    const distance = playerVec.distanceTo(doorWorldPos);

    if (distance < 5) {
      setCanEnter(true);
      setPrompt(`Press E to enter ${label}`);
      if (!doorOpen) setDoorOpen(true);
    } else {
      setCanEnter(false);
      setPrompt(null);
      if (doorOpen && distance > 8) setDoorOpen(false);
    }
  });

  // Handle portal enter
  useEffect(() => {
    const justPressed = pressE && !lastPressedRef.current;
    lastPressedRef.current = pressE;

    if (!justPressed || !canEnter || isLoading) return;

    setLoading(true);
    setTimeout(() => {
      router.push(href);
      setLoading(false);
    }, 300);
  }, [pressE, canEnter, isLoading, href, router, setLoading]);

  return (
    <group position={position} rotation={rotation}>
      {/* Main castle body */}
      <mesh castShadow receiveShadow position={[0, 4, 0]}>
        <boxGeometry args={[10, 8, 10]} />
        <meshStandardMaterial color={castleColor} roughness={0.8} />
      </mesh>

      {/* Corner towers */}
      {[
        [-5, 0, -5],
        [5, 0, -5],
        [-5, 0, 5],
        [5, 0, 5],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh castShadow receiveShadow position={[0, 5, 0]}>
            <cylinderGeometry args={[1.5, 1.8, 10, 8]} />
            <meshStandardMaterial color={castleColor} roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 11, 0]}>
            <coneGeometry args={[2, 3, 8]} />
            <meshStandardMaterial color="#8B0000" roughness={0.7} />
          </mesh>
          {/* Tower battlements */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
            <mesh
              key={j}
              castShadow
              position={[
                Math.cos((j / 8) * Math.PI * 2) * 1.5,
                9.5,
                Math.sin((j / 8) * Math.PI * 2) * 1.5,
              ]}
            >
              <boxGeometry args={[0.5, 1, 0.5]} />
              <meshStandardMaterial color={castleColor} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Central tower with flag */}
      <mesh castShadow receiveShadow position={[0, 10, 0]}>
        <cylinderGeometry args={[1.2, 1.5, 6, 8]} />
        <meshStandardMaterial color={castleColor} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 14, 0]}>
        <coneGeometry args={[1.8, 2.5, 8]} />
        <meshStandardMaterial color="#8B0000" roughness={0.7} />
      </mesh>

      {/* Flag */}
      <mesh position={[0, 16.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 6]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh ref={flagRef} position={[0.6, 17, 0]}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial color="#FFD700" side={THREE.DoubleSide} />
      </mesh>

      {/* Door entrance area */}
      <group position={[0, 0, 5.5]}>
        {/* Door frame arch */}
        <mesh castShadow position={[0, 3.5, 0]}>
          <boxGeometry args={[4, 7, 1]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} />
        </mesh>

        {/* Door opening */}
        <mesh position={[0, 2.5, 0.3]}>
          <boxGeometry args={[2.5, 5, 0.5]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>

        {/* Animated door */}
        <group ref={doorRef} position={[-1.1, 0, 0.5]}>
          <mesh castShadow position={[1.1, 2.5, 0]}>
            <boxGeometry args={[2.2, 5, 0.2]} />
            <meshStandardMaterial color="#8B4513" roughness={0.7} />
          </mesh>
          {/* Door details */}
          {[
            [0.6, 3.5],
            [1.6, 3.5],
            [0.6, 1.5],
            [1.6, 1.5],
          ].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.11]} castShadow>
              <boxGeometry args={[0.7, 1.2, 0.05]} />
              <meshStandardMaterial color="#6B4423" roughness={0.6} />
            </mesh>
          ))}
          {/* Door handle */}
          <mesh position={[1.8, 2.5, 0.2]} castShadow>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Portal glow effect */}
        <mesh ref={glowRef} position={[0, 2.5, -0.1]}>
          <planeGeometry args={[2.4, 4.8]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={0.5}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Torches */}
        {[[-1.8, 3], [1.8, 3]].map(([x, y], i) => (
          <group key={i} position={[x, y, 0.6]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.12, 0.6, 6]} />
              <meshStandardMaterial color="#5D4037" />
            </mesh>
            <pointLight
              position={[0, 0.5, 0]}
              color="#ff6600"
              intensity={3}
              distance={8}
            />
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[0.12, 0.35, 6]} />
              <meshStandardMaterial
                color="#ff4500"
                emissive="#ff4500"
                emissiveIntensity={2}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Windows on castle body */}
      {[
        [-3, 5, 5.1],
        [3, 5, 5.1],
        [-3, 2, 5.1],
        [3, 2, 5.1],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[1, 1.5, 0.1]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      ))}

      {/* Castle name banner */}
      <mesh position={[0, 7.5, 5.6]} castShadow>
        <boxGeometry args={[4, 1, 0.1]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
    </group>
  );
}
