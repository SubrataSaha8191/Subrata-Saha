"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useGameStore } from "@/store/useGameStore";

const MOVE_SPEED = 6;
const SPRINT_MULTIPLIER = 1.6;
const GRAVITY = 22;
const JUMP_SPEED = 7.5;
const GROUND_Y = 0.9;

export default function PlayerController() {
  const playerRef = useRef<THREE.Mesh>(null);

  const playerPosition = useGameStore((s) => s.playerPosition);
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
  const space = useKeyPress("Space");

  const isJumping = useGameStore((s) => s.isJumping);
  const velocityY = useGameStore((s) => s.velocityY);
  const setIsJumping = useGameStore((s) => s.setIsJumping);
  const setVelocityY = useGameStore((s) => s.setVelocityY);
  const lastSpaceRef = useRef(false);

  // Watch for room changes to re-sync position (teleport on enter)
  const currentRoom = useGameStore((s) => s.currentRoom);
  const isInRoom = useGameStore((s) => s.isInRoom);

  // Initialize player position from store and sync on room entry
  useEffect(() => {
    if (playerRef.current) {
      setPlayerObject(playerRef.current);
      // Sync position on mount or room change
      playerRef.current.position.set(...playerPosition);
      // Reset velocity
      useGameStore.getState().setVelocityY(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPlayerObject, currentRoom, isInRoom]); // Sync when room changes

  useFrame((_, delta) => {
    const player = playerRef.current;
    if (!player) return;

    // Get fresh state every frame to ensure we have the latest values
    const currentSittingState = useGameStore.getState().sittingState;
    const currentRoomState = useGameStore.getState().roomInteractionState;

    // When sitting, force lock player position - HIGHEST PRIORITY
    if (currentSittingState.isSitting) {
      const seatPos = currentSittingState.seatPosition;
      player.position.x = seatPos[0];
      player.position.y = seatPos[1];
      player.position.z = seatPos[2];
      setPlayerPosition(seatPos);
      return; // Exit immediately - absolutely NO movement allowed
    }

    // When in any interaction state, also block movement
    if (currentRoomState !== "none") {
      return; // Exit early - do NOT process any movement
    }

    // Jump + gravity (allow jumping while moving)
    const justPressedSpace = space && !lastSpaceRef.current;
    lastSpaceRef.current = space;

    const grounded = player.position.y <= GROUND_Y + 0.001;
    if (justPressedSpace && grounded && !isJumping) {
      setVelocityY(JUMP_SPEED);
      setIsJumping(true);
    }

    if (!grounded || velocityY !== 0) {
      const nextVelocityY = velocityY - GRAVITY * delta;
      const nextY = player.position.y + nextVelocityY * delta;

      if (nextY <= GROUND_Y) {
        player.position.y = GROUND_Y;
        setVelocityY(0);
        setIsJumping(false);
      } else {
        player.position.y = nextY;
        setVelocityY(nextVelocityY);
      }
    }

    // Only process movement when completely unlocked
    const isMovingForward = w || up;
    const isMovingBack = s || down;
    const isMovingLeft = a || left;
    const isMovingRight = d || right;
    const isSprinting = shiftLeft || shiftRight;
    
    const speed = MOVE_SPEED * (isSprinting ? SPRINT_MULTIPLIER : 1);

    const dir = new THREE.Vector3(
      (isMovingRight ? 1 : 0) - (isMovingLeft ? 1 : 0),
      0,
      (isMovingBack ? 1 : 0) - (isMovingForward ? 1 : 0)
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
    <mesh ref={playerRef} castShadow>
      <capsuleGeometry args={[0.5, 1.0, 6, 12]} />
      <meshStandardMaterial color="#f97316" />
    </mesh>
  );
}