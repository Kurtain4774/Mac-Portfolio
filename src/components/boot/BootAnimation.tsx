import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useBootStore } from '../../stores/bootStore';

export function BootAnimation() {
  const setBootComplete = useBootStore(s => s.setBootComplete);
  const [phase, setPhase] = useState<'logo' | 'progress' | 'done'>('logo');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Logo appears at 0.8s, progress starts at 1.2s
    const t1 = setTimeout(() => setPhase('progress'), 1200);
    const t2 = setTimeout(() => setBootComplete(), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [setBootComplete]);

  useEffect(() => {
    if (phase !== 'progress') return;
    const start = Date.now();
    const duration = 2000;
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / duration) * 100));
      if (elapsed >= duration) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [phase]);

  const skip = () => setBootComplete();

  return (
    <div
      onClick={skip}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        cursor: 'pointer',
        zIndex: 99999,
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          fontSize: 72,
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        ⌘
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'progress' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          width: 160,
          height: 4,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'rgba(255,255,255,0.8)',
            borderRadius: 2,
            transition: 'width 0.05s linear',
          }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2, duration: 0.5 }}
        style={{
          color: '#fff',
          fontSize: 11,
          fontFamily: 'var(--font-system)',
          position: 'absolute',
          bottom: 40,
        }}
      >
        Click to skip
      </motion.p>
    </div>
  );
}
