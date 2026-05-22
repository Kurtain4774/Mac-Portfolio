import { useRef, useState, useCallback } from 'react';

const MAX_SCALE = 1.65;
const MIN_SCALE = 1.0;

export function useDockMagnification(count: number) {
  const dockRef = useRef<HTMLDivElement>(null);
  const [scales, setScales] = useState<number[]>(() => Array(count).fill(MIN_SCALE));

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dockRef.current) return;
    const mouseX = e.clientX;
    const icons = dockRef.current.querySelectorAll<HTMLElement>('[data-dock-index]');
    const newScales = Array(count).fill(MIN_SCALE);
    let closestIdx = -1;
    let closestDist = Infinity;
    icons.forEach((icon) => {
      const idx = parseInt(icon.dataset.dockIndex ?? '0', 10);
      const rect = icon.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dist = Math.abs(mouseX - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });
    if (closestIdx >= 0) {
      newScales[closestIdx] = MAX_SCALE;
    }
    setScales(newScales);
  }, [count]);

  const onMouseLeave = useCallback(() => {
    setScales(Array(count).fill(MIN_SCALE));
  }, [count]);

  return { dockRef, scales, onMouseMove, onMouseLeave };
}
