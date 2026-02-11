"use client";

import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";
import MobileControls from "@/components/ui/mobile/MobileControls";

export default function AboutPage() {
  return (
    <>
      <SceneRoot scene="about" />
      <HUD />
      <MobileControls />
    </>
  );
}