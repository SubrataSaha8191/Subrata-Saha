"use client";

import { useEffect, useState } from "react";
import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";
import CharacterCustomizer from "@/components/ui/CharacterCustomizer";
import ControlsInfo from "@/components/ui/ControlsInfo";
import MobileControls from "@/components/ui/mobile/MobileControls";
import Preloader from "@/components/Preloader";
import { useGameStore } from "@/store/useGameStore";

const SKIP_PRELOADER_KEY = "skipPreloaderOnce";

export default function HomePage() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const setLoading = useGameStore((s) => s.setLoading);
  const setLoadingStyle = useGameStore((s) => s.setLoadingStyle);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldSkipPreloader =
      window.sessionStorage.getItem(SKIP_PRELOADER_KEY) === "1";
    if (shouldSkipPreloader) {
      window.sessionStorage.removeItem(SKIP_PRELOADER_KEY);
    }
    setIsLoading(!shouldSkipPreloader);
    setShowContent(shouldSkipPreloader);
    setLoading(!shouldSkipPreloader);
    setLoadingStyle("panel");
    setIsReady(true);
    return () => setLoading(false);
  }, [setLoading, setLoadingStyle]);

  // Trigger content fade-in after preloader completes
  useEffect(() => {
    if (!isReady) return;
    if (!isLoading) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isReady]);

  return (
    <>
      <div
        style={{
          opacity: isReady ? (showContent ? 1 : 0) : 1,
          transition: "opacity 0.8s ease-in-out",
          position: "fixed",
          inset: 0,
        }}
      >
        <SceneRoot scene="hub" />
        <HUD />
        <ControlsInfo />
        <CharacterCustomizer />
        <MobileControls />
      </div>
      {isReady && isLoading && (
        <Preloader
          onComplete={() => {
            setIsLoading(false);
            setLoading(false);
            setLoadingStyle("panel");
          }}
          minDuration={3500}
        />
      )}
    </>
  );
}