"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useGameStore } from "@/store/useGameStore";

const MOVE_SPEED = 6;
const SPRINT_MULTIPLIER = 1.6;

// Roblox-style character colors
const SKIN_COLOR = "#FFCC99";
const SHIRT_COLOR = "#3B82F6";
const PANTS_COLOR = "#1E3A5F";
const HAIR_COLOR = "#4A3728";

export default function RobloxCharacter() {
  const characterRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const setPlayerObject = useGameStore((s) => s.setPlayerObject);

  // Key bindings
  const w = useKeyPress("KeyW");
  const s = useKeyPress("KeyS");
  const a = useKeyPress("KeyA");
  const d = useKeyPress("KeyD");
  const up = useKeyPress("ArrowUp");
  const down = useKeyPress("ArrowDown");
  const left = useKeyPress("ArrowLeft");
  const right = useKeyPress("ArrowRight");
  const shiftLeft = useKeyPress("ShiftLeft");
  const shiftRight = useKeyPress("ShiftRight");

  const forward = w || up;
  const back = s || down;
  const moveLeft = a || left;
  const moveRight = d || right;
  const sprint = shiftLeft || shiftRight;

  const isMoving = forward || back || moveLeft || moveRight;

  useEffect(() => {
    if (characterRef.current) {
      setPlayerObject(characterRef.current);
    }
  }, [setPlayerObject]);

  useFrame((state, delta) => {
    const character = characterRef.current;
    if (!character) return;

    const speed = MOVE_SPEED * (sprint ? SPRINT_MULTIPLIER : 1);
    const time = state.clock.getElapsedTime();

    const dir = new THREE.Vector3(
      (moveRight ? 1 : 0) - (moveLeft ? 1 : 0),
      0,
      (back ? 1 : 0) - (forward ? 1 : 0)
    );

    if (dir.lengthSq() > 0) {
      dir.normalize();
      character.position.addScaledVector(dir, speed * delta);

      // Smooth rotation
      const angle = Math.atan2(dir.x, dir.z);
      const targetQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, angle, 0)
      );
      character.quaternion.slerp(targetQuat, 0.15);
    }

    // Walking animation
    if (isMoving) {
      const walkSpeed = sprint ? 12 : 8;
      const swing = Math.sin(time * walkSpeed) * 0.5;

      if (leftArmRef.current) leftArmRef.current.rotation.x = swing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = swing;

      // Bobbing
      character.position.y = 0.9 + Math.abs(Math.sin(time * walkSpeed)) * 0.1;
    } else {
      // Idle pose
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;

      // Subtle breathing
      character.position.y = 0.9 + Math.sin(time * 2) * 0.02;
    }

    setPlayerPosition([
      character.position.x,
      character.position.y,
      character.position.z,
    ]);
  });

  return (
    <group ref={characterRef} position={[0, 0.9, 22]} castShadow>
      {/* Head */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color={SKIN_COLOR} />
      </mesh>

      {/* Face */}
      {/* Eyes */}
      <mesh position={[-0.15, 1.45, 0.36]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.15, 1.45, 0.36]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Eye highlights */}
      <mesh position={[-0.13, 1.47, 0.42]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.17, 1.47, 0.42]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Smile */}
      <mesh position={[0, 1.3, 0.36]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.1, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[0.75, 0.2, 0.75]} />
        <meshStandardMaterial color={HAIR_COLOR} />
      </mesh>
      <mesh position={[0, 1.55, -0.3]} castShadow>
        <boxGeometry args={[0.72, 0.5, 0.2]} />
        <meshStandardMaterial color={HAIR_COLOR} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.8, 0.9, 0.5]} />
        <meshStandardMaterial color={SHIRT_COLOR} />
      </mesh>

      {/* Shirt details */}
      <mesh position={[0, 0.85, 0.26]}>
        <boxGeometry args={[0.3, 0.3, 0.01]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.55, 0.65, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.3, 0.7, 0.3]} />
          <meshStandardMaterial color={SHIRT_COLOR} />
        </mesh>
        <mesh position={[0, -0.65, 0]} castShadow>
          <boxGeometry args={[0.25, 0.2, 0.25]} />
          <meshStandardMaterial color={SKIN_COLOR} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.55, 0.65, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.3, 0.7, 0.3]} />
          <meshStandardMaterial color={SHIRT_COLOR} />
        </mesh>
        <mesh position={[0, -0.65, 0]} castShadow>
          <boxGeometry args={[0.25, 0.2, 0.25]} />
          <meshStandardMaterial color={SKIN_COLOR} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.2, 0, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.35, 0.7, 0.35]} />
          <meshStandardMaterial color={PANTS_COLOR} />
        </mesh>
        <mesh position={[0, -0.75, 0]} castShadow>
          <boxGeometry args={[0.3, 0.15, 0.4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.2, 0, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.35, 0.7, 0.35]} />
          <meshStandardMaterial color={PANTS_COLOR} />
        </mesh>
        <mesh position={[0, -0.75, 0]} castShadow>
          <boxGeometry args={[0.3, 0.15, 0.4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
    </group>
  );
}
