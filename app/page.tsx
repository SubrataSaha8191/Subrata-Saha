"use client";

import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";
import CharacterCustomizer from "@/components/ui/CharacterCustomizer";
import ControlsInfo from "@/components/ui/ControlsInfo";

export default function HomePage() {
  return (
    <>
      <SceneRoot scene="hub" />
      <HUD />
      <ControlsInfo />
      <CharacterCustomizer />
    </>
  );
}