"use client";

import { create } from "zustand";

export type CharacterOutfit = "casual" | "dinosaur" | "rugby" | "santa" | "robot";

interface CharacterState {
    currentOutfit: CharacterOutfit;
    isCustomizerOpen: boolean;
    setOutfit: (outfit: CharacterOutfit) => void;
    toggleCustomizer: () => void;
    setCustomizerOpen: (open: boolean) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
    currentOutfit: "casual",
    isCustomizerOpen: false,
    setOutfit: (outfit) => set({ currentOutfit: outfit }),
    toggleCustomizer: () => set((state) => ({ isCustomizerOpen: !state.isCustomizerOpen })),
    setCustomizerOpen: (open) => set({ isCustomizerOpen: open }),
}));
