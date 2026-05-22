import { useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { AppIcon } from '../shared/AppIcon';
import { useDesktopStore } from '../../stores/desktopStore';
import type { AppId } from '../../types';

const CELL = 90;
const GAP = 16;

interface DragTransform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}

interface Props {
  appId: AppId;
  name: string;
  col: number;
  row: number;
  isSelected?: boolean;
  isRenaming?: boolean;
  groupDragTransform?: DragTransform | null;
  onContextMenu?: (e: React.MouseEvent) => void;
  onRenameConfirm?: (newName: string) => void;
  onRenameCancel?: () => void;
  onSelect?: (e: React.MouseEvent) => void;
  onOpen?: () => void;
}

export function DesktopIcon({
  appId,
  name,
  col,
  row,
  isSelected = false,
  isRenaming = false,
  groupDragTransform = null,
  onContextMenu,
  onRenameConfirm,
  onRenameCancel,
  onSelect,
  onOpen,
}: Props) {
  const customNames = useDesktopStore(s => s.names);
  const displayName = customNames[appId] ?? name;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: appId,
    data: { appId, col, row },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (isRenaming) return;
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      onOpen?.();
    } else {
      onSelect?.(e);
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
      }, 300);
    }
  };

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.value = displayName;
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming, displayName]);

  const x = col * (CELL + GAP);
  const y = row * (CELL + GAP);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width: CELL,
    height: CELL + 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
    gap: 4,
    cursor: 'pointer',
    borderRadius: 8,
    transform: CSS.Translate.toString(groupDragTransform ?? transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : (groupDragTransform ? 99 : 1),
    transition: 'none',
    userSelect: 'none',
    background: 'transparent',
  };

  const iconWrapperStyle: React.CSSProperties = {
    borderRadius: '22%',
    border: isSelected ? '1px solid rgba(180, 180, 195, 0.65)' : '1px solid transparent',
    background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
    lineHeight: 0,
    flexShrink: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: '#ffffff',
    textShadow: isSelected ? 'none' : '0 1px 3px rgba(0,0,0,0.4)',
    textAlign: 'center',
    maxWidth: CELL - 8,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontFamily: 'var(--font-system)',
    pointerEvents: 'none',
    background: isSelected ? '#0058d0' : 'transparent',
    borderRadius: isSelected ? 4 : 0,
    padding: isSelected ? '1px 5px' : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      onContextMenu={e => {
        e.preventDefault();
        onContextMenu?.(e);
      }}
      data-icon-id={appId}
    >
      <div style={iconWrapperStyle}>
        <AppIcon appId={appId} size={56} />
      </div>

      {isRenaming ? (
        <input
          ref={inputRef}
          defaultValue={displayName}
          onKeyDown={e => {
            if (e.key === 'Enter') onRenameConfirm?.(inputRef.current?.value ?? displayName);
            if (e.key === 'Escape') onRenameCancel?.();
          }}
          onBlur={() => onRenameConfirm?.(inputRef.current?.value ?? displayName)}
          onClick={e => e.stopPropagation()}
          style={{
            fontSize: 11,
            fontWeight: 500,
            fontFamily: 'var(--font-system)',
            textAlign: 'center',
            width: CELL - 4,
            background: 'rgba(255,255,255,0.92)',
            border: '1.5px solid #0066ff',
            borderRadius: 4,
            outline: 'none',
            padding: '1px 4px',
            color: '#1a1a1a',
            boxShadow: '0 0 0 2px rgba(0,102,255,0.25)',
          }}
        />
      ) : (
        <span style={labelStyle}>{displayName}</span>
      )}
    </div>
  );
}

export { CELL, GAP };
