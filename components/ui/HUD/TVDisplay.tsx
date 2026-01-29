"use client";

import { useGameStore } from "@/store/useGameStore";
import { projects } from "@/data/projects";

export default function TVDisplay() {
  const isTVOn = useGameStore((s) => s.isTVOn);
  const currentProjectIndex = useGameStore((s) => s.currentProjectIndex);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);

  // Don't show popup anymore - projects are displayed on the 3D TV
  // This component is kept for potential future use or can be removed
  if (!isTVOn || roomInteractionState !== "watching_tv") return null;

  // Return null since we're displaying on the 3D TV now
  return null;
}
