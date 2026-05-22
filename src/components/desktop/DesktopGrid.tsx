import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors, useDndMonitor } from '@dnd-kit/core';
import { useDesktopStore } from '../../stores/desktopStore';
import { useWindowStore } from '../../stores/windowStore';
import { useTrashStore } from '../../stores/trashStore';
import { useDragStore } from '../../stores/dragStore';
import { apps } from '../../config/apps';
import { DesktopIcon, CELL, GAP } from './DesktopIcon';
import { ContextMenu } from '../shared/ContextMenu';
import type { AppId, DesktopIconPosition } from '../../types';

function findFreeCell(positions: DesktopIconPosition[]): { col: number; row: number } {
  const occupied = new Set(positions.map(p => `${p.col},${p.row}`));
  for (let row = 0; row < 12; row++) {
    for (let col = 9; col >= 0; col--) {
      if (!occupied.has(`${col},${row}`)) return { col, row };
    }
  }
  return { col: 0, row: 0 };
}

function DesktopBgContextMenu({
  x, y, trashedCount, onRestoreAll, onClose,
}: { x: number; y: number; trashedCount: number; onRestoreAll: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  const menuW = 210;
  const menuH = trashedCount > 0 ? 68 : 40;
  const left = Math.min(x, window.innerWidth  - menuW - 8);
  const top  = Math.min(y, window.innerHeight - menuH - 8);

  return createPortal(
    <div
      ref={ref}
      onContextMenu={e => e.preventDefault()}
      style={{
        position: 'fixed', left, top, width: menuW,
        background: 'rgba(245,245,245,0.94)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: 9,
        boxShadow: '0 8px 32px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.12)',
        zIndex: 9999, padding: '4px 0',
        fontFamily: 'var(--font-system)', fontSize: 13, userSelect: 'none',
      }}
    >
      <BgItem label="Clean Up Desktop" onClick={onClose} />
      {trashedCount > 0 && (
        <>
          <div style={{ height: 1, background: 'rgba(0,0,0,0.09)', margin: '3px 0' }} />
          <BgItem
            label={`Restore All Icons (${trashedCount})`}
            onClick={() => { onRestoreAll(); onClose(); }}
          />
        </>
      )}
    </div>,
    document.body
  );
}

function BgItem({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '5px 14px', cursor: 'default', borderRadius: 5, margin: '1px 4px',
        color: hovered ? '#fff' : '#1a1a1a',
        background: hovered ? '#0066ff' : 'transparent',
        transition: 'background 60ms, color 60ms',
      }}
    >
      {label}
    </div>
  );
}

interface MarqueeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface CtxMenu {
  appId: AppId;
  x: number;
  y: number;
}

interface DragTransform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}

interface IconsProps {
  positions: DesktopIconPosition[];
  selectedIds: Set<AppId>;
  selRect: { left: number; top: number; width: number; height: number } | null;
  containerRef: React.RefObject<HTMLDivElement>;
  renamingId: AppId | null;
  onMouseDown: (e: React.MouseEvent) => void;
  onIconContextMenu: (appId: AppId, e: React.MouseEvent) => void;
  onRenameConfirm: (appId: AppId, name: string) => void;
  onRenameCancel: () => void;
  onDesktopContextMenu: (x: number, y: number) => void;
  onIconSelect: (appId: AppId, e: React.MouseEvent) => void;
  onIconOpen: (appId: AppId) => void;
}

