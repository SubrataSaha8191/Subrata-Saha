import { create } from "zustand";
import type * as THREE from "three";

type CameraMode = "tpp" | "fpp";

// Room interaction states
type RoomInteractionState = 
  | "none"
  | "sitting_sofa"
  | "holding_remote"
  | "watching_tv"
  | "sitting_chair"
  | "using_computer"
  | "talking_npc"
  | "holding_coffee"
  | "using_telephone"
  | "entering_code";

type GameState = {
  isLoading: boolean;
  playerPosition: [number, number, number];
  playerObject: THREE.Object3D | null;

  // camera controls
  cameraYaw: number;
  cameraPitch: number;
  cameraDistance: number;
  cameraMode: CameraMode;

  // player physics
  isJumping: boolean;
  velocityY: number;

  // time of day (0-24 hours)
  timeOfDay: number;

  // Room state
  isInRoom: boolean;
  currentRoom: string | null;
  roomInteractionState: RoomInteractionState;
  canControlCamera: boolean;

  // Projects room
  currentProjectIndex: number;
  isTVOn: boolean;

  // Contact room
  isGeneratorOn: boolean;
  telephoneCode: string;
  isCodeCorrect: boolean;

  // About room
  dialogueIndex: number;
  isDialogueActive: boolean;

  setLoading: (v: boolean) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setPlayerObject: (obj: THREE.Object3D | null) => void;

  setCameraYaw: (v: number) => void;
  setCameraPitch: (v: number) => void;
  setCameraDistance: (v: number) => void;
  setCameraMode: (mode: CameraMode) => void;

  setIsJumping: (v: boolean) => void;
  setVelocityY: (v: number) => void;

  setTimeOfDay: (v: number) => void;

  // Room state setters
  setIsInRoom: (v: boolean) => void;
  setCurrentRoom: (room: string | null) => void;
  setRoomInteractionState: (state: RoomInteractionState) => void;
  setCanControlCamera: (v: boolean) => void;

  // Projects room setters
  setCurrentProjectIndex: (i: number) => void;
  setIsTVOn: (v: boolean) => void;

  // Contact room setters
  setIsGeneratorOn: (v: boolean) => void;
  setTelephoneCode: (code: string) => void;
  setIsCodeCorrect: (v: boolean) => void;

  // About room setters
  setDialogueIndex: (i: number) => void;
  setIsDialogueActive: (v: boolean) => void;

  // Helper to enter room
  enterRoom: (room: string) => void;
  exitRoom: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  isLoading: false,
  playerPosition: [0, 0.9, 10],
  playerObject: null,

  // default Roblox camera
  cameraYaw: Math.PI, // behind player
  cameraPitch: 0.35, // slight downward view
  cameraDistance: 10,
  cameraMode: "tpp",

  // jump
  isJumping: false,
  velocityY: 0,

  // Start at morning (6 AM)
  timeOfDay: 6,

  // Room state defaults
  isInRoom: false,
  currentRoom: null,
  roomInteractionState: "none",
  canControlCamera: true,

  // Projects room defaults
  currentProjectIndex: 0,
  isTVOn: false,

  // Contact room defaults
  isGeneratorOn: false,
  telephoneCode: "",
  isCodeCorrect: false,

  // About room defaults
  dialogueIndex: 0,
  isDialogueActive: false,

  setLoading: (v) => set({ isLoading: v }),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setPlayerObject: (obj) => set({ playerObject: obj }),

  setCameraYaw: (v) => set({ cameraYaw: v }),
  setCameraPitch: (v) => set({ cameraPitch: v }),
  setCameraDistance: (v) => set({ cameraDistance: v }),
  setCameraMode: (mode) => set({ cameraMode: mode }),

  setIsJumping: (v) => set({ isJumping: v }),
  setVelocityY: (v) => set({ velocityY: v }),

  setTimeOfDay: (v) => set({ timeOfDay: v % 24 }),

  // Room state setters
  setIsInRoom: (v) => set({ isInRoom: v }),
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setRoomInteractionState: (state) => set({ roomInteractionState: state }),
  setCanControlCamera: (v) => set({ canControlCamera: v }),

  // Projects room setters
  setCurrentProjectIndex: (i) => set({ currentProjectIndex: i }),
  setIsTVOn: (v) => set({ isTVOn: v }),

  // Contact room setters
  setIsGeneratorOn: (v) => set({ isGeneratorOn: v }),
  setTelephoneCode: (code) => set({ telephoneCode: code }),
  setIsCodeCorrect: (v) => set({ isCodeCorrect: v }),

  // About room setters
  setDialogueIndex: (i) => set({ dialogueIndex: i }),
  setIsDialogueActive: (v) => set({ isDialogueActive: v }),

  // Helper to enter room - forces FPP mode
  enterRoom: (room) => set({
    isInRoom: true,
    currentRoom: room,
    cameraMode: "fpp",
    cameraDistance: 0.5,
    canControlCamera: false,
  }),

  // Helper to exit room
  exitRoom: () => set({
    isInRoom: false,
    currentRoom: null,
    roomInteractionState: "none",
    canControlCamera: true,
    isTVOn: false,
    telephoneCode: "",
    isCodeCorrect: false,
    dialogueIndex: 0,
    isDialogueActive: false,
  }),
}));