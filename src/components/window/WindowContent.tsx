import { Suspense } from 'react';
import { appMap } from '../../config/apps';
import type { AppId } from '../../types';

interface Props {
  appId: AppId;
  windowControls?: {
    isFocused: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
    isMaximized: boolean;
  };
}

function Loading() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-tertiary)',
        fontSize: 14,
      }}
    >
      Loading…
    </div>
  );
}

export function WindowContent({ appId, windowControls }: Props) {
  const app = appMap[appId];
  if (!app.component) return null;
  const AppComponent = app.component;

  return (
    <div
      className="window-content-area"
      style={{
        flex: 1,
        overflow: appId === 'finder' ? 'hidden' : 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Suspense fallback={<Loading />}>
        <AppComponent windowControls={windowControls} />
      </Suspense>
    </div>
  );
}
