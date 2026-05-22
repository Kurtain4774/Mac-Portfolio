import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { appMap } from '../../config/apps';
import type { AppId } from '../../types';

interface Props {
  appId: AppId;
  onBack: () => void;
}

export function MobileAppPage({ appId, onBack }: Props) {
  const app = appMap[appId];
  const AppComponent = app.component;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--color-window-bg)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 500,
      }}
    >
      {/* iOS-style nav bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '48px 16px 12px',
        borderBottom: '1px solid var(--color-card-border)',
        background: 'var(--color-titlebar-bg)',
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            color: 'var(--color-accent)',
            fontSize: 16,
            fontFamily: 'var(--font-system)',
            padding: 0,
          }}
        >
          <ChevronLeft size={20} /> Home
        </button>
        <h1 style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 17,
          fontWeight: 600,
          fontFamily: 'var(--font-system)',
          color: 'var(--color-text-primary)',
        }}>
          {app.name}
        </h1>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--color-text-tertiary)', fontSize: 14 }}>
            Loading…
          </div>
        }>
          <AppComponent />
        </Suspense>
      </div>
    </motion.div>
  );
}
