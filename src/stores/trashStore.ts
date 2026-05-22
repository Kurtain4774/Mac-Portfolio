import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppId } from '../types';

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
    { name: 'portfolio-trash' }
  )
);
