import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import {
  AppWindow,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleEllipsis,
  Clock3,
  Cloud,
  Download,
  FileText,
  Grid3X3,
  HardDrive,
  List,
  Search,
  Share,
  Tag,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTrashStore } from '../../stores/trashStore';
import { useDesktopStore } from '../../stores/desktopStore';
import { AppIcon } from '../shared/AppIcon';
import { appMap } from '../../config/apps';
import type { AppId, DesktopIconPosition } from '../../types';
import './TrashPanel.css';

function findFreePosition(positions: DesktopIconPosition[]): { col: number; row: number } {
  const occupied = new Set(positions.map(p => `${p.col},${p.row}`));
  for (let row = 0; row < 10; row++) {
    for (let col = 9; col >= 0; col--) {
      if (!occupied.has(`${col},${row}`)) return { col, row };
    }
  }
  return { col: 0, row: 0 };
}

interface Props {
  onClose: () => void;
}

interface TrashSidebarItem {
  label: string;
  icon: LucideIcon;
  muted?: boolean;
  warning?: boolean;
  tagClass?: string;
}

export function TrashPanel({ onClose }: Props) {
  const trashedApps = useTrashStore(s => s.trashedApps);
  const restoreFromTrash = useTrashStore(s => s.restoreFromTrash);
  const positions = useDesktopStore(s => s.positions);
  const restoreIcon = useDesktopStore(s => s.restoreIcon);
  const panelRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<AppId[]>([]);
  const [isMaximized, setIsMaximized] = useState(false);

  const trashedItems = useMemo(() => {
    return trashedApps
      .map(appId => appMap[appId])
      .filter(Boolean);
  }, [trashedApps]);

  useEffect(() => {
    setSelectedIds(current => current.filter(appId => trashedApps.includes(appId)));
  }, [trashedApps]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'Enter' && selectedIds.length > 0) {
        event.preventDefault();
        handleRestoreSelected();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, selectedIds]);

  const selectItem = (appId: AppId, event: MouseEvent<HTMLButtonElement>) => {
    setSelectedIds(current => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) {
        return current.includes(appId)
          ? current.filter(id => id !== appId)
          : [...current, appId];
      }
      return [appId];
    });
  };

  const handleRestoreItems = (appIds: AppId[]) => {
    if (appIds.length === 0) return;

    let currentPositions = [...positions];
    appIds.forEach(appId => {
      const { col, row } = findFreePosition(currentPositions);
      restoreFromTrash(appId);
      restoreIcon(appId, col, row);
      currentPositions = [...currentPositions, { appId, col, row }];
    });
    setSelectedIds([]);
  };

  const handleRestoreSelected = () => {
    handleRestoreItems(selectedIds);
  };

  const selectedCount = selectedIds.length;
  const restoreLabel = selectedCount > 1 ? `Restore ${selectedCount}` : 'Restore';

  const sidebarGroups: { label: string; items: TrashSidebarItem[] }[] = [
    {
      label: 'Favorites',
      items: [
        { label: 'AirDrop', icon: Circle },
        { label: 'Downloads', icon: Download },
        { label: 'Recents', icon: Clock3 },
        { label: 'Applications', icon: AppWindow },
        { label: 'Desktop', icon: Grid3X3 },
        { label: 'Users', icon: Users },
      ],
    },
    {
      label: 'iCloud',
      items: [
        { label: 'iCloud Drive', icon: Cloud, warning: true },
        { label: 'Documents', icon: FileText },
        { label: 'Desktop', icon: Grid3X3 },
        { label: 'Shared', icon: Users },
      ],
    },
    {
      label: 'Locations',
      items: [
        { label: 'Macintosh HD', icon: HardDrive, muted: true },
        { label: 'BOOTCAMP', icon: HardDrive, muted: true },
        { label: 'BOOTCAMP', icon: HardDrive, muted: true },
      ],
    },
    {
      label: 'Tags',
      items: [
        { label: 'Red', icon: Circle, tagClass: 'is-red' },
        { label: 'Orange', icon: Circle, tagClass: 'is-orange' },
        { label: 'Yellow', icon: Circle, tagClass: 'is-yellow' },
        { label: 'Green', icon: Circle, tagClass: 'is-green' },
        { label: 'Blue', icon: Circle, tagClass: 'is-blue' },
      ],
    },
  ];

  const stopWindowClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="trash-window-backdrop">
      <div
        ref={panelRef}
        className={`trash-window${isMaximized ? ' is-maximized' : ''}`}
        role="dialog"
        aria-label="Trash"
        onClick={stopWindowClick}
      >
        <aside className="trash-sidebar">
          <div className="trash-traffic-lights">
            <button type="button" className="trash-traffic-light is-close" title="Close" onClick={onClose}>
              <span>x</span>
            </button>
            <button type="button" className="trash-traffic-light is-minimize" title="Minimize" onClick={onClose}>
              <span>-</span>
            </button>
            <button
              type="button"
              className="trash-traffic-light is-maximize"
              title={isMaximized ? 'Restore' : 'Maximize'}
              onClick={() => setIsMaximized(value => !value)}
            >
              <span>+</span>
            </button>
          </div>

          <div className="trash-sidebar-scroll">
            {sidebarGroups.map(group => (
              <div className="trash-sidebar-group" key={group.label}>
                <div className="trash-sidebar-heading">{group.label}</div>
                {group.items.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      className={`trash-sidebar-item${item.muted ? ' is-muted' : ''}`}
                      key={`${group.label}-${item.label}`}
                      title={item.label}
                    >
                      <Icon className={item.tagClass ?? ''} size={18} />
                      <span>{item.label}</span>
                      {item.warning && <span className="trash-warning">!</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        <main className="trash-main">
          <header className="trash-toolbar">
            <div className="trash-nav">
              <ToolbarButton icon={ChevronLeft} label="Back" disabled />
              <ToolbarButton icon={ChevronRight} label="Forward" disabled />
            </div>

            <h1 className="trash-title">Trash</h1>

            <div className="trash-toolbar-actions">
              <ToolbarButton icon={Grid3X3} label="Icon view" active />
              <ToolbarButton icon={ChevronDown} label="Sort" />
              <ToolbarButton icon={List} label="List view" />
              <ToolbarButton icon={Share} label="Share" />
              <ToolbarButton icon={Tag} label="Tags" />
              <ToolbarButton icon={CircleEllipsis} label="More" />
              <div className="trash-search">
                <Search size={17} />
              </div>
            </div>
          </header>

          <div className="trash-subbar">
            <span>Trash</span>
            <button
              type="button"
              className="trash-restore-button"
              disabled={selectedCount === 0}
              onClick={handleRestoreSelected}
            >
              {restoreLabel}
            </button>
          </div>

          <section className="trash-content" onClick={() => setSelectedIds([])}>
            {trashedItems.length === 0 ? (
              <div className="trash-empty">
                <AppIcon appId="finder" size={46} />
                <p>Trash is empty</p>
              </div>
            ) : (
              <div className="trash-section">
                <div className="trash-section-header">
                  <h2>Previous 7 Days</h2>
                </div>
                <div className="trash-icon-grid">
                  {trashedItems.map(app => {
                    const isSelected = selectedIds.includes(app.id);
                    return (
                      <button
                        type="button"
                        key={app.id}
                        className={`trash-grid-item${isSelected ? ' is-selected' : ''}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          selectItem(app.id, event);
                        }}
                        onDoubleClick={(event) => {
                          event.stopPropagation();
                          handleRestoreItems(selectedIds.includes(app.id) ? selectedIds : [app.id]);
                        }}
                        aria-pressed={isSelected}
                        title={app.name}
                      >
                        <AppIcon appId={app.id} size={66} />
                        <span>{app.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          <footer className="trash-pathbar">
            <AppIcon appId="finder" size={17} />
            <span>Trash</span>
            {selectedCount > 0 && <span>{selectedCount} selected</span>}
          </footer>
        </main>
      </div>
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  label,
  disabled,
  active,
}: {
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`trash-toolbar-button${active ? ' is-active' : ''}`}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      <Icon size={22} />
    </button>
  );
}
