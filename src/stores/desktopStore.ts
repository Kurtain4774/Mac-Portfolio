import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppId, DesktopIconPosition } from '../types';

const APP_IDS: AppId[] = ['about', 'experience', 'projects', 'contact', 'resume', 'settings'];

function defaultPositions(): DesktopIconPosition[] {
  // macOS convention: icons start at top-right of desktop
  // col 8 ≈ 848px from left on a 1280px screen with 90px cells + 16px gap
  return APP_IDS.map((appId, i) => ({
    appId,
    col: 8 + (i % 2),
    row: Math.floor(i / 2),
  }));
}

interface DesktopStore {
  positions: DesktopIconPosition[];
  names: Partial<Record<AppId, string>>;
  moveIcon: (appId: AppId, col: number, row: number) => void;
  moveIcons: (moves: { appId: AppId; col: number; row: number }[]) => void;
  renameIcon: (appId: AppId, name: string) => void;
  removeIcon: (appId: AppId) => void;
  restoreIcon: (appId: AppId, col: number, row: number) => void;
}

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set) => ({
      positions: defaultPositions(),
      names: {},
      moveIcon: (appId, col, row) =>
        set(s => ({
          positions: s.positions.map(p => (p.appId === appId ? { ...p, col, row } : p)),
        })),
      moveIcons: (moves) =>
        set(s => ({
          positions: s.positions.map(p => {
            const m = moves.find(mv => mv.appId === p.appId);
            return m ? { ...p, col: m.col, row: m.row } : p;
          }),
        })),
      renameIcon: (appId, name) =>
        set(s => ({ names: { ...s.names, [appId]: name.trim() || s.names[appId] } })),
      removeIcon: (appId) =>
        set(s => ({ positions: s.positions.filter(p => p.appId !== appId) })),
      restoreIcon: (appId, col, row) =>
        set(s => ({
          positions: [
            ...s.positions.filter(p => p.appId !== appId),
            { appId, col, row },
          ],
        })),
    }),
    { name: 'portfolio-iconPositions' }
  )
);
