import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BootStore {
  bootComplete: boolean;
  onboardingShown: boolean;
  setBootComplete: () => void;
  setOnboardingShown: () => void;
  restart: () => void;
  resetOnboarding: () => void;
}

export const useBootStore = create<BootStore>()(
  persist(
    (set) => ({
      bootComplete: false,
      onboardingShown: false,
      setBootComplete: () => set({ bootComplete: true }),
      setOnboardingShown: () => set({ onboardingShown: true }),
      restart: () => set({ bootComplete: false }),
      resetOnboarding: () => set({ onboardingShown: false }),
    }),
    { name: 'portfolio-boot' }
  )
);
