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
        background: 'linear-gradient(90deg, rgb(42,11,130) 0%, rgb(45,36,141) 20%, rgb(52,80,146) 40%, rgb(48,101,150) 60%, rgb(35,79,160) 80%, rgb(32,54,166) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-card-border)',
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
