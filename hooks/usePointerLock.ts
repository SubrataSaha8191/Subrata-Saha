"use client";

import { useCallback, useEffect, useState } from "react";

export function usePointerLock() {
  const [locked, setLocked] = useState(false);

  const requestLock = useCallback(() => {
    try {
      // If already locked, do nothing
      if (document.pointerLockElement) return;
      const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
      if (canvas?.requestPointerLock) {
        canvas.requestPointerLock();
      } else {
        document.body.requestPointerLock?.();
      }
    } catch (err: any) {
      // Ignore SecurityError where user exits the lock before the request completes
      if (err?.name === "SecurityError" || /exited the lock/i.test(String(err))) {
        return;
      }
      // Some environments (e.g. iframes without proper allow attributes) throw WrongDocumentError
      // Handle gracefully so app doesn't crash.
      // eslint-disable-next-line no-console
      console.warn("Pointer lock request failed:", err);
    }
  }, []);

  const exitLock = useCallback(() => {
    try {
      if (!document.pointerLockElement) return;
      document.exitPointerLock?.();
    } catch (err: any) {
      if (err?.name === "SecurityError" || /exited the lock/i.test(String(err))) {
        return;
      }
      // ignore other errors but log
      // eslint-disable-next-line no-console
      console.warn("Pointer lock exit failed:", err);
    }
  }, []);

  useEffect(() => {
    const onChange = () => {
      // Consider any element being pointer-locked as locked
      setLocked(Boolean(document.pointerLockElement));
    };

    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, []);

  return { locked, requestLock, exitLock };
}