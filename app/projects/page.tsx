"use client";

import SceneRoot from "@/components/three/SceneRoot";
import HUD from "@/components/ui/HUD/HUD";

export default function ProjectsPage() {
  return (
    <>
      <SceneRoot scene="projects" />
      <HUD />
    </>
  );
}