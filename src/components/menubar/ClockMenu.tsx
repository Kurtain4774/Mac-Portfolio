import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTimeOfDay } from '../../hooks/useTimeOfDay';
import { useSystemStore } from '../../stores/systemStore';
import { useWindowStore } from '../../stores/windowStore';

const PANEL_Z = 9700;
const MENUBAR_H = 28;

// ─── Calendar widget ──────────────────────────────────────────────────────────

function CalendarWidget({ now }: { now: Date }) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const monthName = now.toLocaleDateString([], { month: 'long' });
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ padding: '12px 14px', fontFamily: 'var(--font-system)' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {monthName} {year}
        </span>
      </div>
      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
        {dayNames.map(d => (
          <div key={d} style={{ fontSize: 10, color: 'var(--color-text-tertiary)', textAlign: 'center', fontWeight: 500 }}>
            {d}
          </div>
        ))}
      </div>
      {/* Day cells */}
      {Array.from({ length: cells.length / 7 }, (_, row) => (
        <div key={row} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {cells.slice(row * 7, row * 7 + 7).map((day, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                background: day === today ? 'var(--color-accent)' : 'transparent',
                color: day === today ? '#fff' : day ? 'var(--color-text-primary)' : 'transparent',
                fontWeight: day === today ? 700 : 400,
                userSelect: 'none',
              }}
            >
              {day}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Notification card ────────────────────────────────────────────────────────

interface NotifCardProps {
  icon: string;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}

function NotifCard({ icon, title, body, action, onAction }: NotifCardProps) {
  return (
    <div style={{
      margin: '0 12px',
      background: 'var(--color-badge-bg)',
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 8,
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>
            {title}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
            {body}
          </div>
          {action && onAction && (
            <button
              onClick={onAction}
              style={{
                marginTop: 6,
                background: 'var(--color-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 5,
                padding: '3px 10px',
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: 'var(--font-system)',
              }}
            >
              {action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Notification Center panel ────────────────────────────────────────────────

function NotificationCenter({ onClose, triggerRight }: { onClose: () => void; triggerRight: number }) {
  const { now } = useTimeOfDay();
  const focus = useSystemStore(s => s.focus);
  const openApp = useWindowStore(s => s.openApp);

  return createPortal(
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: PANEL_Z - 1 }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: MENUBAR_H,
          right: triggerRight,
          zIndex: PANEL_Z,
          width: 320,
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
          background: 'var(--color-panel-bg)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          border: '0.5px solid var(--color-card-border)',
          fontFamily: 'var(--font-system)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <CalendarWidget now={now} />

        <div style={{
          height: '0.5px',
          background: 'var(--color-card-border)',
          margin: '0 12px',
        }} />

        {/* Notifications */}
        <div style={{ padding: '10px 0 12px' }}>
          {focus ? (
            <div style={{
              padding: '12px 14px',
              fontSize: 12,
              color: 'var(--color-text-tertiary)',
              textAlign: 'center',
            }}>
              🌙 Focus is on — notifications silenced
            </div>
          ) : (
            <>
              <div style={{ padding: '4px 14px 8px', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Notifications
              </div>
              <NotifCard
                icon="💻"
                title="Welcome to MacPortfolio"
                body="Explore Kurtis's work by clicking any app on the desktop or dock."
              />
              <NotifCard
                icon="📄"
                title="Download my resume"
                body="Get the PDF version of my resume in one click."
                action="Open Resume"
                onAction={() => { openApp('resume'); onClose(); }}
              />
              <NotifCard
                icon="🚀"
                title="Latest project: SoundSage"
                body="AI-powered music discovery app built with React + Gemini API."
                action="View Projects"
                onAction={() => { openApp('projects'); onClose(); }}
              />
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

// ─── Clock menu button (trigger in menu bar) ──────────────────────────────────

export function ClockMenu() {
  const [open, setOpen] = useState(false);
  const { timeString, dateString } = useTimeOfDay();
  const [triggerRight, setTriggerRight] = useState(8);

  const setRef = useCallback((el: HTMLButtonElement | null) => {
    if (el) {
      const rect = el.getBoundingClientRect();
      setTriggerRight(window.innerWidth - rect.right);
    }
  }, []);

  return (
    <>
      <button
        ref={setRef}
        onClick={() => setOpen(v => !v)}
        style={{
          background: open ? 'rgba(255,255,255,0.22)' : 'none',
          border: 'none',
          cursor: 'default',
          color: '#ffffff',
          fontSize: 13,
          fontFamily: 'var(--font-system)',
          fontWeight: 500,
          padding: '2px 8px',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          flexShrink: 0,
          height: MENUBAR_H,
          whiteSpace: 'nowrap',
        }}
        aria-label="Open Notification Center"
      >
        <span style={{ opacity: 0.85 }}>{dateString}</span>
        <span>{timeString}</span>
      </button>
      {open && (
        <NotificationCenter
          onClose={() => setOpen(false)}
          triggerRight={triggerRight}
        />
      )}
    </>
  );
}
