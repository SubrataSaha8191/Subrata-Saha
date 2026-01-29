"use client";

import { useState } from "react";
import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";
import CharacterCustomizer from "@/components/ui/CharacterCustomizer";
import ControlsInfo from "@/components/ui/ControlsInfo";
import Preloader from "@/components/Preloader";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <Preloader onComplete={() => setIsLoading(false)} minDuration={3500} />
      ) : (
        <>
          <SceneRoot scene="hub" />
          <HUD />
          <ControlsInfo />
          <CharacterCustomizer />
        </>
      )}
    </>
  );
}