import React, { useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const MENUBAR_H = 28;
export const DROPDOWN_Z = 9600;

const glassMenuVars = {
  '--color-text-primary': '#eeeaf7',
  '--color-text-secondary': 'rgba(238,234,247,0.74)',
  '--color-text-tertiary': 'rgba(238,234,247,0.42)',
  '--color-card-border': 'rgba(232,221,255,0.18)',
  '--color-badge-bg': 'rgba(255,255,255,0.10)',
  '--color-accent': '#a78bfa',
  '--color-item-hover-bg': 'rgba(255,255,255,0.13)',
  '--color-item-hover-text': '#ffffff',
} as React.CSSProperties;

// ─── MenuItem ────────────────────────────────────────────────────────────────

interface MenuItemProps {
  label: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  checked?: boolean;
  badge?: string;
  trailing?: React.ReactNode;
}

export function MenuItem({
  label,
  shortcut,
  onClick,
  disabled,
  destructive,
  checked,
  badge,
  trailing,
}: MenuItemProps) {
  const [hov, setHov] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    minHeight: 24,
    padding: '3px 12px',
    cursor: disabled ? 'default' : 'default',
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    userSelect: 'none',
    gap: 18,
    fontSize: 13,
    fontWeight: 600,
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
          ? '#ffb4ca'
          : 'var(--color-text-primary)',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {checked != null && (
          <span style={{ width: 12, display: 'inline-block', opacity: checked ? 1 : 0 }}>✓</span>
        )}
        {label}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {badge && (
          <span
            style={{
              padding: '2px 10px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.14)',
              color: '#eeeaf7',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {badge}
          </span>
        )}
        {shortcut && (
          <span style={{ fontSize: 13, opacity: 0.36, flexShrink: 0, letterSpacing: 0.5 }}>
            {shortcut}
          </span>
        )}
        {trailing && (
          <span style={{ fontSize: 18, lineHeight: 1, opacity: 0.95, flexShrink: 0 }}>
            {trailing}
          </span>
        )}
      </span>
    </div>
  );
}

// ─── MenuSeparator ────────────────────────────────────────────────────────────

export function MenuSeparator() {
  return (
    <div style={{ height: 1, background: 'var(--color-card-border)', margin: '4px 12px' }} />
  );
}

// ─── MenuHeader (non-clickable label inside a panel) ─────────────────────────

export function MenuHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '4px 12px 2px',
      fontSize: 12,
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
  const panelRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener('pointerdown', onPointerDown, { capture: true });
    return () => document.removeEventListener('pointerdown', onPointerDown, { capture: true });
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
          background: open ? 'rgba(255,255,255,0.15)' : 'transparent',
          border: 'none',
          cursor: 'default',
          color: 'rgba(255,255,255,0.94)',
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
        <div
          ref={panelRef}
          role="menu"
          style={{
            position: 'fixed',
            top: MENUBAR_H + 4,
            minWidth,
            width: minWidth,
            ...panelPos,
            ...glassMenuVars,
            background: 'linear-gradient(145deg, rgba(45,27,94,0.82), rgba(34,18,76,0.78))',
            backdropFilter: 'blur(34px) saturate(1.45)',
            WebkitBackdropFilter: 'blur(34px) saturate(1.45)',
            borderRadius: 8,
            boxShadow: '0 24px 80px rgba(18,7,44,0.58), inset 0 1px 0 rgba(255,255,255,0.15)',
            border: '1px solid rgba(232,221,255,0.28)',
            padding: '4px 0',
            zIndex: DROPDOWN_Z,
            fontFamily: 'var(--font-system)',
            color: '#eeeaf7',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>,
        document.body
      )}
    </>
  );
}
