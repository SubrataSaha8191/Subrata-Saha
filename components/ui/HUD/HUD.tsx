"use client";

import { useGameStore } from "@/store/useGameStore";
import { useIsMobile } from "@/hooks/useIsMobile";
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
  const isMobile = useIsMobile();

  // Get appropriate controls text based on context
  const getControlsText = () => {
    if (isMobile) {
      return getMobileControlsText();
    }
    return getDesktopControlsText();
  };

  const getMobileControlsText = () => {
    if (!isInRoom) {
      return "Use joystick to move • Tap buttons to interact";
    }

    switch (currentRoom) {
      case "projects":
        switch (roomInteractionState) {
          case "none":
            return "Joystick to move • E to sit • ✕ to exit";
          case "sitting_sofa":
            return "E to pick up remote • ✕ to stand up";
          case "holding_remote":
            return "E to turn on TV • ✕ to put down";
          case "watching_tv":
            return "Tap arrows for next • Tap links to open • ✕ to stop";
          default:
            return "✕ to go back";
        }

      case "skills":
        switch (roomInteractionState) {
          case "none":
            return "Joystick to move • E to sit • ✕ to exit";
          case "sitting_chair":
            return "E to use computer • ✕ to stand up";
          case "using_computer":
            return "Tap Next for next page • ✕ to stop";
          default:
            return "✕ to go back";
        }

      case "about":
        switch (roomInteractionState) {
          case "none":
            return "Joystick to move • E to sit • ✕ to exit";
          case "sitting_sofa":
            return "E to pick up coffee • ✕ to stand up";
          case "holding_coffee":
            return "Sip to sip coffee • Tap to continue • ✕ to put down";
          case "talking_npc":
            return "Tap to continue • ✕ to skip";
          default:
            return "✕ to go back";
        }

      case "contact":
        switch (roomInteractionState) {
          case "none":
            return "Joystick to move • E to interact • ✕ to exit";
          case "using_telephone":
          case "entering_code":
            return "Enter code on keypad • ✕ to exit";
          default:
            return "✕ to go back";
        }

      default:
        return "Joystick to move • ✕ to exit";
    }
  };

  const getDesktopControlsText = () => {
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
            return "Right Click for next project • Left Click to open links • ESC to turn off TV";
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
          case "talking_npc":
            return "Click to continue • ESC to skip dialogue";
          default:
            return "ESC to go back";
        }

      case "contact":
        switch (roomInteractionState) {
          case "none":
            return "WASD to move • E to interact (generator/telephone) • ESC to exit room";
          case "using_telephone":
          case "entering_code":
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
        zIndex: 5000,
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
          zIndex: 6000,
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
            background: "rgba(0, 0, 0, 0.75)",
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            backdropFilter: "blur(8px)",
            zIndex: 6000,
          }}
        >
          {currentRoom} Room
        </div>
      )}
    </div>
  );
}