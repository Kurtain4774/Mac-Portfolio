import { useState } from 'react';
import { LeftMenus } from '../menubar/LeftMenus';
import { BatteryStatus } from '../menubar/BatteryStatus';
import { WifiMenu } from '../menubar/WifiMenu';
import { TimeMachineMenu } from '../menubar/TimeMachineMenu';
import { SpotlightButton } from '../menubar/Spotlight';
import { ControlCenter } from '../menubar/ControlCenter';
import { SiriButton } from '../menubar/SiriButton';
import { ClockMenu } from '../menubar/ClockMenu';
import { useBootStore } from '../../stores/bootStore';

export function MenuBar() {
  const [siriOpen, setSiriOpen] = useState(false);
  const resetOnboarding = useBootStore(s => s.resetOnboarding);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--menubar-height)',
        background: 'linear-gradient(90deg, rgba(44,22,103,0.66), rgba(34,18,82,0.58) 52%, rgba(31,36,112,0.60))',
        backdropFilter: 'blur(28px) saturate(1.35)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.35)',
        borderBottom: '1px solid rgba(232,221,255,0.18)',
        boxShadow: '0 10px 34px rgba(16,6,40,0.24), inset 0 1px 0 rgba(255,255,255,0.10)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px 0 0',
        zIndex: 9000,
        fontFamily: 'var(--font-system)',
        fontSize: 13,
      }}
    >
      {/* Left side — Apple logo + context-aware app menus */}
      <LeftMenus
        openSiri={() => setSiriOpen(true)}
        showOnboarding={resetOnboarding}
      />

      {/* Right side — status icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
        <BatteryStatus />
        <WifiMenu />
        <TimeMachineMenu />
        <SpotlightButton />
        <ControlCenter />
        <SiriButton open={siriOpen} onOpenChange={setSiriOpen} />
        <ClockMenu />
      </div>
    </div>
  );
}