function DesktopGridIcons({
  positions, selectedIds, selRect, containerRef, renamingId,
  onMouseDown, onIconContextMenu, onRenameConfirm, onRenameCancel, onDesktopContextMenu,
  onIconSelect, onIconOpen,
}: IconsProps) {
  const [activeDragId, setActiveDragId] = useState<AppId | null>(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });

  useDndMonitor({
    onDragStart(e) { setActiveDragId(e.active.id as AppId); setDragDelta({ x: 0, y: 0 }); },
    onDragMove(e)  { setDragDelta(e.delta); },
    onDragEnd()    { setActiveDragId(null); setDragDelta({ x: 0, y: 0 }); },
    onDragCancel() { setActiveDragId(null); setDragDelta({ x: 0, y: 0 }); },
  });

  const groupDragActive =
    activeDragId !== null && selectedIds.has(activeDragId) && selectedIds.size > 1;

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onContextMenu={e => { e.preventDefault(); onDesktopContextMenu(e.clientX, e.clientY); }}
      style={{
        position: 'absolute',
        inset: 0,
        top: 'var(--menubar-height)',
        bottom: 'calc(var(--dock-height) + 24px)',
      }}
    >
      {positions.map(({ appId, col, row }) => {
        const app = apps.find(a => a.id === appId);
        if (!app) return null;
        const isTheDraggedIcon = activeDragId === appId;
        const groupDragTransform: DragTransform | null =
          groupDragActive && selectedIds.has(appId) && !isTheDraggedIcon
            ? { x: dragDelta.x, y: dragDelta.y, scaleX: 1, scaleY: 1 }
            : null;
        return (
          <DesktopIcon
            key={appId}
            appId={appId}
            name={app.name}
            col={col}
            row={row}
            isSelected={selectedIds.has(appId)}
            isRenaming={renamingId === appId}
            groupDragTransform={groupDragTransform}
            onContextMenu={e => onIconContextMenu(appId, e)}
            onRenameConfirm={name => onRenameConfirm(appId, name)}
            onRenameCancel={onRenameCancel}
            onSelect={e => onIconSelect(appId, e)}
            onOpen={() => onIconOpen(appId)}
          />
        );
      })}

      {selRect && selRect.width > 4 && selRect.height > 4 && (
        <div
          style={{
            position: 'absolute',
            left: selRect.left,
            top: selRect.top,
            width: selRect.width,
            height: selRect.height,
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1.5px solid rgba(255, 255, 255, 0.75)',
            borderRadius: 4,
            pointerEvents: 'none',
            zIndex: 50,
          }}
        />
      )}
    </div>
  );
}

function isOverTrashBin(active: DragEndEvent['active']): boolean {
  const trashEl = document.querySelector('[data-trash-bin]');
  if (!trashEl) return false;
  const translated = active.rect.current.translated;
  if (!translated) return false;
  const trashRect = trashEl.getBoundingClientRect();
  return (
    translated.left < trashRect.right &&
    translated.left + translated.width > trashRect.left &&
    translated.top < trashRect.bottom &&
    translated.top + translated.height > trashRect.top
  );
}

