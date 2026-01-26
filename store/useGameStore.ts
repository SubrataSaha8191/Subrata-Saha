import { create } from "zustand";
import type * as THREE from "three";

type GameState = {
  isLoading: boolean;
  playerPosition: [number, number, number];
  playerObject: THREE.Object3D | null;

  // camera controls
  cameraYaw: number;
  cameraPitch: number;
  cameraDistance: number;

  setLoading: (v: boolean) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setPlayerObject: (obj: THREE.Object3D | null) => void;

  setCameraYaw: (v: number) => void;
  setCameraPitch: (v: number) => void;
  setCameraDistance: (v: number) => void;
};

export const useGameStore = create<GameState>((set) => ({
  isLoading: false,
  playerPosition: [0, 0.9, 10],
  playerObject: null,

  // default Roblox camera
  cameraYaw: Math.PI, // behind player
  cameraPitch: 0.35, // slight downward view
  cameraDistance: 10,

  setLoading: (v) => set({ isLoading: v }),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setPlayerObject: (obj) => set({ playerObject: obj }),

  setCameraYaw: (v) => set({ cameraYaw: v }),
  setCameraPitch: (v) => set({ cameraPitch: v }),
  setCameraDistance: (v) => set({ cameraDistance: v }),
}));