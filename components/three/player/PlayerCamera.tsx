"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { clamp } from "@/lib/utils/clamp";

export default function PlayerCamera() {
  const { camera } = useThree();

  const playerObject = useGameStore((s) => s.playerObject);
  const yaw = useGameStore((s) => s.cameraYaw);
  const pitch = useGameStore((s) => s.cameraPitch);
  const distance = useGameStore((s) => s.cameraDistance);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);

  const current = useRef({
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  });

  useFrame((_, delta) => {
    if (!playerObject) return;

    const lerpFactor = clamp(1 - Math.pow(0.001, delta), 0, 1);

    if (cameraMode === "fpp") {
      // First Person Mode - camera at player's head position
      // Lower camera when sitting on sofa
      const isSitting = roomInteractionState === "sitting_sofa" || 
                        roomInteractionState === "holding_remote" || 
                        roomInteractionState === "watching_tv" ||
                        roomInteractionState === "sitting_chair" ||
                        roomInteractionState === "using_computer";
      
      const headHeight = isSitting ? 1.0 : 1.8; // Lower camera when sitting
      const desiredPos = playerObject.position.clone().add(new THREE.Vector3(0, headHeight, 0));

      current.current.x = THREE.MathUtils.lerp(current.current.x, desiredPos.x, lerpFactor);
      current.current.y = THREE.MathUtils.lerp(current.current.y, desiredPos.y, lerpFactor);
      current.current.z = THREE.MathUtils.lerp(current.current.z, desiredPos.z, lerpFactor);

      camera.position.set(current.current.x, current.current.y, current.current.z);

      // Look in the direction based on yaw and pitch
      // We negate sin/cos for X/Z to align FPP look direction with TPP positioning logic
      // so that 'W' moves in the direction the camera is facing.
      const lookDir = new THREE.Vector3(
        -Math.sin(yaw) * Math.cos(pitch),
        -Math.sin(pitch),
        -Math.cos(yaw) * Math.cos(pitch)
      );

      const lookTarget = camera.position.clone().add(lookDir.multiplyScalar(10));
      camera.lookAt(lookTarget);
    } else {
      // Third Person Mode - camera orbits around player
      const y = distance * Math.sin(pitch);
      const horizontal = distance * Math.cos(pitch);

      const x = horizontal * Math.sin(yaw);
      const z = horizontal * Math.cos(yaw);

      const desiredPos = playerObject.position
        .clone()
        .add(new THREE.Vector3(x, y + 3, z)); // +3 lifts camera above ground

      const minY = 0.5;
      current.current.x = THREE.MathUtils.lerp(current.current.x, desiredPos.x, lerpFactor);
      current.current.y = Math.max(minY, THREE.MathUtils.lerp(current.current.y, desiredPos.y, lerpFactor));
      current.current.z = THREE.MathUtils.lerp(current.current.z, desiredPos.z, lerpFactor);

      camera.position.set(current.current.x, current.current.y, current.current.z);

      camera.lookAt(
        playerObject.position.x,
        playerObject.position.y + 1.2,
        playerObject.position.z
      );
    }
  });

  return null;
}