export function DesktopGrid() {
  const positions = useDesktopStore(s => s.positions);
  const moveIcon = useDesktopStore(s => s.moveIcon);
  const moveIcons = useDesktopStore(s => s.moveIcons);
  const renameIcon = useDesktopStore(s => s.renameIcon);
  const removeIcon = useDesktopStore(s => s.removeIcon);
  const openApp = useWindowStore(s => s.openApp);
  const sendToTrash = useTrashStore(s => s.sendToTrash);
  const trashedApps = useTrashStore(s => s.trashedApps);
  const restoreFromTrash = useTrashStore(s => s.restoreFromTrash);
  const restoreIcon = useDesktopStore(s => s.restoreIcon);
  const setDraggingIcon = useDragStore(s => s.setDraggingIcon);

  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<MarqueeState | null>(null);
  const selectedIdsRef = useRef<Set<AppId>>(new Set());
  const [marquee, setMarquee] = useState<MarqueeState | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<AppId>>(new Set());
  const [contextMenu, setContextMenu] = useState<CtxMenu | null>(null);
  const [renamingId, setRenamingId] = useState<AppId | null>(null);
  const [desktopCtxMenu, setDesktopCtxMenu] = useState<{ x: number; y: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragStart = (_event: DragStartEvent) => {
    setDraggingIcon(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggingIcon(false);
    const { active, delta } = event;
    const appId = active.id as AppId;
    const sel = selectedIdsRef.current;

    // Check if dropped onto trash bin
    if (isOverTrashBin(active)) {
      const toTrash = sel.has(appId) && sel.size > 1 ? Array.from(sel) : [appId];
      toTrash.forEach(id => {
        removeIcon(id);
        sendToTrash(id);
      });
      return;
    }

    const deltaCol = Math.round(delta.x / (CELL + GAP));
    const deltaRow = Math.round(delta.y / (CELL + GAP));

    const containerEl = containerRef.current;
    const maxCol = containerEl ? Math.floor((containerEl.offsetWidth  - CELL) / (CELL + GAP)) : 20;
    const maxRow = containerEl ? Math.floor((containerEl.offsetHeight - CELL) / (CELL + GAP)) : 20;

    if (sel.has(appId) && sel.size > 1) {
      const selectedPos = positions.filter(p => sel.has(p.appId));
      const unselectedPos = positions.filter(p => !sel.has(p.appId));

      // Find the most restrictive in-bounds delta across all selected icons so they
      // all move by the same amount and none goes off-screen.
      let adjCol = deltaCol;
      let adjRow = deltaRow;
      for (const p of selectedPos) {
        adjCol = Math.max(adjCol, -p.col);            // left wall
        adjRow = Math.max(adjRow, -p.row);            // top wall
        adjCol = Math.min(adjCol, maxCol - p.col);    // right wall
        adjRow = Math.min(adjRow, maxRow - p.row);    // bottom wall
      }

      const moves = selectedPos.map(p => ({
        appId: p.appId,
        col: p.col + adjCol,
        row: p.row + adjRow,
      }));
      const hasCollision = moves.some(m =>
        unselectedPos.some(u => u.col === m.col && u.row === m.row)
      );
      if (!hasCollision) moveIcons(moves);
    } else {
      const current = positions.find(p => p.appId === appId);
      if (!current) return;
      const newCol = Math.min(maxCol, Math.max(0, current.col + deltaCol));
      const newRow = Math.min(maxRow, Math.max(0, current.row + deltaRow));
      const occupied = positions.some(p => p.appId !== appId && p.col === newCol && p.row === newRow);
      if (!occupied) moveIcon(appId, newCol, newRow);
    }
  };

  const computeSelected = useCallback((m: MarqueeState): Set<AppId> => {
    const selLeft = Math.min(m.startX, m.currentX);
    const selTop = Math.min(m.startY, m.currentY);
    const selRight = Math.max(m.startX, m.currentX);
    const selBottom = Math.max(m.startY, m.currentY);
    const selected = new Set<AppId>();
    positions.forEach(({ appId, col, row }) => {
      const iconLeft = col * (CELL + GAP);
      const iconTop = row * (CELL + GAP);
      if (selLeft < iconLeft + CELL && selRight > iconLeft && selTop < iconTop + CELL && selBottom > iconTop) {
        selected.add(appId);
      }
    });
    return selected;
  }, [positions]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('[data-icon-id]')) return;
    setContextMenu(null);
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const m: MarqueeState = { startX: x, startY: y, currentX: x, currentY: y };
    marqueeRef.current = m;
    setMarquee(m);
    const empty = new Set<AppId>();
    selectedIdsRef.current = empty;
    setSelectedIds(empty);
  };

  const handleIconSelect = (appId: AppId, e: React.MouseEvent) => {
    const next = (e.metaKey || e.ctrlKey)
      ? new Set([...selectedIdsRef.current, appId])
      : new Set<AppId>([appId]);
    selectedIdsRef.current = next;
    setSelectedIds(next);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!marqueeRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const updated: MarqueeState = {
        ...marqueeRef.current,
        currentX: e.clientX - rect.left,
        currentY: e.clientY - rect.top,
      };
      marqueeRef.current = updated;
      setMarquee({ ...updated });
      const next = computeSelected(updated);
      selectedIdsRef.current = next;
      setSelectedIds(next);
    };
    const onMouseUp = () => {
      if (!marqueeRef.current) return;
      marqueeRef.current = null;
      setMarquee(null);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [computeSelected]);

  // Clamp any icons that are stored at positions outside the visible desktop area.
  // Runs once on mount (via rAF so the container has laid out) and on every resize.
  useEffect(() => {
    function clampPositions() {
      const containerEl = containerRef.current;
      if (!containerEl || containerEl.offsetWidth === 0) return;

      const { positions: cur, moveIcons: doMove } = useDesktopStore.getState();
      const maxCol = Math.floor((containerEl.offsetWidth  - CELL) / (CELL + GAP));
      const maxRow = Math.floor((containerEl.offsetHeight - CELL) / (CELL + GAP));

      const outOfBounds = cur.filter(p => p.col > maxCol || p.row > maxRow);
      if (outOfBounds.length === 0) return;

      const occupied = new Set(
        cur
          .filter(p => p.col <= maxCol && p.row <= maxRow)
          .map(p => `${p.col},${p.row}`)
      );

      const moves: { appId: AppId; col: number; row: number }[] = [];
      for (const p of outOfBounds) {
        let col = Math.min(p.col, maxCol);
        let row = Math.min(p.row, maxRow);

        if (occupied.has(`${col},${row}`)) {
          let placed = false;
          outer: for (let r = 0; r <= maxRow; r++) {
            for (let c = maxCol; c >= 0; c--) {
              if (!occupied.has(`${c},${r}`)) {
                col = c; row = r; placed = true;
                break outer;
              }
            }
          }
          if (!placed) continue;
        }

        moves.push({ appId: p.appId, col, row });
        occupied.add(`${col},${row}`);
      }

      if (moves.length > 0) doMove(moves);
    }

    let rafId = requestAnimationFrame(clampPositions);
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(clampPositions);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selRect = marquee ? {
    left: Math.min(marquee.startX, marquee.currentX),
    top: Math.min(marquee.startY, marquee.currentY),
    width: Math.abs(marquee.currentX - marquee.startX),
    height: Math.abs(marquee.currentY - marquee.startY),
  } : null;

  const handleContextMenuRemove = (appId: AppId) => {
    removeIcon(appId);
    sendToTrash(appId);
    setContextMenu(null);
  };

  const handleRestoreAll = () => {
    let current = [...positions];
    trashedApps.forEach(appId => {
      const { col, row } = findFreeCell(current);
      restoreFromTrash(appId);
      restoreIcon(appId, col, row);
      current = [...current, { appId, col, row }];
    });
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <DesktopGridIcons
        positions={positions}
        selectedIds={selectedIds}
        selRect={selRect}
        containerRef={containerRef}
        renamingId={renamingId}
        onMouseDown={handleMouseDown}
        onIconContextMenu={(appId, e) => {
          e.stopPropagation();
          setContextMenu({ appId, x: e.clientX, y: e.clientY });
        }}
        onRenameConfirm={(appId, name) => {
          renameIcon(appId, name);
          setRenamingId(null);
        }}
        onRenameCancel={() => setRenamingId(null)}
        onDesktopContextMenu={(x, y) => setDesktopCtxMenu({ x, y })}
        onIconSelect={handleIconSelect}
        onIconOpen={appId => openApp(appId)}
      />

      {desktopCtxMenu && (
        <DesktopBgContextMenu
          x={desktopCtxMenu.x}
          y={desktopCtxMenu.y}
          trashedCount={trashedApps.length}
          onRestoreAll={handleRestoreAll}
          onClose={() => setDesktopCtxMenu(null)}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onOpen={() => { openApp(contextMenu.appId); setContextMenu(null); }}
          onRename={() => { setRenamingId(contextMenu.appId); setContextMenu(null); }}
          onRemove={() => handleContextMenuRemove(contextMenu.appId)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </DndContext>
  );
}
