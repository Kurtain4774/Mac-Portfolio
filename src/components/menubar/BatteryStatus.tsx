import { useState } from 'react';
import { Zap } from 'lucide-react';
import { MenuBarMenu } from './MenuBarMenu';
import { useBattery } from '../../hooks/useBattery';

function MenuBarBatteryIcon({ pct, charging }: { pct: number; charging: boolean }) {
  const fillWidth = Math.max(5, Math.min(22, Math.round((pct / 100) * 22)));

  return (
    <span
      aria-hidden="true"
      style={{
        width: 31,
        height: 18,
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <span
        style={{
          width: 25,
          height: 14,
          border: '2px solid rgba(255,255,255,0.92)',
          borderRadius: 5,
          position: 'relative',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          padding: 2,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.16)',
        }}
      >
        <span
          style={{
            width: fillWidth,
            maxWidth: '100%',
            height: 6,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.86)',
            opacity: pct <= 20 ? 0.55 : 1,
          }}
        />
      </span>
      <span
        style={{
          width: 3,
          height: 8,
          borderRadius: '0 2px 2px 0',
          background: 'rgba(255,255,255,0.82)',
          marginLeft: 2,
        }}
      />
      {charging && (
        <Zap
          size={16}
          strokeWidth={2.6}
          style={{
            position: 'absolute',
            left: 6,
            top: 1,
            color: '#e9f1ff',
            filter: 'drop-shadow(0 1px 1px rgba(18,40,106,0.35))',
          }}
        />
      )}
    </span>
  );
}

export function BatteryStatus() {
  const [open, setOpen] = useState(false);
  const { level, charging } = useBattery();

  const pct = Math.round(level * 100);

  return (
    <MenuBarMenu
      open={open}
      onOpenChange={setOpen}
      align="right"
      minWidth={180}
      label={<MenuBarBatteryIcon pct={pct} charging={charging} />}
    >
      <div
        style={{
          minHeight: 42,
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            fontSize: 13,
            lineHeight: 1,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          Battery
        </span>
        <span
          style={{
            fontSize: 18,
            lineHeight: 1,
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
          }}
        >
          {pct}%
        </span>
      </div>
    </MenuBarMenu>
  );
}
