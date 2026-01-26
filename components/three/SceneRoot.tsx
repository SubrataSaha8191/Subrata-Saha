"use client";

import CanvasRoot from "./CanvasRoot";
import HubWorld from "./environments/HubWorld";
import ProjectsRoom from "./environments/ProjectsRoom";
import SkillsRoom from "./environments/SkillsRoom";
import RobloxCharacter from "./player/RobloxCharacter";
import PlayerCamera from "./player/PlayerCamera";
import PlayerCameraControls from "./player/PlayerCameraControls";
import type { GameScene } from "@/types/game";

export default function SceneRoot({ scene }: { scene: GameScene }) {
  return (
    <CanvasRoot>
      <RobloxCharacter />
      <PlayerCameraControls />
      <PlayerCamera />

      {scene === "hub" && <HubWorld />}
      {scene === "projects" && <ProjectsRoom />}
      {scene === "skills" && <SkillsRoom />}
    </CanvasRoot>
  );
}