export type AppId = 'about' | 'projects' | 'contact' | 'resume' | 'settings' | 'finder' | 'launchpad' | 'mail';

export interface WindowState {
  id: string;
  appId: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prevGeometry?: { x: number; y: number; width: number; height: number };
}

export interface DesktopIconPosition {
  appId: AppId;
  col: number;
  row: number;
}

export type Wallpaper = 'dynamic' | 'sequoia' | 'dark-gradient' | 'minimal-light' | 'aurora';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
