"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { clamp } from "@/lib/utils/clamp";

export default function PlayerCameraControls() {
  const yaw = useGameStore((s) => s.cameraYaw);
  const pitch = useGameStore((s) => s.cameraPitch);
  const distance = useGameStore((s) => s.cameraDistance);

  const setYaw = useGameStore((s) => s.setCameraYaw);
  const setPitch = useGameStore((s) => s.setCameraPitch);
  const setDistance = useGameStore((s) => s.setCameraDistance);

  // RMB drag
  const draggingRef = useRef(false);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      // Right click drag (Roblox-like)
      if (e.button === 2) {
        draggingRef.current = true;
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        draggingRef.current = false;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;

      const sensitivity = 0.003;

      const nextYaw = yaw - e.movementX * sensitivity;
      const nextPitch = pitch + e.movementY * sensitivity;

      setYaw(nextYaw);
      setPitch(clamp(nextPitch, -0.2, 1.1)); // limit vertical rotation
    };

    const onWheel = (e: WheelEvent) => {
      if (draggingRef.current) return;

    const zoomSpeed = 0.01; // adjust feel (0.005–0.02)
    const next = distance + e.deltaY * zoomSpeed;

    setDistance(clamp(next, 4, 18));
  };

    const preventContextMenu = (e: MouseEvent) => {
      // stop right click menu (for game feel)
      e.preventDefault();
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("contextmenu", preventContextMenu);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("contextmenu", preventContextMenu);
    };
  }, [yaw, pitch, distance, setYaw, setPitch, setDistance]);

  return null;
}