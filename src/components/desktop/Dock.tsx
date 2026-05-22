import { useRef, useState, Fragment } from 'react';
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

export function Dock() {
  const windows = useWindowStore(s => s.windows);
  const openApp = useWindowStore(s => s.openApp);
  const trashedApps = useTrashStore(s => s.trashedApps);
  const isDraggingIcon = useDragStore(s => s.isDraggingIcon);
  const dockRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [trashHovered, setTrashHovered] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);

  const isOpen = (appId: AppId) => windows.some(w => w.appId === appId && !w.minimized);
  const isMinimized = (appId: AppId) => windows.some(w => w.appId === appId && w.minimized);

  return (
    <Fragment>
      <div
        style={{
          position: 'fixed',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 8000,
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
          {apps
            .sort((a, b) => a.dockOrder - b.dockOrder)
            .map((app, i) => {
              const open = isOpen(app.id);
              const minimized = isMinimized(app.id);
              const isHovered = hoveredIndex === i;

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
                      opacity: isHovered ? 1 : 0,
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
                    onClick={() => openApp(app.id)}
                    title={app.name}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${app.name}`}
                    onKeyDown={(e) => e.key === 'Enter' && openApp(app.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
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
                      opacity: open || minimized ? 0.7 : 0,
                      transition: 'opacity 0.2s',
                      animation: minimized ? 'dock-bounce 0.6s ease infinite' : 'none',
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
            onClick={() => setTrashOpen(v => !v)}
          >
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '24%',
                outline: isDraggingIcon ? '2px solid rgba(255,100,100,0.7)' : '2px solid transparent',
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
