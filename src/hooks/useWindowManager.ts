import { useEffect } from 'react';
import { useWindowStore } from '../stores/windowStore';

export function useWindowManager() {
  const focusedWindowId = useWindowStore(s => s.focusedWindowId);
  const closeWindow = useWindowStore(s => s.closeWindow);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusedWindowId) {
        closeWindow(focusedWindowId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [focusedWindowId, closeWindow]);
}
