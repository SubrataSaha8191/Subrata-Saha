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
  scale?: number;
}

// Door collision box dimensions
const DOOR_WIDTH = 2.5;
const DOOR_DEPTH = 0.5;
const DOOR_HEIGHT = 5;

export default function CastlePortal({
  position,
  rotation = [0, 0, 0],
  label,
  href,
  castleColor = "#6B7280",
  scale = 1,
}: CastlePortalProps) {
  const router = useRouter();
  const flagRef = useRef<THREE.Mesh>(null);
  const doorRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const flame1Ref = useRef<THREE.Mesh>(null);
  const flame2Ref = useRef<THREE.Mesh>(null);
  const doorCollisionRef = useRef<THREE.Mesh>(null);

  const isLoading = useGameStore((s) => s.isLoading);
  const setLoading = useGameStore((s) => s.setLoading);
  const playerPos = useGameStore((s) => s.playerPosition);
  const enterRoom = useGameStore((s) => s.enterRoom);
  const setPrompt = useUIStore((s) => s.setInteractionPrompt);

  const pressE = useKeyPress("KeyE");
  const [canEnter, setCanEnter] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [nearDoor, setNearDoor] = useState(false);
  const lastPressedRef = useRef(false);

  // Calculate door world position based on castle position and rotation
  const getDoorWorldPosition = () => {
    const doorLocalPos = new THREE.Vector3(0, 0, 5.5 * scale);
    const rotationMatrix = new THREE.Matrix4().makeRotationY(rotation[1]);
    doorLocalPos.applyMatrix4(rotationMatrix);
    return new THREE.Vector3(
      position[0] + doorLocalPos.x,
      position[1],
      position[2] + doorLocalPos.z
    );
  };

  // Check if player is colliding with closed door
  const checkDoorCollision = (playerVec: THREE.Vector3) => {
    if (doorOpen) return false;
    
    const doorWorldPos = getDoorWorldPosition();
    
    // Transform player position to door's local space
    const relativePos = playerVec.clone().sub(doorWorldPos);
    const inverseRotation = new THREE.Matrix4().makeRotationY(-rotation[1]);
    relativePos.applyMatrix4(inverseRotation);
    
    // Check if player is within door bounds
    const halfWidth = (DOOR_WIDTH * scale) / 2;
    const halfDepth = (DOOR_DEPTH * scale) / 2;
    
    return (
      Math.abs(relativePos.x) < halfWidth &&
      Math.abs(relativePos.z) < halfDepth + 1 &&
      relativePos.y < DOOR_HEIGHT * scale
    );
  };

  // Check if player is near the castle door
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Animate flag
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(time * 2) * 0.2;
    }

    // Animate flames
    if (flame1Ref.current) {
      flame1Ref.current.scale.y = 1 + Math.sin(time * 8) * 0.2;
      flame1Ref.current.rotation.z = Math.sin(time * 5) * 0.1;
    }
    if (flame2Ref.current) {
      flame2Ref.current.scale.y = 1 + Math.cos(time * 7) * 0.2;
      flame2Ref.current.rotation.z = Math.cos(time * 4) * 0.1;
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

    // Check distance to door (adjusted for scale)
    const doorWorldPos = getDoorWorldPosition();
    const playerVec = new THREE.Vector3(playerPos[0], playerPos[1], playerPos[2]);
    const distance = playerVec.distanceTo(doorWorldPos);

    const detectDistance = 6 * scale;
    const closeDistance = 10 * scale;
    const nearDoorDistance = 8 * scale;

    // Show "E to interact" when near the door (but not close enough to enter)
    if (distance < nearDoorDistance && distance > detectDistance) {
      setNearDoor(true);
      setPrompt(`Press E to interact with ${label} door`);
    } else if (distance < detectDistance) {
      setCanEnter(true);
      setNearDoor(false);
      setPrompt(`Press E to enter ${label}`);
      if (!doorOpen) setDoorOpen(true);
    } else {
      setCanEnter(false);
      setNearDoor(false);
      setPrompt(null);
      if (doorOpen && distance > closeDistance) setDoorOpen(false);
    }
  });

  // Handle portal enter
  useEffect(() => {
    const justPressed = pressE && !lastPressedRef.current;
    lastPressedRef.current = pressE;

    if (!justPressed || isLoading) return;

    // If near door but not close enough, open the door
    if (nearDoor && !canEnter) {
      setDoorOpen(true);
      return;
    }

    if (!canEnter) return;

    setLoading(true);
    // Enter room and set FPP mode
    enterRoom(label.toLowerCase());
    setTimeout(() => {
      router.push(href);
      setLoading(false);
    }, 300);
  }, [pressE, canEnter, nearDoor, isLoading, href, router, setLoading, enterRoom, label]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Invisible door collision box - blocks player when door is closed */}
      {!doorOpen && (
        <mesh
          ref={doorCollisionRef}
          position={[0, DOOR_HEIGHT / 2, 5.5]}
          visible={false}
        >
          <boxGeometry args={[DOOR_WIDTH, DOOR_HEIGHT, DOOR_DEPTH]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

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
      </group>

      {/* Large fire torches in front of castle entrance */}
      {[[-4, 0, 8], [4, 0, 8]].map(([x, y, z], i) => (
        <group key={`front-torch-${i}`} position={[x, y, z]}>
          {/* Torch pillar/stand */}
          <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 3, 8]} />
            <meshStandardMaterial color="#4A3728" roughness={0.9} />
          </mesh>
          {/* Torch top */}
          <mesh castShadow position={[0, 3.1, 0]}>
            <cylinderGeometry args={[0.35, 0.25, 0.3, 8]} />
            <meshStandardMaterial color="#3E2723" roughness={0.8} />
          </mesh>
          {/* Fire bowl */}
          <mesh castShadow position={[0, 3.3, 0]}>
            <cylinderGeometry args={[0.4, 0.35, 0.3, 8]} />
            <meshStandardMaterial color="#2D2D2D" roughness={0.7} />
          </mesh>
          {/* Main flame */}
          <mesh ref={i === 0 ? flame1Ref : flame2Ref} position={[0, 3.8, 0]}>
            <coneGeometry args={[0.3, 0.9, 8]} />
            <meshStandardMaterial
              color="#FF4500"
              emissive="#FF4500"
              emissiveIntensity={2.5}
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Inner flame */}
          <mesh position={[0, 3.7, 0]}>
            <coneGeometry args={[0.15, 0.6, 6]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={3}
              transparent
              opacity={0.95}
            />
          </mesh>
          {/* Fire light */}
          <pointLight
            position={[0, 3.8, 0]}
            color="#ff6600"
            intensity={8}
            distance={15}
            decay={2}
          />
        </group>
      ))}

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
