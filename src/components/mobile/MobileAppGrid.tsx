import { AppIcon } from '../shared/AppIcon';
import { apps, appMap } from '../../config/apps';
import type { AppId } from '../../types';

interface Props {
  onOpen: (appId: AppId) => void;
}

export function MobileAppGrid({ onOpen }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px 12px',
        padding: '24px 20px',
      }}
    >
      {apps.sort((a, b) => a.dockOrder - b.dockOrder).map(app => (
        <button
          key={app.id}
          onClick={() => {
            const cfg = appMap[app.id];
            if (cfg?.mailto) {
              window.location.href = `mailto:${cfg.mailto}`;
              return;
            }
            onOpen(app.id);
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            padding: 0,
          }}
        >
          <AppIcon appId={app.id} size={64} />
          <span style={{
            fontSize: 11,
            color: '#fff',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            fontFamily: 'var(--font-system)',
            fontWeight: 500,
          }}>
            {app.name}
          </span>
        </button>
      ))}
    </div>
  );
}
