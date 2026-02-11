"use client";

import { useEffect, useState } from "react";
import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";
import CharacterCustomizer from "@/components/ui/CharacterCustomizer";
import ControlsInfo from "@/components/ui/ControlsInfo";
import MobileControls from "@/components/ui/mobile/MobileControls";
import Preloader from "@/components/Preloader";
import { useGameStore } from "@/store/useGameStore";

const PRELOADER_KEY = "preloaderSeen";

export default function HomePage() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const setLoading = useGameStore((s) => s.setLoading);
  const setLoadingStyle = useGameStore((s) => s.setLoadingStyle);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSeenPreloader = window.localStorage.getItem(PRELOADER_KEY) === "1";
    setIsLoading(!hasSeenPreloader);
    setShowContent(hasSeenPreloader);
    setLoading(!hasSeenPreloader);
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
        <MobileControls />
      </div>
      {isReady && isLoading && (
        <Preloader
          onComplete={() => {
            window.localStorage.setItem(PRELOADER_KEY, "1");
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