import { useEffect, useRef, useState, Fragment, type CSSProperties, type ReactNode } from 'react';
import { useWindowStore } from '../../stores/windowStore';
import { useTrashStore } from '../../stores/trashStore';
import { useDragStore } from '../../stores/dragStore';
import { AppIcon } from '../shared/AppIcon';
import { TrashPanel } from './TrashPanel';
import { apps } from '../../config/apps';
import type { AppId } from '../../types';
import trashEmptyIcon from '../../assets/icons/trash_empty_256x256x32.png';
import trashFullIcon from '../../assets/icons/trash_full_256x256x32.png';

const ICON_BASE = 56;

type DockMenuState = { kind: 'app'; appId: AppId } | { kind: 'trash' };
type PressedDockItem = AppId | 'trash';

interface DockProps {
  launchpadOpen?: boolean;
  onLaunchpadToggle?: () => void;
}

function TrashBinIcon({ hasItems, isOver }: { hasItems: boolean; isOver: boolean }) {
  return (
    <img
      src={hasItems ? trashFullIcon : trashEmptyIcon}
      alt="Trash"
      width={ICON_BASE}
      height={ICON_BASE}
      style={{
        width: ICON_BASE,
        height: ICON_BASE,
        objectFit: 'contain',
        display: 'block',
        pointerEvents: 'none',
        filter: isOver
          ? 'drop-shadow(0 2px 10px rgba(255,80,80,0.6)) brightness(0.85)'
          : 'drop-shadow(0 2px 6px rgba(0,0,0,0.28))',
        transform: isOver ? 'scale(1.08)' : 'none',
        transition: 'transform 0.15s, filter 0.15s',
      }}
      draggable={false}
    />
  );
}

function DockMenuItem({
  children,
  onClick,
  style,
}: {
  children: ReactNode;
  onClick: () => void;
  style: CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      role="menuitem"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        ...style,
        background: hovered ? 'rgba(255,255,255,0.13)' : 'transparent',
        color: hovered ? '#ffffff' : '#eeeaf7',
      }}
    >
      {children}
    </button>
  );
}

