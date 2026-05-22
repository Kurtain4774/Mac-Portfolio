import React from 'react';
import { MenuItem, MenuSeparator } from '../components/menubar/MenuBarMenu';
import { apps } from './apps';
import type { AppId, WindowState } from '../types';

export interface MenuContext {
  appId: AppId | null;
  windows: WindowState[];
  focusedWindowId: string | null;
  isMaximized: boolean;
  isDark: boolean;
  openApp: (id: AppId) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleDark: () => void;
  openSiri: () => void;
  showOnboarding: () => void;
  closeMenu: () => void;
}

export interface MenuDef {
  id: string;
  label: string;
  content: React.ReactNode;
}

// ─── Shared menu builders ────────────────────────────────────────────────────

function buildAppMenu(ctx: MenuContext): MenuDef {
  const { appId, openApp, closeWindow, minimizeWindow, focusedWindowId, closeMenu } = ctx;
  if (!appId) {
    return {
      id: 'appname',
      label: 'Finder',
      content: (
        <>
          <MenuItem label="About This Portfolio" onClick={() => { openApp('about'); closeMenu(); }} />
          <MenuSeparator />
          <MenuItem label="Preferences…" shortcut="⌘," onClick={() => { openApp('settings'); closeMenu(); }} />
        </>
      ),
    };
  }
  const name = apps.find(a => a.id === appId)?.name ?? appId;
  return {
    id: 'appname',
    label: name,
    content: (
      <>
        <MenuItem label={`About ${name}`} onClick={() => { openApp(appId); closeMenu(); }} />
        <MenuSeparator />
        <MenuItem
          label={`Hide ${name}`}
          shortcut="⌘H"
          onClick={() => { if (focusedWindowId) { minimizeWindow(focusedWindowId); closeMenu(); } }}
          disabled={!focusedWindowId}
        />
        <MenuItem
          label={`Quit ${name}`}
          shortcut="⌘Q"
          onClick={() => { if (focusedWindowId) { closeWindow(focusedWindowId); closeMenu(); } }}
          disabled={!focusedWindowId}
          destructive
        />
      </>
    ),
  };
}

function buildFileMenu(ctx: MenuContext): MenuDef {
  const { appId, closeMenu } = ctx;
  if (appId === 'resume') {
    return {
      id: 'file',
      label: 'File',
      content: (
        <>
          <MenuItem
            label="Download Resume"
            shortcut="⌘S"
            onClick={() => {
              const a = document.createElement('a');
              a.href = '/MacPortfolio/resume.pdf';
              a.download = 'Kurtis_Quant_Resume.pdf';
              a.click();
              closeMenu();
            }}
          />
          <MenuItem label="Print…" shortcut="⌘P" onClick={() => { window.print(); closeMenu(); }} />
        </>
      ),
    };
  }
  // Finder file menu
  return {
    id: 'file',
    label: 'File',
    content: (
      <>
        <MenuItem label="New Finder Window" shortcut="⌘N" disabled />
        <MenuSeparator />
        <MenuItem label="Close Window" shortcut="⌘W" disabled />
      </>
    ),
  };
}

function buildEditMenu(ctx: MenuContext): MenuDef {
  const { appId } = ctx;
  const active = appId === 'contact';
  return {
    id: 'edit',
    label: 'Edit',
    content: (
      <>
        <MenuItem label="Undo" shortcut="⌘Z" disabled={!active} onClick={active ? () => document.execCommand('undo') : undefined} />
        <MenuItem label="Redo" shortcut="⇧⌘Z" disabled={!active} onClick={active ? () => document.execCommand('redo') : undefined} />
        <MenuSeparator />
        <MenuItem label="Cut" shortcut="⌘X" disabled={!active} />
        <MenuItem label="Copy" shortcut="⌘C" disabled={!active} />
        <MenuItem label="Paste" shortcut="⌘V" disabled={!active} />
        <MenuItem label="Select All" shortcut="⌘A" disabled={!active} />
      </>
    ),
  };
}

