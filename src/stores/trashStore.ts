import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppId } from '../types';

const VALID_IDS = new Set<string>(['about', 'projects', 'contact', 'resume', 'settings', 'finder', 'launchpad', 'mail']);

interface TrashStore {
  trashedApps: AppId[];
  sendToTrash: (appId: AppId) => void;
  restoreFromTrash: (appId: AppId) => void;
}

export const useTrashStore = create<TrashStore>()(
  persist(
    (set) => ({
      trashedApps: [],
      sendToTrash: (appId) =>
        set(s => ({
          trashedApps: s.trashedApps.includes(appId)
            ? s.trashedApps
            : [...s.trashedApps, appId],
        })),
      restoreFromTrash: (appId) =>
        set(s => ({ trashedApps: s.trashedApps.filter(id => id !== appId) })),
    }),
    {
      name: 'portfolio-trash',
      version: 1,
      migrate: (persisted: unknown) => {
        const s = persisted as { trashedApps?: unknown[] };
        return {
          trashedApps: ((s.trashedApps ?? []) as AppId[]).filter(id => VALID_IDS.has(id)),
        };
      },
    }
  )
);
