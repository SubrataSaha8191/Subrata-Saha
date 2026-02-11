"use client";

import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";
import MobileControls from "@/components/ui/mobile/MobileControls";

export default function SkillsPage() {
  return (
    <>
      <SceneRoot scene="skills" />
      <HUD />
      <MobileControls />
    </>
  );
}