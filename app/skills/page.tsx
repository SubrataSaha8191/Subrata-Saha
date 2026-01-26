"use client";

import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";

export default function SkillsPage() {
  return (
    <>
      <SceneRoot scene="skills" />
      <HUD />
    </>
  );
}