import type { WindowState } from '../../types';

interface Props {
  win: WindowState;
  isFocused: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

export function WindowTitleBar({ win, isFocused, onClose, onMinimize, onMaximize }: Props) {
  const appName = win.appId.charAt(0).toUpperCase() + win.appId.slice(1);

  return (
    <div
      className="window-titlebar"
      style={{
        height: 44,
        background: 'var(--color-titlebar-bg)',
        borderBottom: '1px solid var(--color-titlebar-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 8,
        flexShrink: 0,
        cursor: 'default',
        borderRadius: 'var(--radius-window) var(--radius-window) 0 0',
      }}
    >
      {/* Traffic lights */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
        <TrafficLight
          color="#ff5f57"
          hoverColor="#ff3b30"
          isFocused={isFocused}
          symbol="✕"
          onClick={onClose}
          title="Close"
        />
        <TrafficLight
          color="#febc2e"
          hoverColor="#ff9500"
          isFocused={isFocused}
          symbol="−"
          onClick={onMinimize}
          title="Minimize"
        />
        <TrafficLight
          color="#28c840"
          hoverColor="#34c759"
          isFocused={isFocused}
          symbol="+"
          onClick={onMaximize}
          title={win.maximized ? 'Restore' : 'Maximize'}
        />
      </div>

      {/* Title */}
      <span
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 500,
          color: isFocused ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
          fontFamily: 'var(--font-system)',
          letterSpacing: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {appName}
      </span>

      {/* Spacer to balance traffic lights */}
      <div style={{ width: 54, flexShrink: 0 }} />
    </div>
  );
}

interface TrafficLightProps {
  color: string;
  hoverColor: string;
  isFocused: boolean;
  symbol: string;
  onClick: () => void;
  title: string;
}

function TrafficLight({ color, isFocused, symbol, onClick, title }: TrafficLightProps) {
  return (
    <button
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="traffic-light"
      style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        border: 'none',
        background: isFocused ? color : '#d1d1d1',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        fontSize: 8,
        lineHeight: 1,
        color: 'rgba(0,0,0,0.5)',
        fontWeight: 700,
        transition: 'opacity 0.1s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
        const span = e.currentTarget.querySelector('span');
        if (span) (span as HTMLElement).style.opacity = '1';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.opacity = '1';
        const span = e.currentTarget.querySelector('span');
        if (span) (span as HTMLElement).style.opacity = '0';
      }}
    >
      <span style={{ opacity: 0, transition: 'opacity 0.1s', fontSize: 7, fontWeight: 900 }}>
        {symbol}
      </span>
    </button>
  );
}