function DockMenu({
  label,
  onOptions,
  onOpen,
}: {
  label: string;
  onOptions: () => void;
  onOpen: () => void;
}) {
  const menuStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    bottom: 'calc(100% + 16px)',
    width: 210,
    transform: 'translateX(-50%)',
    padding: '4px 0',
    borderRadius: 8,
    background: 'linear-gradient(145deg, rgba(45,27,94,0.82), rgba(34,18,76,0.78))',
    backdropFilter: 'blur(34px) saturate(1.45)',
    WebkitBackdropFilter: 'blur(34px) saturate(1.45)',
    border: '1px solid rgba(232,221,255,0.28)',
    boxShadow: '0 24px 80px rgba(18,7,44,0.58), inset 0 1px 0 rgba(255,255,255,0.15)',
    color: '#eeeaf7',
    fontFamily: 'var(--font-system)',
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1,
    zIndex: 10000,
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const itemStyle: CSSProperties = {
    minHeight: 24,
    width: 'calc(100% - 8px)',
    margin: '0 4px',
    padding: '3px 8px',
    border: 0,
    borderRadius: 5,
    background: 'transparent',
    color: '#eeeaf7',
    font: 'inherit',
    cursor: 'default',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left',
    userSelect: 'none',
  };

  return (
    <div role="menu" aria-label={label} className="dock-context-menu" style={menuStyle}>
      <DockMenuItem onClick={onOptions} style={itemStyle}>
        <span>Options</span>
        <span style={{ fontSize: 18, lineHeight: 1, opacity: 0.95 }}>&gt;</span>
      </DockMenuItem>
      <DockMenuItem onClick={onOpen} style={itemStyle}>
        Open
      </DockMenuItem>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -11,
          width: 0,
          height: 0,
          transform: 'translateX(-50%)',
          borderLeft: '11px solid transparent',
          borderRight: '11px solid transparent',
          borderTop: '11px solid rgba(34,18,76,0.78)',
          filter: 'drop-shadow(0 1px 0 rgba(232,221,255,0.20))',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export function Dock({ launchpadOpen = false, onLaunchpadToggle }: DockProps) {
  const windows = useWindowStore(s => s.windows);
  const openApp = useWindowStore(s => s.openApp);
  const minimizeWindow = useWindowStore(s => s.minimizeWindow);
  const trashedApps = useTrashStore(s => s.trashedApps);
  const isDraggingIcon = useDragStore(s => s.isDraggingIcon);
  const dockRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const didLongPressRef = useRef(false);
  const launchTimerRefs = useRef<Partial<Record<AppId, number>>>({});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pressedDockItem, setPressedDockItem] = useState<PressedDockItem | null>(null);
  const [launchingAppIds, setLaunchingAppIds] = useState<AppId[]>([]);
  const [dockMenu, setDockMenu] = useState<DockMenuState | null>(null);
  const [trashHovered, setTrashHovered] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);

  const isOpen = (appId: AppId) => windows.some(w => w.appId === appId && !w.minimized);
  const isMinimized = (appId: AppId) => windows.some(w => w.appId === appId && w.minimized);
  const visibleWindowForApp = (appId: AppId) => windows.find(w => w.appId === appId && !w.minimized);

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current === null) return;
    window.clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  };

  const openDockMenu = (appId: AppId, suppressNextClick = true) => {
    didLongPressRef.current = suppressNextClick;
    setPressedDockItem(null);
    setDockMenu({ kind: 'app', appId });
  };

  const openTrashMenu = (suppressNextClick = true) => {
    didLongPressRef.current = suppressNextClick;
    setPressedDockItem(null);
    setDockMenu({ kind: 'trash' });
  };

  const closeDockMenu = () => {
    didLongPressRef.current = false;
    setDockMenu(null);
  };

  const bounceAppIcon = (appId: AppId) => {
    setLaunchingAppIds(ids => (ids.includes(appId) ? ids : [...ids, appId]));

    const existingTimer = launchTimerRefs.current[appId];
    if (existingTimer) window.clearTimeout(existingTimer);

    launchTimerRefs.current[appId] = window.setTimeout(() => {
      setLaunchingAppIds(ids => ids.filter(id => id !== appId));
      delete launchTimerRefs.current[appId];
    }, 650);
  };

  const runDockAction = (appId: AppId) => {
    if (appId === 'launchpad') {
      onLaunchpadToggle?.();
      return;
    }

    const visibleWindow = visibleWindowForApp(appId);
    if (visibleWindow) {
      minimizeWindow(visibleWindow.id);
      return;
    }

    const appConfig = apps.find(app => app.id === appId);
    if (!appConfig?.mailto && !isMinimized(appId)) {
      bounceAppIcon(appId);
    }

    openApp(appId);
  };

  useEffect(() => {
    const closeDockMenuOnOutsideClick = (event: MouseEvent) => {
      if (dockRef.current?.contains(event.target as Node)) return;
      closeDockMenu();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDockMenu();
    };

    document.addEventListener('mousedown', closeDockMenuOnOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      clearLongPressTimer();
      Object.values(launchTimerRefs.current).forEach(timer => {
        if (timer) window.clearTimeout(timer);
      });
      document.removeEventListener('mousedown', closeDockMenuOnOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <Fragment>
      <div
        style={{
          position: 'fixed',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: launchpadOpen ? 9600 : 8000,
        }}
      >
        <div
          ref={dockRef}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            padding: '10px 14px',
            background: 'var(--color-dock-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: 20,
            boxShadow: 'var(--shadow-dock)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
        >
          {[...apps]
            .sort((a, b) => a.dockOrder - b.dockOrder)
            .map((app, i) => {
              const open = isOpen(app.id);
              const minimized = isMinimized(app.id);
              const isHovered = hoveredIndex === i;
              const isPressed = pressedDockItem === app.id;
              const isLaunching = launchingAppIds.includes(app.id);
              const menuOpen = dockMenu?.kind === 'app' && dockMenu.appId === app.id;

              return (
                <div
                  key={app.id}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    cursor: 'pointer',
                    transition: 'none',
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {menuOpen && (
                    <DockMenu
                      label={`${app.name} Dock menu`}
                      onOptions={closeDockMenu}
                      onOpen={() => {
                        closeDockMenu();
                        if (app.id === 'launchpad') {
                          onLaunchpadToggle?.();
                          return;
                        }
                        openApp(app.id);
                      }}
                    />
                  )}

                  {/* App name tooltip */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 10px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(28,28,28,0.88)',
                      color: 'rgba(255,255,255,0.95)',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      fontWeight: 500,
                      letterSpacing: 0.1,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      opacity: isHovered && !menuOpen ? 1 : 0,
                      transition: 'opacity 0.12s ease',
                      zIndex: 9999,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    {app.name}
                  </div>

                  <div
                    data-dock-index={i}
                    onPointerDown={(e) => {
                      if (e.button !== 0) return;
                      didLongPressRef.current = false;
                      setPressedDockItem(app.id);
                      clearLongPressTimer();
                      longPressTimerRef.current = window.setTimeout(() => openDockMenu(app.id), 1000);
                    }}
                    onPointerUp={(e) => {
                      if (e.button !== 0) return;
                      clearLongPressTimer();
                      setPressedDockItem(null);

                      if (didLongPressRef.current) {
                        didLongPressRef.current = false;
                        return;
                      }

                      closeDockMenu();
                      runDockAction(app.id);
                    }}
                    onPointerCancel={() => {
                      clearLongPressTimer();
                      setPressedDockItem(null);
                    }}
                    onPointerLeave={() => {
                      clearLongPressTimer();
                      setPressedDockItem(null);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      clearLongPressTimer();
                      setPressedDockItem(null);
                      openDockMenu(app.id, false);
                    }}
                    title={app.name}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${app.name}`}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter' && e.key !== ' ') return;
                      e.preventDefault();
                      if (app.id === 'launchpad') {
                        onLaunchpadToggle?.();
                        return;
                      }
                      closeDockMenu();
                      runDockAction(app.id);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transform: app.id === 'launchpad' && launchpadOpen ? 'translateY(-2px)' : 'none',
                      filter: isPressed
                        ? 'brightness(0.58) saturate(0.95)'
                        : app.id === 'launchpad' && launchpadOpen
                          ? 'brightness(1.12)'
                          : 'none',
                      animation: isLaunching ? 'dock-bounce 0.65s ease' : 'none',
                      transition: 'transform 0.16s ease, filter 0.16s ease',
                    }}
                  >
                    <AppIcon appId={app.id} size={ICON_BASE} />
                  </div>

                  {/* Open/minimized dot indicator */}
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: '#ffffff',
                      opacity: (open || minimized) && !isLaunching ? 0.7 : 0,
                      transition: 'opacity 0.2s',
                    }}
                  />
                </div>
              );
            })}

          {/* Separator */}
          <div
            style={{
              width: 1,
              height: 40,
              background: 'rgba(255,255,255,0.22)',
              margin: '0 4px',
              alignSelf: 'center',
              flexShrink: 0,
            }}
          />

          {/* Trash bin */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              cursor: 'pointer',
            }}
            onMouseEnter={() => setTrashHovered(true)}
            onMouseLeave={() => setTrashHovered(false)}
          >
            {dockMenu?.kind === 'trash' && (
              <DockMenu
                label="Trash Dock menu"
                onOptions={closeDockMenu}
                onOpen={() => {
                  closeDockMenu();
                  setTrashOpen(true);
                }}
              />
            )}

            {/* Trash tooltip */}
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 10px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(28,28,28,0.88)',
                color: 'rgba(255,255,255,0.95)',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                fontWeight: 500,
                letterSpacing: 0.1,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                opacity: trashHovered ? 1 : 0,
                transition: 'opacity 0.12s ease',
                zIndex: 9999,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              Trash{trashedApps.length > 0 ? ` (${trashedApps.length})` : ''}
            </div>

            <div
              data-trash-bin
              role="button"
              tabIndex={0}
              aria-label="Open Trash"
              title="Trash"
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                didLongPressRef.current = false;
                setPressedDockItem('trash');
                clearLongPressTimer();
                longPressTimerRef.current = window.setTimeout(() => openTrashMenu(), 1000);
              }}
              onPointerUp={(e) => {
                if (e.button !== 0) return;
                clearLongPressTimer();
                setPressedDockItem(null);

                if (didLongPressRef.current) {
                  didLongPressRef.current = false;
                  return;
                }

                closeDockMenu();
                setTrashOpen(v => !v);
              }}
              onPointerCancel={() => {
                clearLongPressTimer();
                setPressedDockItem(null);
              }}
              onPointerLeave={() => {
                clearLongPressTimer();
                setPressedDockItem(null);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                clearLongPressTimer();
                setPressedDockItem(null);
                openTrashMenu(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                e.preventDefault();
                closeDockMenu();
                setTrashOpen(v => !v);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '24%',
                outline: isDraggingIcon ? '2px solid rgba(255,100,100,0.7)' : '2px solid transparent',
                filter: pressedDockItem === 'trash' ? 'brightness(0.58) saturate(0.95)' : 'none',
                transition: 'outline-color 0.15s',
              }}
            >
              <TrashBinIcon hasItems={trashedApps.length > 0} isOver={isDraggingIcon} />
            </div>

            {/* Dot when trash has items */}
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#ffffff',
                opacity: trashedApps.length > 0 ? 0.7 : 0,
                transition: 'opacity 0.2s',
              }}
            />
          </div>
        </div>
      </div>

      {trashOpen && <TrashPanel onClose={() => setTrashOpen(false)} />}
    </Fragment>
  );
}
