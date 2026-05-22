import { useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { motion } from 'framer-motion';
import { useWindowStore } from '../../stores/windowStore';
import { WindowTitleBar } from './WindowTitleBar';
import { WindowContent } from './WindowContent';
import type { WindowState } from '../../types';

interface Props {
  win: WindowState;
}

export function Window({ win }: Props) {
  const focusWindow = useWindowStore(s => s.focusWindow);
  const closeWindow = useWindowStore(s => s.closeWindow);
  const minimizeWindow = useWindowStore(s => s.minimizeWindow);
  const maximizeWindow = useWindowStore(s => s.maximizeWindow);
  const updateGeometry = useWindowStore(s => s.updateGeometry);
  const focusedWindowId = useWindowStore(s => s.focusedWindowId);
  const isFocused = focusedWindowId === win.id;

  const [animState, setAnimState] = useState<'enter' | 'idle' | 'exit'>('enter');
  const isFinder = win.appId === 'finder';

  const handleClose = useCallback(() => {
    setAnimState('exit');
    setTimeout(() => closeWindow(win.id), 160);
  }, [win.id, closeWindow]);

  const handleMinimize = useCallback(() => {
    setAnimState('exit');
    setTimeout(() => minimizeWindow(win.id), 160);
  }, [win.id, minimizeWindow]);

  return (
    <Rnd
      position={{ x: win.x, y: win.y }}
      size={{ width: win.width, height: win.height }}
      minWidth={400}
      minHeight={300}
      bounds="parent"
      dragHandleClassName="window-titlebar"
      cancel=".window-no-drag, input, textarea, button, a, select"
      enableResizing={!win.maximized}
      disableDragging={win.maximized}
      style={{ zIndex: win.zIndex, position: 'absolute' }}
      onDragStart={() => focusWindow(win.id)}
      onDragStop={(_e, d) => {
        updateGeometry(win.id, d.x, d.y, win.width, win.height);
      }}
      onResizeStop={(_e, _dir, ref, _delta, pos) => {
        updateGeometry(
          win.id,
          pos.x,
          pos.y,
          parseInt(ref.style.width),
          parseInt(ref.style.height)
        );
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      <motion.div
        className={`window${isFocused ? ' window--focused' : ''}`}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={
          animState === 'exit'
            ? { scale: 0.85, opacity: 0 }
            : animState === 'enter'
            ? { scale: 1, opacity: 1 }
            : { scale: 1, opacity: 1 }
        }
        onAnimationComplete={() => {
          if (animState === 'enter') setAnimState('idle');
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{ width: '100%', height: '100%' }}
      >
        {!isFinder && (
          <WindowTitleBar
            win={win}
            isFocused={isFocused}
            onClose={handleClose}
            onMinimize={handleMinimize}
            onMaximize={() => maximizeWindow(win.id)}
          />
        )}
        <WindowContent
          appId={win.appId}
          windowControls={{
            isFocused,
            onClose: handleClose,
            onMinimize: handleMinimize,
            onMaximize: () => maximizeWindow(win.id),
            isMaximized: win.maximized,
          }}
        />
      </motion.div>
    </Rnd>
  );
}
