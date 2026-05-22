import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AirDropMode = 'off' | 'contacts' | 'everyone';
export type PowerState = 'on' | 'sleeping' | 'locked' | 'off';

interface SystemStore {
  wifi: boolean;
  bluetooth: boolean;
  airdropMode: AirDropMode;
  focus: boolean;
  stageManager: boolean;
  screenMirroring: boolean;
  brightness: number;
  volume: number;
  powerState: PowerState;
  anyOverlayOpen: boolean;

  setWifi: (v: boolean) => void;
  setBluetooth: (v: boolean) => void;
  cycleAirdrop: () => void;
  toggleFocus: () => void;
  toggleStageManager: () => void;
  toggleScreenMirroring: () => void;
  setBrightness: (v: number) => void;
  setVolume: (v: number) => void;
  setPowerState: (v: PowerState) => void;
  setAnyOverlayOpen: (v: boolean) => void;
}

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      wifi: true,
      bluetooth: true,
      airdropMode: 'everyone',
      focus: false,
      stageManager: false,
      screenMirroring: false,
      brightness: 100,
      volume: 75,
      powerState: 'on',
      anyOverlayOpen: false,

      setWifi: (v) => set({ wifi: v }),
      setBluetooth: (v) => set({ bluetooth: v }),
      cycleAirdrop: () =>
        set(s => ({
          airdropMode:
            s.airdropMode === 'off'
              ? 'contacts'
              : s.airdropMode === 'contacts'
              ? 'everyone'
              : 'off',
        })),
      toggleFocus: () => set(s => ({ focus: !s.focus })),
      toggleStageManager: () => set(s => ({ stageManager: !s.stageManager })),
      toggleScreenMirroring: () => set(s => ({ screenMirroring: !s.screenMirroring })),
      setBrightness: (v) => set({ brightness: v }),
      setVolume: (v) => set({ volume: v }),
      setPowerState: (v) => set({ powerState: v }),
      setAnyOverlayOpen: (v) => set({ anyOverlayOpen: v }),
    }),
    {
      name: 'portfolio-system',
      partialize: (state) => ({
        wifi: state.wifi,
        bluetooth: state.bluetooth,
        airdropMode: state.airdropMode,
        focus: state.focus,
        stageManager: state.stageManager,
        screenMirroring: state.screenMirroring,
        brightness: state.brightness,
        volume: state.volume,
      }),
    }
  )
);
