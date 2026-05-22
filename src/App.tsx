import { useEffect, useState } from 'react';
import { useThemeStore } from './stores/themeStore';
import { useBootStore } from './stores/bootStore';
import { Desktop } from './components/desktop/Desktop';
import { MobileView } from './components/mobile/MobileView';
import { BootAnimation } from './components/boot/BootAnimation';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function App() {
  const isMobile = useIsMobile();
  const bootComplete = useBootStore(s => s.bootComplete);
  const isDark = useThemeStore(s => s.isDark);

  // Apply dark theme to document root for CSS variable scoping
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  if (isMobile) {
    return <MobileView />;
  }

  if (!bootComplete) {
    return <BootAnimation />;
  }

  return <Desktop />;
}
