import { useState } from 'react';
import { createPortal } from 'react-dom';
import { MenuBarMenu, MenuItem, MenuSeparator } from './MenuBarMenu';
import { useWindowStore } from '../../stores/windowStore';
import { useSystemStore } from '../../stores/systemStore';
import { useBootStore } from '../../stores/bootStore';
import appleLogo from '../../assets/icons/apple_logo.png';

interface AppleMenuProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onTriggerHover?: () => void;
}

// macOS-style "About This Mac" panel
function AboutThisMacModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(0,0,0,0.3)' }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 99999,
          width: 340,
          background: 'var(--color-dropdown-bg)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          border: '0.5px solid var(--color-card-border)',
          padding: '28px 32px 24px',
          fontFamily: 'var(--font-system)',
          color: 'var(--color-text-primary)',
          textAlign: 'center',
        }}
      >
        {/* Apple logo placeholder */}
        <div style={{ fontSize: 52, marginBottom: 8 }}>💻</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>MacPortfolio</div>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
          Version 1.0 (2025)
        </div>

        <div style={{
          background: 'var(--color-badge-bg)',
          borderRadius: 8,
          padding: '12px 16px',
          textAlign: 'left',
          fontSize: 12,
          lineHeight: 2,
          color: 'var(--color-text-secondary)',
        }}>
          <Row label="Developer" value="Kurtis Quant" />
          <Row label="School" value="Colorado School of Mines" />
          <Row label="Degree" value="B.S. Computer Science" />
          <Row label="GPA" value="3.7 / 4.0" />
          <Row label="Stack" value="React · TypeScript · Vite" />
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 18,
            background: 'var(--color-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '6px 20px',
            fontSize: 13,
            fontFamily: 'var(--font-system)',
            cursor: 'pointer',
          }}
        >
          OK
        </button>
      </div>
    </>,
    document.body
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--color-text-primary)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export function AppleMenu({ open, onOpenChange, onTriggerHover }: AppleMenuProps) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const openApp = useWindowStore(s => s.openApp);
  const setPowerState = useSystemStore(s => s.setPowerState);
  const restart = useBootStore(s => s.restart);
  const close = () => onOpenChange(false);

  const appleIcon = (
    <img
      src={appleLogo}
      width={15}
      height={15}
      alt=""
      style={{ display: 'block', filter: 'brightness(0) invert(1)', opacity: 0.85 }}
    />
  );

  return (
    <>
      <MenuBarMenu
        open={open}
        onOpenChange={onOpenChange}
        onTriggerHover={onTriggerHover}
        label={appleIcon}
        minWidth={220}
        bold
      >
        <MenuItem
          label="About This Mac"
          onClick={() => { close(); setAboutOpen(true); }}
        />
        <MenuSeparator />
        <MenuItem
          label="System Settings…"
          shortcut="⌘,"
          onClick={() => { openApp('settings'); close(); }}
        />
        <MenuSeparator />
        <MenuItem
          label="Sleep"
          onClick={() => { setPowerState('sleeping'); close(); }}
        />
        <MenuItem
          label="Restart…"
          onClick={() => { restart(); close(); }}
        />
        <MenuItem
          label="Shut Down…"
          onClick={() => { setPowerState('off'); close(); }}
          destructive
        />
        <MenuSeparator />
        <MenuItem
          label="Lock Screen"
          shortcut="⌃⌘Q"
          onClick={() => { setPowerState('locked'); close(); }}
        />
      </MenuBarMenu>

      {aboutOpen && <AboutThisMacModal onClose={() => setAboutOpen(false)} />}
    </>
  );
}
