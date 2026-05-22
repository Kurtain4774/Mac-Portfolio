import { useState, useEffect } from 'react';

export interface BatteryInfo {
  level: number;
  charging: boolean;
  supported: boolean;
}

export function useBattery(): BatteryInfo {
  const [info, setInfo] = useState<BatteryInfo>({ level: 1, charging: true, supported: false });

  useEffect(() => {
    if (!('getBattery' in navigator)) return;

    let battery: any = null;

    const update = (b: any) => setInfo({ level: b.level, charging: b.charging, supported: true });
    const onChange = () => { if (battery) update(battery); };

    (navigator as any).getBattery().then((b: any) => {
      battery = b;
      update(b);
      b.addEventListener('levelchange', onChange);
      b.addEventListener('chargingchange', onChange);
    }).catch(() => {});

    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', onChange);
        battery.removeEventListener('chargingchange', onChange);
      }
    };
  }, []);

  return info;
}
