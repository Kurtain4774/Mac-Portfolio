import { useState, useEffect } from 'react';
import { MenuBarMenu } from './MenuBarMenu';
import { AppleMenu } from './AppleMenu';
import { useWindowStore } from '../../stores/windowStore';
import { useThemeStore } from '../../stores/themeStore';
import { useSystemStore } from '../../stores/systemStore';
import { getMenusForApp, type MenuContext } from '../../config/menus';

interface LeftMenusProps {
  openSiri: () => void;
  showOnboarding: () => void;
}

export function LeftMenus({ openSiri, showOnboarding }: LeftMenusProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const focusedWindowId = useWindowStore(s => s.focusedWindowId);
  const windows = useWindowStore(s => s.windows);
  const openApp = useWindowStore(s => s.openApp);
  const closeWindow = useWindowStore(s => s.closeWindow);
  const minimizeWindow = useWindowStore(s => s.minimizeWindow);
  const maximizeWindow = useWindowStore(s => s.maximizeWindow);
  const focusWindow = useWindowStore(s => s.focusWindow);
  const isDark = useThemeStore(s => s.isDark);
  const toggleDark = useThemeStore(s => s.toggleDark);
  const setAnyOverlayOpen = useSystemStore(s => s.setAnyOverlayOpen);

  useEffect(() => {
    setAnyOverlayOpen(openMenuId !== null);
    return () => setAnyOverlayOpen(false);
  }, [openMenuId, setAnyOverlayOpen]);

  const focused = windows.find(w => w.id === focusedWindowId);
  const appId = focused?.appId ?? null;

  const ctx: MenuContext = {
    appId,
    windows,
    focusedWindowId,
    isMaximized: focused?.maximized ?? false,
    isDark,
    openApp,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    toggleDark,
    openSiri,
    showOnboarding,
    closeMenu: () => setOpenMenuId(null),
  };

  const menus = getMenusForApp(ctx);

  const mkOpenChange = (id: string) => (v: boolean) => setOpenMenuId(v ? id : null);
  const mkHover = (id: string) => () => { if (openMenuId !== null) setOpenMenuId(id); };

  return (
    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
      <AppleMenu
        open={openMenuId === 'apple'}
        onOpenChange={(v) => setOpenMenuId(v ? 'apple' : null)}
        onTriggerHover={mkHover('apple')}
      />
      {menus.map(menu => (
        <MenuBarMenu
          key={menu.id}
          open={openMenuId === menu.id}
          onOpenChange={mkOpenChange(menu.id)}
          onTriggerHover={mkHover(menu.id)}
          label={menu.label}
          bold={menu.id === 'appname'}
          minWidth={menu.id === 'window' ? 220 : 200}
        >
          {menu.content}
        </MenuBarMenu>
      ))}
    </div>
  );
}
