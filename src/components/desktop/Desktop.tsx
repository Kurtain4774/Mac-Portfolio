import { useEffect, useRef } from 'react';
import { MenuBar } from './MenuBar';
import { DesktopGrid } from './DesktopGrid';
import { Dock } from './Dock';
import { Window } from '../window/Window';
import { useWindowStore } from '../../stores/windowStore';
import { useThemeStore } from '../../stores/themeStore';
import { useBootStore } from '../../stores/bootStore';
import { useWindowManager } from '../../hooks/useWindowManager';
import { useTimeOfDay } from '../../hooks/useTimeOfDay';
import type { TimeOfDay, Wallpaper } from '../../types';
import sequoiaWallpaper from '../../assets/wallpapers/sequoia-light2.jpg';
import '../../styles/animations.css';

function getWallpaperGradient(tod: TimeOfDay): string {
  switch (tod) {
    case 'morning':   return 'linear-gradient(160deg, #fde68a 0%, #fb923c 40%, #93c5fd 100%)';
    case 'afternoon': return 'linear-gradient(160deg, #7dd3fc 0%, #38bdf8 50%, #e0f2fe 100%)';
    case 'evening':   return 'linear-gradient(160deg, #f97316 0%, #a855f7 60%, #1e1b4b 100%)';
    case 'night':     return 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)';
  }
}

const WALLPAPER_MAP: Record<Wallpaper, string> = {
  dynamic: '',
  sequoia: `url(${sequoiaWallpaper})`,
  'dark-gradient': 'linear-gradient(160deg, #232526 0%, #414345 100%)',
  'minimal-light': 'linear-gradient(160deg, #f5f7fa 0%, #c3cfe2 100%)',
  aurora: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 30%, #1a472a 60%, #0f3460 100%)',
};

function NightStars() {
  const stars = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 70}%`,
      size: Math.random() * 2 + 1,
      duration: 4 + Math.random() * 8,
      delay: Math.random() * 4,
    }))
  );
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.current.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            animation: `star-drift ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

export function Desktop() {
  useWindowManager();
  const windows = useWindowStore(s => s.windows);
  const { wallpaper, isDark } = useThemeStore();
  const { onboardingShown, setOnboardingShown } = useBootStore();
  const { timeOfDay } = useTimeOfDay();
  const onboardingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bg = wallpaper === 'dynamic' ? getWallpaperGradient(timeOfDay) : WALLPAPER_MAP[wallpaper];

  useEffect(() => {
    if (!onboardingShown) {
      onboardingTimerRef.current = setTimeout(() => setOnboardingShown(), 4000);
    }
    return () => {
      if (onboardingTimerRef.current) clearTimeout(onboardingTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      data-theme={isDark ? 'dark' : 'light'}
      onContextMenu={e => e.preventDefault()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: bg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 2s ease',
        overflow: 'hidden',
      }}
    >
      {timeOfDay === 'night' && wallpaper === 'dynamic' && <NightStars />}

      <MenuBar />

      {/* Window area: bounds container for react-rnd */}
      <div
        id="desktop-window-container"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 'var(--menubar-height)',
          bottom: 0,
        }}
      >
        {windows
          .filter(w => !w.minimized)
          .map(win => (
            <Window key={win.id} win={win} />
          ))}
      </div>

      <DesktopGrid />
      <Dock />

      {!onboardingShown && (
        <div
          className="onboarding-tooltip"
          style={{
            position: 'fixed',
            bottom: 110,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.72)',
            color: '#fff',
            padding: '8px 18px',
            borderRadius: 20,
            fontSize: 13,
            fontFamily: 'var(--font-system)',
            pointerEvents: 'none',
            zIndex: 7000,
            whiteSpace: 'nowrap',
          }}
        >
          Click any app to explore
        </div>
      )}
    </div>
  );
}
