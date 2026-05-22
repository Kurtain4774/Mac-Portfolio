import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import type { Wallpaper } from '../../types';

const WALLPAPERS: { id: Wallpaper; label: string; gradient: string }[] = [
  { id: 'dynamic', label: 'Dynamic', gradient: 'linear-gradient(135deg, #fde68a, #38bdf8, #1e1b4b)' },
  { id: 'sequoia', label: 'Sequoia', gradient: 'linear-gradient(135deg, #1a1a2e, #0f3460)' },
  { id: 'dark-gradient', label: 'Midnight', gradient: 'linear-gradient(135deg, #232526, #414345)' },
  { id: 'minimal-light', label: 'Mist', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' },
  { id: 'aurora', label: 'Aurora', gradient: 'linear-gradient(135deg, #0f172a, #1a472a, #0f3460)' },
];

export default function SettingsApp() {
  const { isDark, wallpaper, toggleDark, setWallpaper } = useThemeStore();

  return (
    <div style={{ padding: 32, fontFamily: 'var(--font-content)', color: 'var(--color-text-primary)', maxWidth: 520, width: '100%', margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28 }}>Settings</h1>

      {/* Theme toggle */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          Appearance
        </h2>
        <div style={{
          background: 'var(--color-card-bg)',
          border: '1px solid var(--color-card-border)',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
              <span style={{ fontSize: 14, fontWeight: 500 }}>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                border: 'none',
                background: isDark ? 'var(--color-accent)' : 'var(--color-badge-bg)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
              }}
            >
              <span style={{
                position: 'absolute',
                top: 3,
                left: isDark ? 22 : 3,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        </div>
      </section>

      {/* Wallpaper picker */}
      <section>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          Wallpaper
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {WALLPAPERS.map(w => (
            <button
              key={w.id}
              onClick={() => setWallpaper(w.id)}
              title={w.label}
              style={{
                width: 88,
                border: wallpaper === w.id ? '3px solid var(--color-accent)' : '2px solid var(--color-card-border)',
                borderRadius: 10,
                cursor: 'pointer',
                padding: 0,
                overflow: 'hidden',
                background: 'none',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ width: '100%', height: 56, background: w.gradient }} />
              <div style={{
                padding: '4px 0 6px',
                fontSize: 11,
                fontWeight: wallpaper === w.id ? 600 : 400,
                color: wallpaper === w.id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-system)',
              }}>
                {w.label}
              </div>
            </button>
          ))}
        </div>
        {wallpaper === 'dynamic' && (
          <p style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            Dynamic wallpaper changes automatically based on the time of day.
          </p>
        )}
      </section>
    </div>
  );
}
