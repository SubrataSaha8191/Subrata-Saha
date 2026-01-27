"use client";

import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";

export default function AboutPage() {
  return (
    <>
      <SceneRoot scene="about" />
      <HUD />
    </>
  );
}