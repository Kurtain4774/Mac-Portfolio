import { useState } from 'react';
import { History } from 'lucide-react';
import { MenuBarMenu, MenuItem, MenuSeparator } from './MenuBarMenu';

export function TimeMachineMenu() {
  const [open, setOpen] = useState(false);

  return (
    <MenuBarMenu
      open={open}
      onOpenChange={setOpen}
      align="right"
      minWidth={210}
      label={<History size={14} />}
    >
      <div style={{ padding: '6px 12px 4px', userSelect: 'none' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>
          Time Machine
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
          Backing Up…
        </div>
        {/* fake progress bar */}
        <div style={{
          height: 3,
          background: 'var(--color-badge-bg)',
          borderRadius: 2,
          marginTop: 8,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: '62%',
            background: 'var(--color-accent)',
            borderRadius: 2,
          }} />
        </div>
      </div>
      <MenuSeparator />
      <MenuItem label="Back Up Now" onClick={() => setOpen(false)} />
      <MenuItem label="Enter Time Machine" onClick={() => setOpen(false)} />
      <MenuSeparator />
      <MenuItem label="Open Time Machine Settings" disabled />
    </MenuBarMenu>
  );
}
