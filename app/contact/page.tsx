"use client";

import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";
import MobileControls from "@/components/ui/mobile/MobileControls";

export default function ContactPage() {
  return (
    <>
      <SceneRoot scene="contact" />
      <HUD />
      <MobileControls />
    </>
  );
}