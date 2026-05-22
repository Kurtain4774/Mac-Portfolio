import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search } from 'lucide-react';
import { apps } from '../../config/apps';
import { projects } from '../../config/content';
import { useWindowStore } from '../../stores/windowStore';
import type { AppId } from '../../types';

const OVERLAY_Z = 9800;

type Result =
  | { kind: 'app'; id: AppId; name: string }
  | { kind: 'project'; id: string; name: string };

function getResults(query: string): Result[] {
  const q = query.toLowerCase();
  if (!q) return [];

  const appResults: Result[] = apps
    .filter(a => a.name.toLowerCase().includes(q) || a.id.includes(q))
    .map(a => ({ kind: 'app', id: a.id, name: a.name }));

  const projectResults: Result[] = projects
    .filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    .map(p => ({ kind: 'project', id: p.id, name: p.name }));

  return [...appResults, ...projectResults];
}

function SpotlightOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openApp = useWindowStore(s => s.openApp);

  const results = getResults(query);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx(i => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results.length > 0) {
        activate(results[selectedIdx]);
      }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [results, selectedIdx, onClose]);

  function activate(result: Result) {
    if (result.kind === 'app') openApp(result.id);
    else openApp('projects');
    onClose();
  }

  const appResults = results.filter(r => r.kind === 'app');
  const projectResults = results.filter(r => r.kind === 'project');
  const hasResults = results.length > 0;

  return createPortal(
    <>
      {/* backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: OVERLAY_Z - 1, background: 'rgba(0,0,0,0.25)' }}
        onClick={onClose}
      />

      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: OVERLAY_Z,
          width: 620,
          maxWidth: 'calc(100vw - 40px)',
          background: 'var(--color-dropdown-bg)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          border: '0.5px solid var(--color-card-border)',
          overflow: 'hidden',
          fontFamily: 'var(--font-system)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          borderBottom: hasResults ? '0.5px solid var(--color-card-border)' : 'none',
        }}>
          <Search size={18} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Spotlight Search"
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: 18,
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-system)',
              caretColor: 'var(--color-accent)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'var(--color-text-tertiary)',
                border: 'none',
                borderRadius: '50%',
                width: 16,
                height: 16,
                fontSize: 10,
                color: 'var(--color-dropdown-bg)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Results */}
        {hasResults && (
          <div style={{ maxHeight: 360, overflowY: 'auto', padding: '4px 0' }}>
            {appResults.length > 0 && (
              <Section
                title="Applications"
                items={appResults}
                results={results}
                selectedIdx={selectedIdx}
                onSelect={(r) => { setSelectedIdx(results.indexOf(r)); activate(r); }}
              />
            )}
            {projectResults.length > 0 && (
              <Section
                title="Projects"
                items={projectResults}
                results={results}
                selectedIdx={selectedIdx}
                onSelect={(r) => { setSelectedIdx(results.indexOf(r)); activate(r); }}
              />
            )}
          </div>
        )}

        {query && !hasResults && (
          <div style={{
            padding: '20px 16px',
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
          }}>
            No results for "{query}"
          </div>
        )}
      </div>
    </>,
    document.body
  );
}

function Section({
  title,
  items,
  results,
  selectedIdx,
  onSelect,
}: {
  title: string;
  items: Result[];
  results: Result[];
  selectedIdx: number;
  onSelect: (r: Result) => void;
}) {
  return (
    <>
      <div style={{
        padding: '6px 14px 2px',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--color-text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {title}
      </div>
      {items.map(item => {
        const globalIdx = results.indexOf(item);
        const isSelected = globalIdx === selectedIdx;
        return (
          <div
            key={item.id}
            onMouseEnter={() => {}}
            onClick={() => onSelect(item)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 14px',
              cursor: 'default',
              background: isSelected ? 'var(--color-item-hover-bg)' : 'transparent',
              color: isSelected ? 'var(--color-item-hover-text)' : 'var(--color-text-primary)',
              fontSize: 14,
            }}
          >
            <span>{item.name}</span>
            <span style={{ fontSize: 11, opacity: 0.7 }}>
              {item.kind === 'app' ? 'Application' : 'Open in Projects'}
            </span>
          </div>
        );
      })}
    </>
  );
}

// ─── Spotlight button (trigger in menu bar) ───────────────────────────────────

export function SpotlightButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        setOpen(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        title="Spotlight Search (⌘Space)"
        aria-label="Spotlight Search"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'default',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          padding: '2px 6px',
          borderRadius: 4,
          flexShrink: 0,
        }}
      >
        <Search size={14} />
      </button>
      {open && <SpotlightOverlay onClose={() => setOpen(false)} />}
    </>
  );
}
