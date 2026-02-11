"use client";

import { useKeyPress } from "./useKeyPress";
import { useMobileControlsStore } from "@/store/useMobileControlsStore";

/**
 * Hook that combines keyboard key press with mobile button press
 * for interaction (E key) and back (Escape key) actions
 */
export function useMobileAwareKeyPress(code: string) {
  const keyPressed = useKeyPress(code);
  
  // Get mobile button states
  const mobileInteract = useMobileControlsStore((s) => s.isInteractPressed);
  const mobileBack = useMobileControlsStore((s) => s.isBackPressed);
  
  // Map keyboard codes to mobile actions
  if (code === "KeyE") {
    return keyPressed || mobileInteract;
  }
  
  if (code === "Escape") {
    return keyPressed || mobileBack;
  }
  
  // For other keys, just return the keyboard state
  return keyPressed;
}
