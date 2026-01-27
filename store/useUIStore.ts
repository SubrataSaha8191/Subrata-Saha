import { create } from "zustand";

type UIState = {
  interactionPrompt: string | null;
  setInteractionPrompt: (text: string | null) => void;

  // Dialogue system
  dialogueText: string | null;
  dialogueSpeaker: string | null;
  isDialogueTyping: boolean;
  setDialogueText: (text: string | null) => void;
  setDialogueSpeaker: (speaker: string | null) => void;
  setIsDialogueTyping: (v: boolean) => void;

  // Notification
  notification: string | null;
  setNotification: (text: string | null) => void;

  // Show/hide specific UI elements
  showTelephoneUI: boolean;
  showContactCard: boolean;
  setShowTelephoneUI: (v: boolean) => void;
  setShowContactCard: (v: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  interactionPrompt: null,
  setInteractionPrompt: (text) => set({ interactionPrompt: text }),

  // Dialogue system
  dialogueText: null,
  dialogueSpeaker: null,
  isDialogueTyping: false,
  setDialogueText: (text) => set({ dialogueText: text }),
  setDialogueSpeaker: (speaker) => set({ dialogueSpeaker: speaker }),
  setIsDialogueTyping: (v) => set({ isDialogueTyping: v }),

  // Notification
  notification: null,
  setNotification: (text) => set({ notification: text }),

  // Telephone UI
  showTelephoneUI: false,
  showContactCard: false,
  setShowTelephoneUI: (v) => set({ showTelephoneUI: v }),
  setShowContactCard: (v) => set({ showContactCard: v }),
}));