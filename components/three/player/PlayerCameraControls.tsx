"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useUIStore } from "@/store/useUIStore";
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
  const sittingState = useGameStore((s) => s.sittingState);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);
  const isTVOn = useGameStore((s) => s.isTVOn);
  const showTelephoneUI = useUIStore((s) => s.showTelephoneUI);
  const showTelephoneRef = useRef(showTelephoneUI);
  useEffect(() => { showTelephoneRef.current = showTelephoneUI; }, [showTelephoneUI]);

  // Suppress immediate pointer lock requests for a short window after the telephone UI closes
  const suppressUntilRef = useRef(0);
  useEffect(() => {
    if (!showTelephoneUI) {
      // When UI closes, suppress pointer lock for 300ms to avoid clicks that triggered the close
      suppressUntilRef.current = Date.now() + 300;
    }
  }, [showTelephoneUI]);
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
      // Sitting: allow full yaw + limited pitch
      if (sittingState.isSitting) {
        const sensitivity = 0.001;
        const nextYaw = yaw - e.movementX * sensitivity;
        const nextPitch = pitch + e.movementY * sensitivity;
        setYaw(nextYaw);
        setPitch(clamp(nextPitch, -0.3, 0.5));
        return;
      }
      
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
      // Disable scroll/zoom when in a room or sitting
      if (isInRoom || sittingState.isSitting) {
        e.preventDefault();
        return;
      }

      const zoomSpeed = 0.01;
      const next = distance + e.deltaY * zoomSpeed;
      const clampedDistance = clamp(next, MIN_DISTANCE, MAX_DISTANCE);

      setDistance(clampedDistance);

      // Update camera mode based on distance
      if (clampedDistance <= FPP_DISTANCE_THRESHOLD && cameraMode === "tpp") {
        // Switch to FPP mode (do NOT request pointer lock here since wheel isn't guaranteed to be a user gesture)
        setCameraMode("fpp");
        // User should click to engage pointer lock (handled by the click handler)
      } else if (clampedDistance > FPP_DISTANCE_THRESHOLD && cameraMode === "fpp") {
        setCameraMode("tpp");
        // Exit pointer lock when going back to TPP - only if locked
        if (document.pointerLockElement) {
          try {
            document.exitPointerLock?.();
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn("Pointer lock exit failed:", err);
          }
        }
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
  }, [yaw, pitch, distance, cameraMode, isInRoom, sittingState.isSitting, setYaw, setPitch, setDistance, setCameraMode]);

  // Force FPP mode when entering a room (do NOT request pointer lock programmatically)
  useEffect(() => {
    if (isInRoom) {
      setCameraMode("fpp");
      setDistance(0.5);
      // Do NOT call requestPointerLock() here — it must be triggered by a user gesture (click)
      // The click handler below will request pointer lock when the user clicks the canvas.
    }
  }, [isInRoom, setCameraMode, setDistance]);

  // Click to enter pointer lock in FPP mode
  useEffect(() => {
    const onClick = () => {
      // If any UI modal that requires the cursor is open, do not request pointer lock
      if (showTelephoneRef.current) return;

      if (roomInteractionState === "watching_tv" && isTVOn) {
        if (document.pointerLockElement) {
          try {
            document.exitPointerLock?.();
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn("Pointer lock exit failed:", err);
          }
        }
        return;
      }

      if (cameraMode === "fpp" && !document.pointerLockElement) {
        // Do not request pointer lock if we are within the suppression window
        if (Date.now() < suppressUntilRef.current) return;

        const safeRequest = () => {
          try {
            const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
            if (canvas?.requestPointerLock) canvas.requestPointerLock();
            else document.body.requestPointerLock?.();
          } catch (err: any) {
            // Ignore SecurityError that occurs when user exits the lock before completion
            if (err?.name === "SecurityError" || /exited the lock/i.test(String(err))) {
              // no-op
              return;
            }
            // eslint-disable-next-line no-console
            console.warn("Pointer lock request failed:", err);
          }
        };

        // Call request in a microtask to avoid immediate race with other event handlers
        Promise.resolve().then(safeRequest);
      }
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [cameraMode, roomInteractionState, isTVOn, showTelephoneUI]);

  return null;
}