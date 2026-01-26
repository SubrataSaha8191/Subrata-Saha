import { create } from "zustand";

type UIState = {
  interactionPrompt: string | null;
  setInteractionPrompt: (text: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  interactionPrompt: null,
  setInteractionPrompt: (text) => set({ interactionPrompt: text }),
}));