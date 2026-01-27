"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { clamp } from "@/lib/utils/clamp";

const FPP_DISTANCE_THRESHOLD = 2; // Distance at which we switch to FPP mode
const MIN_DISTANCE = 0.5; // Minimum distance (deep FPP)
const MAX_DISTANCE = 18; // Maximum distance (far TPP)

export default function PlayerCameraControls() {
  const yaw = useGameStore((s) => s.cameraYaw);
  const pitch = useGameStore((s) => s.cameraPitch);
  const distance = useGameStore((s) => s.cameraDistance);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const isInRoom = useGameStore((s) => s.isInRoom);
  const canControlCamera = useGameStore((s) => s.canControlCamera);

  const setYaw = useGameStore((s) => s.setCameraYaw);
  const setPitch = useGameStore((s) => s.setCameraPitch);
  const setDistance = useGameStore((s) => s.setCameraDistance);
  const setCameraMode = useGameStore((s) => s.setCameraMode);

  // RMB drag (for TPP mode)
  const draggingRef = useRef(false);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      // Right click drag (Roblox-like) - only in TPP mode and not in room
      if (e.button === 2 && cameraMode === "tpp" && !isInRoom) {
        draggingRef.current = true;
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        draggingRef.current = false;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      // In FPP mode, mouse movement directly controls camera (no click needed)
      if (cameraMode === "fpp") {
        const sensitivity = 0.002;
        const nextYaw = yaw - e.movementX * sensitivity;
        const nextPitch = pitch + e.movementY * sensitivity;
        setYaw(nextYaw);
        setPitch(clamp(nextPitch, -1.4, 1.4));
        return;
      }

      // In TPP mode, only rotate when dragging with right mouse button
      if (!draggingRef.current) return;

      const sensitivity = 0.003;
      const nextYaw = yaw - e.movementX * sensitivity;
      const nextPitch = pitch + e.movementY * sensitivity;

      setYaw(nextYaw);
      setPitch(clamp(nextPitch, -1.4, 1.4));
    };

    const onWheel = (e: WheelEvent) => {
      // Disable scroll/zoom when in a room
      if (isInRoom) {
        e.preventDefault();
        return;
      }

      const zoomSpeed = 0.01;
      const next = distance + e.deltaY * zoomSpeed;
      const clampedDistance = clamp(next, MIN_DISTANCE, MAX_DISTANCE);

      setDistance(clampedDistance);

      // Update camera mode based on distance
      if (clampedDistance <= FPP_DISTANCE_THRESHOLD && cameraMode === "tpp") {
        setCameraMode("fpp");
        // Request pointer lock for FPP mode
        document.body.requestPointerLock?.();
      } else if (clampedDistance > FPP_DISTANCE_THRESHOLD && cameraMode === "fpp") {
        setCameraMode("tpp");
        // Exit pointer lock when going back to TPP
        document.exitPointerLock?.();
      }
    };

    const onPointerLockChange = () => {
      // If pointer lock is released while in FPP mode, stay in FPP but allow manual control
      if (!document.pointerLockElement && cameraMode === "fpp") {
        // User can re-enter by clicking on the canvas
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      // stop right click menu (for game feel)
      e.preventDefault();
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("pointerlockchange", onPointerLockChange);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
    };
  }, [yaw, pitch, distance, cameraMode, isInRoom, setYaw, setPitch, setDistance, setCameraMode]);

  // Force FPP mode when entering a room
  useEffect(() => {
    if (isInRoom) {
      setCameraMode("fpp");
      setDistance(0.5);
      document.body.requestPointerLock?.();
    }
  }, [isInRoom, setCameraMode, setDistance]);

  // Click to enter pointer lock in FPP mode
  useEffect(() => {
    const onClick = () => {
      if (cameraMode === "fpp" && !document.pointerLockElement) {
        document.body.requestPointerLock?.();
      }
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [cameraMode]);

  return null;
}