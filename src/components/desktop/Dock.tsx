import { useRef, useState, Fragment } from 'react';
import { useWindowStore } from '../../stores/windowStore';
import { useTrashStore } from '../../stores/trashStore';
import { useDragStore } from '../../stores/dragStore';
import { AppIcon } from '../shared/AppIcon';
import { TrashPanel } from './TrashPanel';
import { apps } from '../../config/apps';
import type { AppId } from '../../types';

const ICON_BASE = 56;

function TrashBinIcon({ hasItems, isOver }: { hasItems: boolean; isOver: boolean }) {
  const lidColor = isOver ? 'rgba(255,200,200,0.95)' : 'rgba(230,230,230,0.92)';
  const bodyColor = isOver ? 'rgba(255,180,180,0.9)' : 'rgba(210,210,210,0.85)';
  const lineColor = isOver ? 'rgba(160,40,40,0.55)' : 'rgba(80,80,80,0.35)';

  return (
    <div
      style={{
        width: ICON_BASE,
        height: ICON_BASE,
        borderRadius: '22%',
        background: isOver
          ? 'linear-gradient(160deg, #ff6b6b 0%, #c0392b 100%)'
          : hasItems
            ? 'linear-gradient(160deg, #636e72 0%, #2d3436 100%)'
            : 'linear-gradient(160deg, #74b9ff 0%, #0984e3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isOver
          ? '0 2px 12px rgba(255,80,80,0.55), inset 0 1px 0 rgba(255,255,255,0.25)'
          : '0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
        transition: 'background 0.15s, box-shadow 0.15s',
      }}
    >
      <svg width="32" height="34" viewBox="0 0 32 34" fill="none">
        {/* Handle */}
        <rect x="12" y="1" width="8" height="3" rx="1.5" fill={lidColor} />
        {/* Lid */}
        <rect x="4" y="5" width="24" height="4" rx="2" fill={lidColor} />
        {/* Body */}
        <path
          d="M6 11 L7.5 30 C7.7 31.2 8.7 32 9.9 32 L22.1 32 C23.3 32 24.3 31.2 24.5 30 L26 11 Z"
          fill={bodyColor}
        />
        {hasItems && (
          <>
            <line x1="12" y1="15" x2="11.5" y2="28" stroke={lineColor} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="16" y1="15" x2="16" y2="28" stroke={lineColor} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="20" y1="15" x2="20.5" y2="28" stroke={lineColor} strokeWidth="1.8" strokeLinecap="round" />
          </>
        )}
      </svg>
      {/* Glass shimmer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />
    </div>
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
                      background: 'var(--color-text-primary)',
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
                background: 'var(--color-text-primary)',
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
