"use client";

import { useGameStore } from "@/store/useGameStore";
import Crosshair from "./Crosshair";
import InteractionPrompt from "./InteractionPrompt";
import LoadingOverlay from "./LoadingOverlay";
import DialogueBox from "./DialogueBox";
import TVDisplay from "./TVDisplay";
import ComputerDisplay from "./ComputerDisplay";
import TelephoneUI from "./TelephoneUI";
import ContactCard from "./ContactCard";
import Notification from "./Notification";

export default function HUD() {
  const isInRoom = useGameStore((s) => s.isInRoom);
  const currentRoom = useGameStore((s) => s.currentRoom);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);

  // Get appropriate controls text based on context
  const getControlsText = () => {
    if (!isInRoom) {
      return "WASD / Arrow keys to move • Shift to sprint • E to interact";
    }

    switch (currentRoom) {
      case "projects":
        switch (roomInteractionState) {
          case "none":
            return "WASD to move • E to sit on sofa • ESC to exit room";
          case "sitting_sofa":
            return "E to pick up remote • ESC to stand up";
          case "holding_remote":
            return "E to turn on TV • ESC to put down remote";
          case "watching_tv":
            return "Left Click for next project • ESC to turn off TV";
          default:
            return "ESC to go back";
        }

      case "skills":
        switch (roomInteractionState) {
          case "none":
            return "WASD to move • E to sit on chair • ESC to exit room";
          case "sitting_chair":
            return "E to use computer • ESC to stand up";
          case "using_computer":
            return "ESC to stop using computer";
          default:
            return "ESC to go back";
        }

      case "about":
        switch (roomInteractionState) {
          case "none":
            return "WASD to move • E to sit • ESC to exit room";
          case "sitting_sofa":
            return "E to pick up coffee • ESC to stand up";
          case "holding_coffee":
            return "Q to sip coffee • Click to continue dialogue • ESC to put down coffee";
          case "in_dialogue":
            return "Click to continue • ESC to skip dialogue";
          default:
            return "ESC to go back";
        }

      case "contact":
        switch (roomInteractionState) {
          case "none":
            return "WASD to move • E to interact • ESC to exit room";
          case "at_generator":
            return "E to turn on generator • ESC to step back";
          case "at_telephone":
            return "Enter code on keypad • ESC to step back";
          default:
            return "ESC to go back";
        }

      default:
        return "WASD to move • ESC to exit";
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <Crosshair />
      <InteractionPrompt />
      <LoadingOverlay />
      
      {/* Room-specific HUD components */}
      <DialogueBox />
      <TVDisplay />
      <ComputerDisplay />
      <TelephoneUI />
      <ContactCard />
      <Notification />

      {/* Controls panel */}
      <div
        style={{
          position: "absolute",
          left: 16,
          bottom: 16,
          padding: "10px 12px",
          border: "1px solid var(--border)",
          borderRadius: 14,
          background: "var(--panel)",
          backdropFilter: "blur(10px)",
          pointerEvents: "auto",
          maxWidth: "calc(100vw - 32px)",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 14 }}>Controls</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          {getControlsText()}
        </div>
      </div>

      {/* Room indicator */}
      {isInRoom && currentRoom && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            padding: "8px 16px",
            borderRadius: 8,
            background: "rgba(124, 58, 237, 0.2)",
            border: "1px solid rgba(124, 58, 237, 0.5)",
            color: "#a855f7",
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {currentRoom} Room
        </div>
      )}
    </div>
  );
}