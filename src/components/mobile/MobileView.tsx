import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeStore } from '../../stores/themeStore';
import { useBootStore } from '../../stores/bootStore';
import { useTimeOfDay } from '../../hooks/useTimeOfDay';
import { MobileAppGrid } from './MobileAppGrid';
import { MobileAppPage } from './MobileAppPage';
import type { AppId, TimeOfDay } from '../../types';

function getMobileWallpaper(tod: TimeOfDay): string {
  switch (tod) {
    case 'morning':   return 'linear-gradient(160deg, #fde68a 0%, #fb923c 40%, #93c5fd 100%)';
    case 'afternoon': return 'linear-gradient(160deg, #7dd3fc 0%, #38bdf8 50%, #bae6fd 100%)';
    case 'evening':   return 'linear-gradient(160deg, #f97316 0%, #a855f7 70%, #1e1b4b 100%)';
    case 'night':     return 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)';
  }
}

function MobileStatusBar({ timeString }: { timeString: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px 4px',
      color: '#fff',
      fontFamily: 'var(--font-system)',
      fontSize: 14,
      fontWeight: 600,
      textShadow: '0 1px 3px rgba(0,0,0,0.3)',
    }}>
      <span>{timeString}</span>
      <span style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 12 }}>
        <span>●●●</span>
        <span>WiFi</span>
        <span>🔋</span>
      </span>
    </div>
  );
}

function MobileBootAnimation({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1500;
    const id = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(p);
      if (p >= 100) { clearInterval(id); setTimeout(onDone, 300); }
    }, 16);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div
      onClick={onDone}
      style={{
        position: 'fixed', inset: 0, background: '#000',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 20, zIndex: 9999, cursor: 'pointer',
      }}
    >
      <div style={{ fontSize: 56 }}>⌘</div>
      <div style={{ width: 120, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'rgba(255,255,255,0.8)', transition: 'width 0.05s linear' }} />
      </div>
    </div>
  );
}

export function MobileView() {
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [booted, setBooted] = useState(false);
  const { wallpaper, isDark } = useThemeStore();
  const bootComplete = useBootStore(s => s.bootComplete);
  const setBootComplete = useBootStore(s => s.setBootComplete);
  const { timeOfDay, timeString } = useTimeOfDay();

  const bg = wallpaper === 'dynamic' ? getMobileWallpaper(timeOfDay) : '';

  const handleBoot = () => {
    setBooted(true);
    setBootComplete();
  };

  if (!bootComplete && !booted) {
    return <MobileBootAnimation onDone={handleBoot} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-theme={isDark ? 'dark' : 'light'}
      style={{
        position: 'fixed', inset: 0,
        background: bg || 'linear-gradient(160deg, #1a1a2e, #0f3460)',
        overflow: 'hidden',
      }}
    >
      <MobileStatusBar timeString={timeString} />

      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 8, fontFamily: 'var(--font-system)' }}>
        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>

      <MobileAppGrid onOpen={setActiveApp} />

      <AnimatePresence>
        {activeApp && (
          <MobileAppPage
            key={activeApp}
            appId={activeApp}
            onBack={() => setActiveApp(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
