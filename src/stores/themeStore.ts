import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Wallpaper } from '../types';

interface ThemeStore {
  isDark: boolean;
  wallpaper: Wallpaper;
  toggleDark: () => void;
  setWallpaper: (w: Wallpaper) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      wallpaper: 'dynamic',
      toggleDark: () => set(s => ({ isDark: !s.isDark })),
      setWallpaper: (wallpaper) => set({ wallpaper }),
    }),
    { name: 'portfolio-theme' }
  )
);
