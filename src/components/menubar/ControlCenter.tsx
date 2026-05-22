import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { MenuBarMenu } from './MenuBarMenu';
import { useSystemStore } from '../../stores/systemStore';
import { useThemeStore } from '../../stores/themeStore';
import { useWindowStore } from '../../stores/windowStore';
import controlCenterIcon from '../../assets/icons/control_center.png';

// ─── Tile component ────────────────────────────────────────────────────────────

interface TileProps {
  icon: string | React.ReactNode;
  title: string;
  subtitle?: string;
  active: boolean;
  onClick: () => void;
  small?: boolean;
}

function Tile({ icon, title, subtitle, active, onClick, small }: TileProps) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: active
          ? 'rgba(0,122,255,0.18)'
          : hov
          ? 'var(--color-card-border)'
          : 'var(--color-badge-bg)',
        border: active ? '1px solid rgba(0,122,255,0.25)' : '1px solid transparent',
        borderRadius: 10,
        padding: small ? '8px 10px' : '10px 12px',
        cursor: 'default',
        textAlign: 'left',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        transition: 'background 0.15s',
      }}
    >
      <div style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: small ? 12 : 14,
        color: '#fff',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
        {title}
      </div>
      {subtitle && !small && (
        <div style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>
          {subtitle}
        </div>
      )}
    </button>
  );
}

// ─── Slider row ────────────────────────────────────────────────────────────────

interface SliderRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (v: number) => void;
}

function SliderRow({ icon, label, value, onChange }: SliderRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
      <div style={{ color: 'var(--color-text-secondary)', width: 18, display: 'flex', justifyContent: 'center' }}>
        {icon}
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: 'var(--color-accent)', cursor: 'pointer' }}
        aria-label={label}
      />
    </div>
  );
}

// ─── Appearance tile ───────────────────────────────────────────────────────────

function AppearanceTile({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
  return (
    <div style={{
      background: 'var(--color-badge-bg)',
      borderRadius: 10,
      padding: '10px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isDark ? <Moon size={14} color="var(--color-text-primary)" /> : <Sun size={14} color="var(--color-text-primary)" />}
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>Appearance</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {(['light', 'dark'] as const).map(mode => {
          const isActive = (mode === 'dark') === isDark;
          return (
            <button
              key={mode}
              onClick={() => { if (!isActive) toggle(); }}
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                border: 'none',
                fontSize: 11,
                fontWeight: 500,
                cursor: 'default',
                background: isActive ? 'var(--color-accent)' : 'var(--color-card-border)',
                color: isActive ? '#fff' : 'var(--color-text-secondary)',
                transition: 'background 0.15s',
              }}
            >
              {mode === 'light' ? '☀️ Light' : '🌙 Dark'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── AirDrop label ─────────────────────────────────────────────────────────────

function airdropLabel(mode: string) {
  if (mode === 'off') return 'Off';
  if (mode === 'contacts') return 'Contacts Only';
  return 'Everyone';
}

// ─── Control Center main component ────────────────────────────────────────────

export function ControlCenter() {
  const [open, setOpen] = useState(false);

  const wifi = useSystemStore(s => s.wifi);
  const bluetooth = useSystemStore(s => s.bluetooth);
  const airdropMode = useSystemStore(s => s.airdropMode);
  const focus = useSystemStore(s => s.focus);
  const stageManager = useSystemStore(s => s.stageManager);
  const screenMirroring = useSystemStore(s => s.screenMirroring);
  const brightness = useSystemStore(s => s.brightness);
  const volume = useSystemStore(s => s.volume);

  const setWifi = useSystemStore(s => s.setWifi);
  const setBluetooth = useSystemStore(s => s.setBluetooth);
  const cycleAirdrop = useSystemStore(s => s.cycleAirdrop);
  const toggleFocus = useSystemStore(s => s.toggleFocus);
  const toggleStageManager = useSystemStore(s => s.toggleStageManager);
  const toggleScreenMirroring = useSystemStore(s => s.toggleScreenMirroring);
  const setBrightness = useSystemStore(s => s.setBrightness);
  const setVolume = useSystemStore(s => s.setVolume);

  const isDark = useThemeStore(s => s.isDark);
  const toggleDark = useThemeStore(s => s.toggleDark);
  const arrangeWindows = useWindowStore(s => s.arrangeWindows);

  return (
    <MenuBarMenu
      open={open}
      onOpenChange={setOpen}
      align="right"
      minWidth={310}
      label={
        <img
          src={controlCenterIcon}
          width={16}
          height={16}
          alt=""
          style={{ display: 'block', filter: 'brightness(0) invert(1)', opacity: 0.85 }}
        />
      }
    >
      <div style={{ padding: '10px 10px 8px', fontFamily: 'var(--font-system)' }}>
        {/* Tile grid: 2 columns */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {/* Left column — wide tiles */}
          <div style={{ flex: '0 0 55%', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Tile
              icon="📶"
              title="Wi-Fi"
              subtitle={wifi ? 'Redwoodya' : 'Off'}
              active={wifi}
              onClick={() => setWifi(!wifi)}
            />
            <Tile
              icon="🦷"
              title="Bluetooth"
              subtitle={bluetooth ? 'On' : 'Off'}
              active={bluetooth}
              onClick={() => setBluetooth(!bluetooth)}
            />
            <Tile
              icon="📡"
              title="AirDrop"
              subtitle={airdropLabel(airdropMode)}
              active={airdropMode !== 'off'}
              onClick={cycleAirdrop}
            />
          </div>
          {/* Right column — narrow tiles */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Tile
              icon="🌙"
              title="Focus"
              active={focus}
              onClick={toggleFocus}
              small
            />
            <Tile
              icon="◧"
              title="Stage Manager"
              active={stageManager}
              onClick={() => { toggleStageManager(); if (!stageManager) arrangeWindows(); }}
              small
            />
            <Tile
              icon="📺"
              title="Screen Mirroring"
              active={screenMirroring}
              onClick={toggleScreenMirroring}
              small
            />
          </div>
        </div>

        {/* Appearance */}
        <AppearanceTile isDark={isDark} toggle={toggleDark} />

        {/* Sliders */}
        <div style={{
          background: 'var(--color-badge-bg)',
          borderRadius: 10,
          padding: '8px 12px',
        }}>
          <SliderRow
            icon={<Sun size={14} />}
            label="Brightness"
            value={brightness}
            onChange={setBrightness}
          />
          <SliderRow
            icon={<span style={{ fontSize: 13 }}>🔊</span>}
            label="Volume"
            value={volume}
            onChange={setVolume}
          />
        </div>
      </div>
    </MenuBarMenu>
  );
}
