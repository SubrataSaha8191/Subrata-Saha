"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useUIStore } from "@/store/useUIStore";

export default function PortalTrigger({
  position,
  size = [2.4, 2.6, 2.4],
  label,
  onEnterReady,
}: {
  position: [number, number, number];
  size?: [number, number, number];
  label: string;
  onEnterReady: () => void;
}) {
  const playerPos = useGameStore((s) => s.playerPosition);
  const setPrompt = useUIStore((s) => s.setInteractionPrompt);

  const box = useMemo(() => {
    const b = new THREE.Box3();
    const center = new THREE.Vector3(position[0], position[1] + 1.2, position[2]);
    const halfSize = new THREE.Vector3(size[0] / 2, size[1] / 2, size[2] / 2);
    b.setFromCenterAndSize(center, halfSize.multiplyScalar(2));
    return b;
  }, [position, size]);

  useFrame(() => {
    const p = new THREE.Vector3(playerPos[0], playerPos[1], playerPos[2]);
    const inside = box.containsPoint(p);

    if (inside) {
      setPrompt(`Enter ${label}`);
      onEnterReady();
    } else {
      setPrompt(null);
    }
  });

  return null;
}