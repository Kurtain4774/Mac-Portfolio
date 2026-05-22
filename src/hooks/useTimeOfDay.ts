import { useState, useEffect } from 'react';
import type { TimeOfDay } from '../types';

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 21) return 'evening';
  return 'night';
}

export function useTimeOfDay() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const hour = now.getHours();
  return {
    now,
    timeOfDay: getTimeOfDay(hour),
    timeString: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
