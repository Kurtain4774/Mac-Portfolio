import { useState, useRef, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors, useDndMonitor } from '@dnd-kit/core';
import { useDesktopStore } from '../../stores/desktopStore';
import { useWindowStore } from '../../stores/windowStore';
import { useTrashStore } from '../../stores/trashStore';
import { useDragStore } from '../../stores/dragStore';
import { apps } from '../../config/apps';
import { DesktopIcon, CELL, GAP } from './DesktopIcon';
import { ContextMenu } from '../shared/ContextMenu';
import type { AppId, DesktopIconPosition } from '../../types';

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
}

function DesktopGridIcons({
  positions, selectedIds, selRect, containerRef, renamingId,
  onMouseDown, onIconContextMenu, onRenameConfirm, onRenameCancel,
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
      onContextMenu={e => e.preventDefault()}
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
  const setDraggingIcon = useDragStore(s => s.setDraggingIcon);

  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<MarqueeState | null>(null);
  const selectedIdsRef = useRef<Set<AppId>>(new Set());
  const [marquee, setMarquee] = useState<MarqueeState | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<AppId>>(new Set());
  const [contextMenu, setContextMenu] = useState<CtxMenu | null>(null);
  const [renamingId, setRenamingId] = useState<AppId | null>(null);

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

    if (sel.has(appId) && sel.size > 1) {
      const selectedPos = positions.filter(p => sel.has(p.appId));
      const unselectedPos = positions.filter(p => !sel.has(p.appId));
      const moves = selectedPos.map(p => ({
        appId: p.appId,
        col: Math.max(0, p.col + deltaCol),
        row: Math.max(0, p.row + deltaRow),
      }));
      // Self-collision: clamping at 0 can cause two icons to land on the same cell
      const coordSet = new Set(moves.map(m => `${m.col},${m.row}`));
      const hasSelfCollision = coordSet.size < moves.length;
      const hasCollision = hasSelfCollision || moves.some(m =>
        unselectedPos.some(u => u.col === m.col && u.row === m.row)
      );
      if (!hasCollision) moveIcons(moves);
    } else {
      const current = positions.find(p => p.appId === appId);
      if (!current) return;
      const newCol = Math.max(0, current.col + deltaCol);
      const newRow = Math.max(0, current.row + deltaRow);
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
      />

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
