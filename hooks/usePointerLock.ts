"use client";

import { useCallback, useEffect, useState } from "react";

export function usePointerLock() {
  const [locked, setLocked] = useState(false);

  const requestLock = useCallback(() => {
    document.body.requestPointerLock?.();
  }, []);

  const exitLock = useCallback(() => {
    document.exitPointerLock?.();
  }, []);

  useEffect(() => {
    const onChange = () => {
      setLocked(document.pointerLockElement === document.body);
    };

    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, []);

  return { locked, requestLock, exitLock };
}