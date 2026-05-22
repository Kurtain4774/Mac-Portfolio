import { useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { MenuBarMenu, MenuItem, MenuSeparator } from './MenuBarMenu';
import { useSystemStore } from '../../stores/systemStore';

const NETWORKS = [
  { name: 'Redwoodya', signal: 3, locked: true, connected: true },
  { name: 'CoffeeShop_Guest', signal: 2, locked: false, connected: false },
  { name: 'iPhone Hotspot', signal: 1, locked: true, connected: false },
];

function SignalBars({ level }: { level: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 1.5, height: 12 }}>
      {[1, 2, 3].map(i => (
        <span
          key={i}
          style={{
            width: 3,
            height: 3 + i * 3,
            borderRadius: 1,
            background: i <= level ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
            display: 'inline-block',
          }}
        />
      ))}
    </span>
  );
}

export function WifiMenu() {
  const [open, setOpen] = useState(false);
  const wifi = useSystemStore(s => s.wifi);
  const setWifi = useSystemStore(s => s.setWifi);

  return (
    <MenuBarMenu
      open={open}
      onOpenChange={setOpen}
      align="right"
      minWidth={260}
      label={wifi ? <Wifi size={14} /> : <WifiOff size={14} />}
    >
      {/* Toggle row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 12px',
        userSelect: 'none',
      }}>
        <span style={{ fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 500 }}>Wi-Fi</span>
        <button
          onClick={() => setWifi(!wifi)}
          style={{
            width: 36,
            height: 20,
            borderRadius: 10,
            border: 'none',
            background: wifi ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s',
          }}
          aria-label="Toggle Wi-Fi"
        >
          <span style={{
            position: 'absolute',
            top: 2,
            left: wifi ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
          }} />
        </button>
      </div>

      {wifi && (
        <>
          <MenuSeparator />
          <div style={{ padding: '2px 12px 4px', fontSize: 11, color: 'var(--color-text-tertiary)', userSelect: 'none' }}>
            PREFERRED NETWORKS
          </div>
          {NETWORKS.map(net => (
            <div
              key={net.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 12px',
                cursor: 'default',
                borderRadius: 4,
                color: 'var(--color-text-primary)',
                fontSize: 13,
                userSelect: 'none',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {net.connected && <span style={{ color: 'var(--color-accent)', fontSize: 10 }}>✓</span>}
                {net.locked && <span style={{ fontSize: 10, opacity: 0.6 }}>🔒</span>}
                {net.name}
              </span>
              <SignalBars level={net.signal} />
            </div>
          ))}
          <MenuSeparator />
          <MenuItem label="Other Networks…" disabled />
          <MenuItem label="Network Preferences…" disabled />
        </>
      )}
    </MenuBarMenu>
  );
}