function buildViewMenu(ctx: MenuContext): MenuDef {
  const { focusedWindowId, isMaximized, maximizeWindow, toggleDark, isDark, closeMenu, appId } = ctx;
  return {
    id: 'view',
    label: 'View',
    content: (
      <>
        <MenuItem
          label={isMaximized ? 'Exit Full Screen' : 'Enter Full Screen'}
          shortcut="⌃⌘F"
          onClick={() => { if (focusedWindowId) { maximizeWindow(focusedWindowId); closeMenu(); } }}
          disabled={!focusedWindowId}
        />
        <MenuSeparator />
        <MenuItem label="Light Mode" checked={!isDark} onClick={() => { if (isDark) { toggleDark(); closeMenu(); } else closeMenu(); }} />
        <MenuItem label="Dark Mode" checked={isDark} onClick={() => { if (!isDark) { toggleDark(); closeMenu(); } else closeMenu(); }} />
        {appId === null && (
          <>
            <MenuSeparator />
            <MenuItem label="Clean Up Desktop" onClick={closeMenu} />
          </>
        )}
      </>
    ),
  };
}

function buildGoMenu(ctx: MenuContext): MenuDef {
  const { openApp, closeMenu } = ctx;
  return {
    id: 'go',
    label: 'Go',
    content: (
      <>
        {apps.map(app => (
          <MenuItem
            key={app.id}
            label={app.name}
            onClick={() => { openApp(app.id); closeMenu(); }}
          />
        ))}
      </>
    ),
  };
}

function buildWindowMenu(ctx: MenuContext): MenuDef {
  const { windows, focusedWindowId, minimizeWindow, maximizeWindow, closeWindow, focusWindow, closeMenu } = ctx;
  const openWindows = windows.filter(w => !w.minimized);
  return {
    id: 'window',
    label: 'Window',
    content: (
      <>
        <MenuItem
          label="Minimize"
          shortcut="⌘M"
          onClick={() => { if (focusedWindowId) { minimizeWindow(focusedWindowId); closeMenu(); } }}
          disabled={!focusedWindowId}
        />
        <MenuItem
          label="Zoom"
          onClick={() => { if (focusedWindowId) { maximizeWindow(focusedWindowId); closeMenu(); } }}
          disabled={!focusedWindowId}
        />
        {openWindows.length > 0 && (
          <>
            <MenuSeparator />
            {openWindows.map(w => {
              const appName = apps.find(a => a.id === w.appId)?.name ?? w.appId;
              return (
                <MenuItem
                  key={w.id}
                  label={appName}
                  checked={w.id === focusedWindowId}
                  onClick={() => { focusWindow(w.id); closeMenu(); }}
                />
              );
            })}
          </>
        )}
        <MenuSeparator />
        <MenuItem
          label="Close"
          shortcut="⌘W"
          onClick={() => { if (focusedWindowId) { closeWindow(focusedWindowId); closeMenu(); } }}
          disabled={!focusedWindowId}
          destructive
        />
      </>
    ),
  };
}

function buildHelpMenu(ctx: MenuContext): MenuDef {
  const { appId, openSiri, showOnboarding, closeMenu } = ctx;
  const appName = appId
    ? (apps.find(a => a.id === appId)?.name ?? appId)
    : 'Portfolio';
  return {
    id: 'help',
    label: 'Help',
    content: (
      <>
        <MenuItem
          label={`${appName} Help`}
          onClick={() => { openSiri(); closeMenu(); }}
        />
        <MenuSeparator />
        <MenuItem
          label="Portfolio Tour"
          onClick={() => { showOnboarding(); closeMenu(); }}
        />
      </>
    ),
  };
}

// ─── Per-app menu sets ───────────────────────────────────────────────────────

export function getMenusForApp(ctx: MenuContext): MenuDef[] {
  const { appId } = ctx;

  const appMenu = buildAppMenu(ctx);
  const editMenu = buildEditMenu(ctx);
  const viewMenu = buildViewMenu(ctx);
  const goMenu = buildGoMenu(ctx);
  const windowMenu = buildWindowMenu(ctx);
  const helpMenu = buildHelpMenu(ctx);

  if (!appId) {
    // Finder (no window focused)
    const fileMenu = buildFileMenu(ctx);
    return [appMenu, fileMenu, editMenu, viewMenu, goMenu, windowMenu, helpMenu];
  }

  if (appId === 'resume') {
    const fileMenu = buildFileMenu(ctx);
    return [appMenu, fileMenu, viewMenu, goMenu, windowMenu, helpMenu];
  }

  // All other apps: no File menu
  return [appMenu, editMenu, viewMenu, goMenu, windowMenu, helpMenu];
}
