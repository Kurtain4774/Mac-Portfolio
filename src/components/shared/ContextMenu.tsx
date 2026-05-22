import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  x: number;
  y: number;
  onOpen: () => void;
  onRename: () => void;
  onRemove: () => void;
  onClose: () => void;
}

export function ContextMenu({ x, y, onOpen, onRename, onRemove, onClose }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const menuW = 192;
  const menuH = 108;
  const left = Math.min(x, window.innerWidth - menuW - 8);
  const top = Math.min(y, window.innerHeight - menuH - 8);

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left,
        top,
        width: menuW,
        background: 'rgba(245,245,245,0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: 9,
        boxShadow: '0 8px 32px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.12)',
        zIndex: 9999,
        padding: '4px 0',
        fontFamily: 'var(--font-system)',
        fontSize: 13,
        userSelect: 'none',
      }}
      onContextMenu={e => e.preventDefault()}
    >
      <Item label="Open" onClick={() => { onOpen(); onClose(); }} />
      <Separator />
      <Item label="Rename" onClick={() => { onRename(); onClose(); }} />
      <Item label="Remove from Desktop" onClick={() => { onRemove(); onClose(); }} destructive />
    </div>,
    document.body
  );
}

function Item({ label, onClick, destructive }: { label: string; onClick: () => void; destructive?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '5px 14px',
        cursor: 'default',
        borderRadius: 5,
        margin: '1px 4px',
        color: hovered ? '#fff' : destructive ? '#ff3b30' : '#1a1a1a',
        background: hovered ? '#0066ff' : 'transparent',
        transition: 'background 60ms, color 60ms',
      }}
    >
      {label}
    </div>
  );
}

function Separator() {
  return <div style={{ height: 1, background: 'rgba(0,0,0,0.09)', margin: '3px 0' }} />;
}
