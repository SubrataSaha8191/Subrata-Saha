"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useGameStore } from "@/store/useGameStore";

const MOVE_SPEED = 6;
const SPRINT_MULTIPLIER = 1.6;

export default function PlayerController() {
  const playerRef = useRef<THREE.Mesh>(null);

  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const setPlayerObject = useGameStore((s) => s.setPlayerObject);

  // ✅ Call hooks separately (NO short-circuit)
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

  // store player object once available
  useEffect(() => {
    if (playerRef.current) {
      setPlayerObject(playerRef.current);
    }
  }, [setPlayerObject]);

  useFrame((_, delta) => {
    const player = playerRef.current;
    if (!player) return;

    const speed = MOVE_SPEED * (sprint ? SPRINT_MULTIPLIER : 1);

    const dir = new THREE.Vector3(
      (moveRight ? 1 : 0) - (moveLeft ? 1 : 0),
      0,
      (back ? 1 : 0) - (forward ? 1 : 0)
    );

    if (dir.lengthSq() > 0) {
      dir.normalize();

      player.position.addScaledVector(dir, speed * delta);

      // Roblox-ish facing direction
     const angle = Math.atan2(dir.x, dir.z);

    // Smoothly rotate instead of snapping
     const targetQuat = new THREE.Quaternion().setFromEuler(
     new THREE.Euler(0, angle, 0)
    );
      player.quaternion.slerp(targetQuat, 0.18);
    }

    setPlayerPosition([player.position.x, player.position.y, player.position.z]);
  });

  return (
    <mesh ref={playerRef} position={[0, 0.9, 10]} castShadow>
      <capsuleGeometry args={[0.5, 1.0, 6, 12]} />
      <meshStandardMaterial color="#f97316" />
    </mesh>
  );
}