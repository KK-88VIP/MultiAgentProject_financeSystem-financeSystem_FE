import { create } from 'zustand';

interface UiState {
  isChatPanelCollapsed: boolean;
  toggleChatPanel: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isChatPanelCollapsed: false,
  toggleChatPanel: () => set((state) => ({ isChatPanelCollapsed: !state.isChatPanelCollapsed })),
}));