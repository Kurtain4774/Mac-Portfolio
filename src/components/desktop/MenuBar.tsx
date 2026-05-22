import { Moon, Sun } from 'lucide-react';
import { useWindowStore } from '../../stores/windowStore';
import { useThemeStore } from '../../stores/themeStore';
import { useTimeOfDay } from '../../hooks/useTimeOfDay';
import { appMap } from '../../config/apps';

export function MenuBar() {
  const focusedWindowId = useWindowStore(s => s.focusedWindowId);
  const windows = useWindowStore(s => s.windows);
  const isDark = useThemeStore(s => s.isDark);
  const toggleDark = useThemeStore(s => s.toggleDark);
  const { timeString } = useTimeOfDay();

  const focused = windows.find(w => w.id === focusedWindowId);
  const appName = focused ? appMap[focused.appId]?.name : 'Finder';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--menubar-height)',
        background: 'var(--color-menubar-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-card-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        zIndex: 9000,
        fontFamily: 'var(--font-system)',
        fontSize: 13,
      }}
    >
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <span style={{ fontSize: 16 }}>⌘</span>
        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{appName}</span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={toggleDark}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            padding: '2px 4px',
            borderRadius: 4,
          }}
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <span style={{ color: 'var(--color-text-primary)', fontWeight: 500, minWidth: 44, textAlign: 'right' }}>
          {timeString}
        </span>
      </div>
    </div>
  );
}
