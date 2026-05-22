import { useState, useEffect, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useWindowStore } from '../../stores/windowStore';
import type { AppId } from '../../types';
import siriIcon from '../../assets/icons/siri.png';

const PANEL_Z = 9700;

const glassPanelVars = {
  '--color-text-primary': '#eeeaf7',
  '--color-text-secondary': 'rgba(238,234,247,0.74)',
  '--color-text-tertiary': 'rgba(238,234,247,0.42)',
  '--color-card-border': 'rgba(232,221,255,0.18)',
  '--color-badge-bg': 'rgba(255,255,255,0.10)',
  '--color-accent': '#a78bfa',
} as CSSProperties;

interface QA {
  question: string;
  answer: string;
  appId?: AppId;
  appLabel?: string;
}

const QA_LIST: QA[] = [
  {
    question: 'What are your skills?',
    answer:
      "I'm proficient in React, TypeScript, Node.js, Python, MongoDB, Express, and more. I love working across the full stack — from building intuitive UIs to designing scalable backend systems.",
    appId: 'projects',
    appLabel: 'View Projects',
  },
  {
    question: 'Tell me about Kurtis',
    answer:
      'Kurtis is a CS graduate from Colorado School of Mines (3.7 GPA) passionate about building clean, performant web apps. He turns complex problems into intuitive user experiences.',
    appId: 'about',
    appLabel: 'Open About',
  },
  {
    question: 'What have you built?',
    answer:
      "SoundSage (AI music discovery), TFT Dualytics (esports tracker), Quoted (Pinterest-style platform), and HabitFlow (habit tracker) — all real, shipped projects. Check them out!",
    appId: 'projects',
    appLabel: 'Open Projects',
  },
  {
    question: 'Best way to reach you?',
    answer:
      'Email at kurtismquant@gmail.com, LinkedIn, or GitHub — all linked in the Contact section. Would love to connect!',
    appId: 'contact',
    appLabel: 'Open Contact',
  },
];

function SiriOrb({ active }: { active: boolean }) {
  return (
    <img
      src={siriIcon}
      width={18}
      height={18}
      alt=""
      style={{
        display: 'block',
        borderRadius: '50%',
        boxShadow: active ? '0 0 10px 3px rgba(168,85,247,0.55)' : 'none',
        animation: active ? 'siri-pulse 1.5s ease-in-out infinite' : 'none',
      }}
    />
  );
}

function SiriPanel({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<QA | null>(null);
  const [animating, setAnimating] = useState(false);
  const openApp = useWindowStore(s => s.openApp);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [onClose]);

  const handleSelect = (qa: QA) => {
    setSelected(qa);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  return createPortal(
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: PANEL_Z - 1 }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: PANEL_Z,
          width: 480,
          maxWidth: 'calc(100vw - 40px)',
          ...glassPanelVars,
          background: 'linear-gradient(145deg, rgba(45,27,94,0.82), rgba(34,18,76,0.78))',
          backdropFilter: 'blur(34px) saturate(1.45)',
          WebkitBackdropFilter: 'blur(34px) saturate(1.45)',
          borderRadius: 10,
          boxShadow: '0 24px 80px rgba(18,7,44,0.58), inset 0 1px 0 rgba(255,255,255,0.15)',
          border: '1px solid rgba(232,221,255,0.28)',
          fontFamily: 'var(--font-system)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '0.5px solid var(--color-card-border)',
        }}>
          <img
            src={siriIcon}
            width={36}
            height={36}
            alt=""
            style={{ display: 'block', borderRadius: '50%', animation: 'siri-pulse 2s ease-in-out infinite', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>Siri</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Ask me about Kurtis</div>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-tertiary)',
              fontSize: 16,
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Answer area */}
        {selected && (
          <div style={{
            padding: '14px 20px',
            background: 'var(--color-badge-bg)',
            borderBottom: '0.5px solid var(--color-card-border)',
          }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>
              {selected.question}
            </div>
            <div style={{
              fontSize: 14,
              color: 'var(--color-text-primary)',
              lineHeight: 1.6,
              opacity: animating ? 0 : 1,
              transition: 'opacity 0.25s',
            }}>
              {selected.answer}
            </div>
            {selected.appId && (
              <button
                onClick={() => { openApp(selected.appId!); onClose(); }}
                style={{
                  marginTop: 10,
                  background: 'var(--color-accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '5px 14px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-system)',
                }}
              >
                {selected.appLabel} →
              </button>
            )}
          </div>
        )}

        {/* Question list */}
        <div style={{ padding: '8px 0' }}>
          {QA_LIST.map(qa => (
            <button
              key={qa.question}
              onClick={() => handleSelect(qa)}
              style={{
                width: '100%',
                background: selected?.question === qa.question ? 'var(--color-badge-bg)' : 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '10px 20px',
                fontSize: 13,
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-system)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-badge-bg)'; }}
              onMouseLeave={e => {
                if (selected?.question !== qa.question) {
                  (e.currentTarget as HTMLElement).style.background = 'none';
                }
              }}
            >
              <span style={{ fontSize: 16 }}>💬</span>
              {qa.question}
            </button>
          ))}
        </div>
      </div>
    </>,
    document.body
  );
}

interface SiriButtonProps {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
}

export function SiriButton({ open: extOpen, onOpenChange: extSetOpen }: SiriButtonProps = {}) {
  const [localOpen, setLocalOpen] = useState(false);
  const open = extOpen !== undefined ? extOpen : localOpen;
  const setOpen = extSetOpen ?? setLocalOpen;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        title="Siri"
        aria-label="Ask Siri"
        style={{
          background: open ? 'rgba(255,255,255,0.15)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 6px',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <SiriOrb active={open} />
      </button>
      {open && <SiriPanel onClose={() => setOpen(false)} />}

      <style>{`
        @keyframes siri-pulse {
          0%, 100% { filter: brightness(1) saturate(1); transform: scale(1); }
          50% { filter: brightness(1.2) saturate(1.3); transform: scale(1.05); }
        }
      `}</style>
    </>
  );
}
