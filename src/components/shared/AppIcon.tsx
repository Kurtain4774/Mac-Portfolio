import { appMap } from '../../config/apps';
import type { AppId } from '../../types';

interface AppIconProps {
  appId: AppId;
  size?: number;
  className?: string;
}

export function AppIcon({ appId, size = 60, className }: AppIconProps) {
  const app = appMap[appId];
  return (
    <img
      className={className}
      src={app.icon}
      alt={app.name}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        flexShrink: 0,
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.28))',
        pointerEvents: 'none',
        display: 'block',
      }}
      draggable={false}
    />
  );
}
