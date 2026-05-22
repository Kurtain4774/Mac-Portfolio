import { useState } from 'react';
import { BatteryCharging, Battery } from 'lucide-react';
import { MenuBarMenu, MenuItem, MenuSeparator } from './MenuBarMenu';
import { useBattery } from '../../hooks/useBattery';

export function BatteryStatus() {
  const [open, setOpen] = useState(false);
  const { level, charging, supported } = useBattery();

  const pct = Math.round(level * 100);

  // Icon fill ratio for the battery body
  const fillW = Math.round(pct * 0.6); // 0–60% of a 60px-wide bar

  return (
    <MenuBarMenu
      open={open}
      onOpenChange={setOpen}
      align="right"
      minWidth={180}
      label={
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {charging ? <BatteryCharging size={14} /> : <Battery size={14} />}
          <span style={{ fontSize: 12 }}>{pct}%</span>
        </span>
      }
    >
      <div style={{ padding: '8px 14px 4px', userSelect: 'none' }}>
        {/* Battery bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 60,
            height: 22,
            border: '1.5px solid var(--color-text-secondary)',
            borderRadius: 3,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
            {/* Terminal nub */}
            <div style={{
              position: 'absolute',
              right: -5,
              width: 4,
              height: 8,
              background: 'var(--color-text-secondary)',
              borderRadius: '0 1px 1px 0',
            }} />
            {/* Fill */}
            <div style={{
              width: `${pct}%`,
              height: '100%',
              background: pct <= 20 ? '#ff3b30' : charging ? '#30d158' : 'var(--color-text-primary)',
              borderRadius: 2,
              transition: 'width 0.3s',
            }} />
          </div>
          <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {pct}%
          </span>
        </div>

        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
          {charging ? '⚡ Charging' : pct <= 20 ? '⚠️ Low Battery' : 'On Battery Power'}
        </div>
        {!supported && (
          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
            (Battery API not supported in this browser)
          </div>
        )}
      </div>
      <MenuSeparator />
      <MenuItem label="Show in Menu Bar" checked disabled />
      <MenuItem label="Battery Preferences…" disabled />
    </MenuBarMenu>
  );
}
