import { useWindowStore } from '../../stores/windowStore';
import type { AppId } from '../../types';

interface CrossNavLinkProps {
  to: AppId;
  label: string;
  minimizeSourceId?: string;
}

export function CrossNavLink({ to, label, minimizeSourceId }: CrossNavLinkProps) {
  const openApp = useWindowStore(s => s.openApp);
  const minimizeWindow = useWindowStore(s => s.minimizeWindow);

  const handle = () => {
    if (minimizeSourceId) minimizeWindow(minimizeSourceId);
    openApp(to);
  };

  return (
    <button
      onClick={handle}
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--color-accent)',
        cursor: 'pointer',
        fontSize: 'inherit',
        fontFamily: 'inherit',
        padding: 0,
        textDecoration: 'underline',
        textUnderlineOffset: '2px',
      }}
    >
      {label}
    </button>
  );
}
