import { useEffect } from 'react';
import { useSystemStore } from '../../stores/systemStore';
import { useBootStore } from '../../stores/bootStore';
import { useTimeOfDay } from '../../hooks/useTimeOfDay';

// Brightness tint — always mounted, pointer-events none
function BrightnessTint({ brightness }: { brightness: number }) {
  const opacity = ((100 - brightness) / 100) * 0.7;
  if (opacity <= 0) return null;
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        background: '#000',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
}

// Sleep overlay — click or any key to wake
function SleepOverlay({ onWake }: { onWake: () => void }) {
  useEffect(() => {
    const onKey = () => onWake();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onWake]);

  return (
    <div
      onClick={onWake}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: '#000',
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        color: 'rgba(255,255,255,0.15)',
        fontSize: 13,
        fontFamily: 'var(--font-system)',
        userSelect: 'none',
      }}>
        Click or press any key to wake
      </div>
    </div>
  );
}

// Lock screen — full screen with big clock, click to unlock
function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const { timeString, dateString } = useTimeOfDay();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key !== '') onUnlock(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onUnlock]);

  return (
    <div
      onClick={onUnlock}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a3e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: 'default',
        fontFamily: 'var(--font-system)',
        userSelect: 'none',
      }}
    >
      <div style={{
        fontSize: 80,
        fontWeight: 200,
        color: '#ffffff',
        letterSpacing: '-2px',
        lineHeight: 1,
      }}>
        {timeString}
      </div>
      <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>
        {dateString}
      </div>
      <div style={{
        marginTop: 48,
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
      }}>
        Click or press any key to unlock
      </div>
    </div>
  );
}

// Shutdown screen — black with power button
function ShutdownScreen({ onPowerOn }: { onPowerOn: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        cursor: 'default',
        fontFamily: 'var(--font-system)',
      }}
    >
      <button
        onClick={onPowerOn}
        title="Power on"
        aria-label="Power on"
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.3)',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.6)',
          transition: 'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.8)';
          (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,1)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
          (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="2" x2="12" y2="12" />
          <path d="M6.3 5.3A8 8 0 1 0 17.7 5.3" />
        </svg>
      </button>
      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, userSelect: 'none' }}>
        Press to power on
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function SystemOverlays() {
  const powerState = useSystemStore(s => s.powerState);
  const brightness = useSystemStore(s => s.brightness);
  const setPowerState = useSystemStore(s => s.setPowerState);
  const restart = useBootStore(s => s.restart);

  return (
    <>
      <BrightnessTint brightness={brightness} />

      {powerState === 'sleeping' && (
        <SleepOverlay onWake={() => setPowerState('on')} />
      )}

      {powerState === 'locked' && (
        <LockScreen onUnlock={() => setPowerState('on')} />
      )}

      {powerState === 'off' && (
        <ShutdownScreen
          onPowerOn={() => {
            setPowerState('on');
            restart();
          }}
        />
      )}
    </>
  );
}
