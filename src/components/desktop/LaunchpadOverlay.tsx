import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { apps } from '../../config/apps';
import { AppIcon } from '../shared/AppIcon';
import type { AppId } from '../../types';

const HIDDEN_APP_IDS = new Set<AppId>(['finder', 'launchpad']);

interface Props {
  onClose: () => void;
  onOpenApp: (appId: AppId) => void;
}

export function LaunchpadOverlay({ onClose, onOpenApp }: Props) {
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const launchpadApps = useMemo(
    () =>
      [...apps]
        .filter(app => !HIDDEN_APP_IDS.has(app.id))
        .sort((a, b) => a.dockOrder - b.dockOrder),
    []
  );

  const visibleApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return launchpadApps;
    return launchpadApps.filter(app => app.name.toLowerCase().includes(normalizedQuery));
  }, [launchpadApps, query]);

  useEffect(() => {
    const id = window.setTimeout(() => searchRef.current?.focus(), 120);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-label="Launchpad"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onMouseDown={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px clamp(28px, 6vw, 92px) 116px',
        background:
          'linear-gradient(135deg, rgba(32, 7, 88, 0.58), rgba(5, 116, 129, 0.42) 46%, rgba(21, 38, 158, 0.56)), rgba(10, 10, 38, 0.25)',
        backdropFilter: 'blur(22px) saturate(1.35)',
        WebkitBackdropFilter: 'blur(22px) saturate(1.35)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <div
        onMouseDown={event => event.stopPropagation()}
        style={{
          position: 'relative',
          width: 280,
          maxWidth: '42vw',
          height: 30,
          flexShrink: 0,
        }}
      >
        <Search
          size={15}
          aria-hidden
          style={{
            position: 'absolute',
            left: 92,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.86)',
            pointerEvents: 'none',
          }}
        />
        <input
          ref={searchRef}
          value={query}
          onChange={event => setQuery(event.target.value)}
          aria-label="Search applications"
          placeholder="Search"
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid rgba(255,255,255,0.24)',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.13)',
            color: '#fff',
            outline: 'none',
            padding: '0 14px 0 122px',
            fontFamily: 'var(--font-system)',
            fontSize: 17,
            fontWeight: 400,
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), 0 1px 8px rgba(0,0,0,0.12)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1.035, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.025, y: 8 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onMouseDown={event => event.stopPropagation()}
        style={{
          width: 'min(1120px, 100%)',
          marginTop: 'clamp(36px, 7vh, 70px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(112px, 112px))',
          justifyContent: 'center',
          alignContent: 'start',
          gap: '42px clamp(42px, 6.2vw, 86px)',
        }}
      >
        {visibleApps.map(app => (
          <button
            key={app.id}
            type="button"
            onClick={() => {
              onClose();
              onOpenApp(app.id);
            }}
            title={app.name}
            aria-label={`Open ${app.name}`}
            style={{
              width: 112,
              minHeight: 118,
              border: 0,
              padding: 0,
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              fontFamily: 'var(--font-system)',
              textShadow: '0 1px 4px rgba(0,0,0,0.48)',
            }}
          >
            <motion.span
              whileHover={{ scale: 1.055 }}
              whileTap={{ scale: 0.93 }}
              transition={{ duration: 0.12 }}
              style={{
                display: 'block',
                width: 82,
                height: 82,
                lineHeight: 0,
              }}
            >
              <AppIcon appId={app.id} size={82} />
            </motion.span>
            <span
              style={{
                maxWidth: 112,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: 15,
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {app.name}
            </span>
          </button>
        ))}
      </motion.div>

      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 88,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          }}
        />
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.26)',
          }}
        />
      </div>
    </motion.div>
  );
}
