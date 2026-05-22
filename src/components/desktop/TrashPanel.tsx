import { useEffect, useRef } from 'react';
import { useTrashStore } from '../../stores/trashStore';
import { useDesktopStore } from '../../stores/desktopStore';
import { AppIcon } from '../shared/AppIcon';
import { apps } from '../../config/apps';
import type { AppId, DesktopIconPosition } from '../../types';

function findFreePosition(positions: DesktopIconPosition[]): { col: number; row: number } {
  const occupied = new Set(positions.map(p => `${p.col},${p.row}`));
  for (let row = 0; row < 10; row++) {
    for (let col = 9; col >= 0; col--) {
      if (!occupied.has(`${col},${row}`)) return { col, row };
    }
  }
  return { col: 0, row: 0 };
}

interface Props {
  onClose: () => void;
}

export function TrashPanel({ onClose }: Props) {
  const trashedApps = useTrashStore(s => s.trashedApps);
  const restoreFromTrash = useTrashStore(s => s.restoreFromTrash);
  const positions = useDesktopStore(s => s.positions);
  const restoreIcon = useDesktopStore(s => s.restoreIcon);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const trashEl = document.querySelector('[data-trash-bin]');
        if (trashEl && trashEl.contains(e.target as Node)) return;
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleRestore = (appId: AppId) => {
    const { col, row } = findFreePosition(positions);
    restoreFromTrash(appId);
    restoreIcon(appId, col, row);
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        bottom: 90,
        right: 20,
        width: 268,
        background: 'rgba(24,24,24,0.90)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
        zIndex: 8500,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '11px 16px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            color: 'rgba(255,255,255,0.92)',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            letterSpacing: 0.1,
          }}
        >
          Trash
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 6,
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            padding: '3px 10px',
            fontSize: 11,
            fontWeight: 500,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          Done
        </button>
      </div>

      {/* Content */}
      {trashedApps.length === 0 ? (
        <div
          style={{
            padding: '28px 16px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.35)',
            fontSize: 13,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          Trash is empty
        </div>
      ) : (
        <div style={{ maxHeight: 340, overflowY: 'auto', padding: '6px 0' }}>
          {trashedApps.map(appId => {
            const app = apps.find(a => a.id === appId);
            if (!app) return null;
            return (
              <TrashRow
                key={appId}
                appId={appId}
                appName={app.name}
                onRestore={() => handleRestore(appId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function TrashRow({
  appId,
  appName,
  onRestore,
}: {
  appId: AppId;
  appName: string;
  onRestore: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => {
        if (rowRef.current) rowRef.current.style.background = 'rgba(255,255,255,0.07)';
      }}
      onMouseLeave={() => {
        if (rowRef.current) rowRef.current.style.background = 'transparent';
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px',
        transition: 'background 0.1s',
      }}
    >
      <AppIcon appId={appId} size={36} />
      <span
        style={{
          flex: 1,
          color: 'rgba(255,255,255,0.88)',
          fontSize: 13,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {appName}
      </span>
      <button
        onClick={onRestore}
        style={{
          background: 'rgba(255,255,255,0.11)',
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: 7,
          color: 'rgba(255,255,255,0.85)',
          fontSize: 11,
          fontWeight: 500,
          padding: '4px 11px',
          cursor: 'pointer',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Restore
      </button>
    </div>
  );
}
