import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sounds } from '../lib/sounds';

interface SettingsState {
  volume: number;
  setVolume: (volume: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      volume: 0.5,
      setVolume: (volume) => {
        set({ volume });
        sounds.setVolume(volume);
      },
    }),
    {
      name: 'typogram-settings',
      onRehydrateStorage: () => (state) => {
        if (state) {
          sounds.setVolume(state.volume);
        }
      },
    }
  )
);
