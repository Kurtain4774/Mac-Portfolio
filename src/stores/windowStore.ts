import { create } from 'zustand';
import type { AppId, WindowState } from '../types';
import { appMap } from '../config/apps';

let nextZIndex = 10;

function defaultGeometry(appId?: AppId) {
  const widthRatio = appId === 'finder' ? 0.76 : 0.65;
  const heightRatio = appId === 'finder' ? 0.68 : 0.65;
  const w = Math.round(window.innerWidth * widthRatio);
  const h = Math.round(window.innerHeight * heightRatio);
  const x = Math.round((window.innerWidth - w) / 2);
  const y = Math.round((window.innerHeight - h) / 2);
  return { x, y, width: w, height: h };
}

interface WindowStore {
  windows: WindowState[];
  focusedWindowId: string | null;
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updateGeometry: (id: string, x: number, y: number, width: number, height: number) => void;
  arrangeWindows: () => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  focusedWindowId: null,

  openApp: (appId) => {
    const config = appMap[appId];
    if (config?.mailto) {
      window.location.href = `mailto:${config.mailto}`;
      return;
    }
    const existing = get().windows.find(w => w.appId === appId);
    if (existing) {
      if (existing.minimized) {
        set(s => ({
          windows: s.windows.map(w =>
            w.id === existing.id ? { ...w, minimized: false, zIndex: ++nextZIndex } : w
          ),
          focusedWindowId: existing.id,
        }));
      } else {
        get().focusWindow(existing.id);
      }
      return;
    }
    const id = `${appId}-${Date.now()}`;
    const geo = defaultGeometry(appId);
    set(s => ({
      windows: [
        ...s.windows,
        { id, appId, ...geo, zIndex: ++nextZIndex, minimized: false, maximized: false },
      ],
      focusedWindowId: id,
    }));
  },

  closeWindow: (id) => {
    set(s => {
      const remaining = s.windows.filter(w => w.id !== id);
      const top = remaining.reduce<WindowState | null>(
        (acc, w) => (!acc || w.zIndex > acc.zIndex ? w : acc),
        null
      );
      return { windows: remaining, focusedWindowId: top?.id ?? null };
    });
  },

  focusWindow: (id) => {
    set(s => ({
      windows: s.windows.map(w => (w.id === id ? { ...w, zIndex: ++nextZIndex } : w)),
      focusedWindowId: id,
    }));
  },

  minimizeWindow: (id) => {
    set(s => ({
      windows: s.windows.map(w => (w.id === id ? { ...w, minimized: true } : w)),
      focusedWindowId: s.focusedWindowId === id ? null : s.focusedWindowId,
    }));
  },

  maximizeWindow: (id) => {
    set(s => ({
      windows: s.windows.map(w => {
        if (w.id !== id) return w;
        if (w.maximized) {
          const prev = w.prevGeometry ?? defaultGeometry();
          return { ...w, ...prev, maximized: false, prevGeometry: undefined };
        }
        const maxW = Math.round(window.innerWidth * 0.95);
        const maxH = Math.round(window.innerHeight * 0.90);
        const maxX = Math.round((window.innerWidth - maxW) / 2);
        return {
          ...w,
          maximized: true,
          prevGeometry: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: maxX,
          y: 32,
          width: maxW,
          height: maxH,
        };
      }),
    }));
  },

  updateGeometry: (id, x, y, width, height) => {
    set(s => ({
      windows: s.windows.map(w => (w.id === id ? { ...w, x, y, width, height } : w)),
    }));
  },

  arrangeWindows: () => {
    set(s => {
      const visible = s.windows.filter(w => !w.minimized);
      const w = Math.round(window.innerWidth * 0.55);
      const h = Math.round(window.innerHeight * 0.60);
      let zi = nextZIndex;
      const arranged = visible.map((win, i) => ({
        ...win,
        x: 60 + i * 30,
        y: 40 + i * 30,
        width: w,
        height: h,
        maximized: false,
        prevGeometry: undefined,
        zIndex: ++zi,
      }));
      nextZIndex = zi;
      return {
        windows: s.windows.map(win => arranged.find(a => a.id === win.id) ?? win),
      };
    });
  },
}));
