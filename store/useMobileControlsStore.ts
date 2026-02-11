import { create } from "zustand";

type MobileControlsState = {
  // Joystick state (normalized -1 to 1)
  joystickX: number;
  joystickY: number;
  isJoystickActive: boolean;
  
  // Touch camera control
  touchDeltaX: number;
  touchDeltaY: number;
  
  // Action buttons
  isJumpPressed: boolean;
  isSprintActive: boolean;
  isInteractPressed: boolean;
  isBackPressed: boolean;
  isSipPressed: boolean;
  isNextPressed: boolean;
  
  // Setters
  setJoystick: (x: number, y: number) => void;
  setIsJoystickActive: (v: boolean) => void;
  setTouchDelta: (x: number, y: number) => void;
  resetTouchDelta: () => void;
  setIsJumpPressed: (v: boolean) => void;
  setIsSprintActive: (v: boolean) => void;
  setIsInteractPressed: (v: boolean) => void;
  setIsBackPressed: (v: boolean) => void;
  setIsSipPressed: (v: boolean) => void;
  setIsNextPressed: (v: boolean) => void;
};

export const useMobileControlsStore = create<MobileControlsState>((set) => ({
  joystickX: 0,
  joystickY: 0,
  isJoystickActive: false,
  
  touchDeltaX: 0,
  touchDeltaY: 0,
  
  isJumpPressed: false,
  isSprintActive: false,
  isInteractPressed: false,
  isBackPressed: false,
  isSipPressed: false,
  isNextPressed: false,
  
  setJoystick: (x, y) => set({ joystickX: x, joystickY: y }),
  setIsJoystickActive: (v) => set({ isJoystickActive: v }),
  setTouchDelta: (x, y) => set({ touchDeltaX: x, touchDeltaY: y }),
  resetTouchDelta: () => set({ touchDeltaX: 0, touchDeltaY: 0 }),
  setIsJumpPressed: (v) => set({ isJumpPressed: v }),
  setIsSprintActive: (v) => set({ isSprintActive: v }),
  setIsInteractPressed: (v) => set({ isInteractPressed: v }),
  setIsBackPressed: (v) => set({ isBackPressed: v }),
  setIsSipPressed: (v) => set({ isSipPressed: v }),
  setIsNextPressed: (v) => set({ isNextPressed: v }),
}));
