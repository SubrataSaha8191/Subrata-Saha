"use client";

import { useGameStore } from "@/store/useGameStore";
import { skills } from "@/data/skills";

export default function ComputerDisplay() {
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);

  // Don't show popup anymore - skills are displayed on the 3D monitor
  // This component is kept for potential future use or can be removed
  if (roomInteractionState !== "using_computer") return null;

  // Return null since we're displaying on the 3D monitor now
  return null;
}
