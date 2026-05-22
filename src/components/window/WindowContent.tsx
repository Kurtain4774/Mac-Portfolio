import { Suspense } from 'react';
import { appMap } from '../../config/apps';
import type { AppId } from '../../types';

interface Props {
  appId: AppId;
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

export function WindowContent({ appId }: Props) {
  const app = appMap[appId];
  const AppComponent = app.component;

  return (
    <div
      className="window-content-area"
      style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Suspense fallback={<Loading />}>
        <AppComponent />
      </Suspense>
    </div>
  );
}
