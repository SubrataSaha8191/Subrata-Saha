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

  const current = useRef({
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  });

  useFrame((_, delta) => {
    if (!playerObject) return;

    // spherical coords -> camera offset
    const y = distance * Math.sin(pitch);
    const horizontal = distance * Math.cos(pitch);

    const x = horizontal * Math.sin(yaw);
    const z = horizontal * Math.cos(yaw);

    const desiredPos = playerObject.position
      .clone()
      .add(new THREE.Vector3(x, y + 3, z)); // +3 lifts camera above ground

    const lerpFactor = clamp(1 - Math.pow(0.001, delta), 0, 1);

    current.current.x = THREE.MathUtils.lerp(current.current.x, desiredPos.x, lerpFactor);
    current.current.y = THREE.MathUtils.lerp(current.current.y, desiredPos.y, lerpFactor);
    current.current.z = THREE.MathUtils.lerp(current.current.z, desiredPos.z, lerpFactor);

    camera.position.set(current.current.x, current.current.y, current.current.z);

    camera.lookAt(
      playerObject.position.x,
      playerObject.position.y + 1.2,
      playerObject.position.z
    );
  });

  return null;
}