"use client";

import { useEffect, useState } from "react";
import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";
import CharacterCustomizer from "@/components/ui/CharacterCustomizer";
import ControlsInfo from "@/components/ui/ControlsInfo";
import Preloader from "@/components/Preloader";
import { useGameStore } from "@/store/useGameStore";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const setLoading = useGameStore((s) => s.setLoading);

  useEffect(() => {
    setLoading(true);
    return () => setLoading(false);
  }, [setLoading]);

  // Trigger content fade-in after preloader completes
  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <>
      <div
        style={{
          opacity: showContent ? 1 : 0,
          transition: "opacity 0.8s ease-in-out",
          position: "fixed",
          inset: 0,
        }}
      >
        <SceneRoot scene="hub" />
        <HUD />
        <ControlsInfo />
        <CharacterCustomizer />
      </div>
      {isLoading && (
        <Preloader
          onComplete={() => {
            setIsLoading(false);
            setLoading(false);
          }}
          minDuration={3500}
        />
      )}
    </>
  );
}