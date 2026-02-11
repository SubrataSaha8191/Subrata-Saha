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
        const result = canvas.requestPointerLock();
        if (result && typeof (result as Promise<void>).catch === "function") {
          (result as Promise<void>).catch((err) => {
            if (err?.name === "SecurityError" || /exited the lock/i.test(String(err))) return;
            // eslint-disable-next-line no-console
            console.warn("Pointer lock request failed:", err);
          });
        }
      } else {
        const result = document.body.requestPointerLock?.();
        if (result && typeof (result as Promise<void>).catch === "function") {
          (result as Promise<void>).catch((err) => {
            if (err?.name === "SecurityError" || /exited the lock/i.test(String(err))) return;
            // eslint-disable-next-line no-console
            console.warn("Pointer lock request failed:", err);
          });
        }
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
      const result = document.exitPointerLock?.();
      if (result && typeof (result as Promise<void>).catch === "function") {
        (result as Promise<void>).catch((err) => {
          if (err?.name === "SecurityError" || /exited the lock/i.test(String(err))) return;
          // eslint-disable-next-line no-console
          console.warn("Pointer lock exit failed:", err);
        });
      }
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