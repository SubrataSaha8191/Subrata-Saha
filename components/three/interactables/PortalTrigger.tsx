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
  // notify with true when inside and false when leaving
  onEnterReady: (ready: boolean) => void;
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

  // Use getState to read current prompt without subscribing
  const uiGetState = useUIStore.getState;

  useFrame(() => {
    const p = new THREE.Vector3(playerPos[0], playerPos[1], playerPos[2]);
    const inside = box.containsPoint(p);

    if (inside) {
      setPrompt(`Enter ${label}`);
      onEnterReady(true);
    } else {
      // Only clear the prompt if it refers to this portal's label and mentions enter
      const current = uiGetState().interactionPrompt;
      const isOwnEnterPrompt =
        current &&
        current.toLowerCase().includes(label.toLowerCase()) &&
        current.toLowerCase().includes("enter");

      if (isOwnEnterPrompt) setPrompt(null);
      onEnterReady(false);
    }
  });

  return null;
}