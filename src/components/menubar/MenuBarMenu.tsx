import React, { useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const MENUBAR_H = 28;
export const DROPDOWN_Z = 9600;

// ─── MenuItem ────────────────────────────────────────────────────────────────

interface MenuItemProps {
  label: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  checked?: boolean;
}

export function MenuItem({ label, shortcut, onClick, disabled, destructive, checked }: MenuItemProps) {
  const [hov, setHov] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    padding: '3px 12px',
    cursor: disabled ? 'default' : 'default',
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    userSelect: 'none',
    gap: 24,
  };

  if (disabled) {
    return (
      <div style={{ ...baseStyle, color: 'var(--color-text-tertiary)' }}>
        <span>{label}</span>
        {shortcut && <span style={{ fontSize: 12, opacity: 0.7 }}>{shortcut}</span>}
      </div>
    );
  }

  return (
    <div
      role="menuitem"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        ...baseStyle,
        background: hov ? 'var(--color-item-hover-bg)' : 'transparent',
        color: hov
          ? 'var(--color-item-hover-text)'
          : destructive
          ? '#ff3b30'
          : 'var(--color-text-primary)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {checked != null && (
          <span style={{ width: 12, display: 'inline-block', opacity: checked ? 1 : 0 }}>✓</span>
        )}
        {label}
      </span>
      {shortcut && <span style={{ fontSize: 12, opacity: 0.6, flexShrink: 0 }}>{shortcut}</span>}
    </div>
  );
}

// ─── MenuSeparator ────────────────────────────────────────────────────────────

export function MenuSeparator() {
  return (
    <div style={{ height: 1, background: 'var(--color-card-border)', margin: '4px 0' }} />
  );
}

// ─── MenuHeader (non-clickable label inside a panel) ─────────────────────────

export function MenuHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '4px 12px 2px',
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--color-text-secondary)',
      userSelect: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    }}>
      {children}
    </div>
  );
}

// ─── MenuBarMenu ─────────────────────────────────────────────────────────────
// Reusable trigger + anchored dropdown. Handles Escape (stops propagation so
// useWindowManager's bubble handler never fires), and a backdrop div for
// outside-click dismissal.

interface MenuBarMenuProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  label: React.ReactNode;
  children: React.ReactNode;
  minWidth?: number;
  /** align dropdown to the right edge of the trigger (for far-right status items) */
  align?: 'left' | 'right';
  /** called on mouseEnter — used by LeftMenus for hover-switching */
  onTriggerHover?: () => void;
  bold?: boolean;
}

export function MenuBarMenu({
  open,
  onOpenChange,
  label,
  children,
  minWidth = 200,
  align = 'left',
  onTriggerHover,
  bold = false,
}: MenuBarMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        close();
      }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [open, close]);

  const rect = triggerRef.current?.getBoundingClientRect();

  const panelPos: React.CSSProperties = rect
    ? align === 'right'
      ? { right: window.innerWidth - rect.right }
      : { left: rect.left }
    : { left: 0 };

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => onOpenChange(!open)}
        onMouseEnter={onTriggerHover}
        style={{
          background: open ? 'rgba(255,255,255,0.22)' : 'none',
          border: 'none',
          cursor: 'default',
          color: '#ffffff',
          fontSize: 13,
          fontFamily: 'var(--font-system)',
          fontWeight: bold ? 600 : 400,
          padding: '2px 8px',
          borderRadius: 4,
          height: MENUBAR_H,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
      </button>

      {open && rect && createPortal(
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: DROPDOWN_Z - 1 }}
            onClick={close}
          />
          <div
            role="menu"
            style={{
              position: 'fixed',
              top: MENUBAR_H,
              minWidth,
              ...panelPos,
              background: 'var(--color-dropdown-bg)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: 8,
              boxShadow: '0 4px 24px rgba(0,0,0,0.20), 0 1px 4px rgba(0,0,0,0.10)',
              border: '0.5px solid var(--color-card-border)',
              padding: '4px 0',
              zIndex: DROPDOWN_Z,
              fontFamily: 'var(--font-system)',
              fontSize: 13,
              color: 'var(--color-text-primary)',
            }}
          >
            {children}
          </div>
        </>,
        document.body
      )}
    </>
  );
}
