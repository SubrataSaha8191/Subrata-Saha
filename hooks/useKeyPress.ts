"use client";

import { useEffect, useState } from "react";

export function useKeyPress(code: string) {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === code) setPressed(true);
    };

    const up = (e: KeyboardEvent) => {
      if (e.code === code) setPressed(false);
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [code]);

  return pressed;
}