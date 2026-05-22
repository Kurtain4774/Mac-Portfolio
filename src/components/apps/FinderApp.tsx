import { useMemo, useState } from 'react';
import {
  AppWindow,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Cloud,
  Download,
  File,
  FileText,
  Folder,
  Grid3X3,
  HardDrive,
  List,
  CircleEllipsis,
  Search,
  Share,
  Tag,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AppId } from '../../types';
import { appMap } from '../../config/apps';
import { contact, experience, projects } from '../../config/content';
import { useWindowStore } from '../../stores/windowStore';
import './FinderApp.css';

type FinderSection =
  | 'airdrop'
  | 'downloads'
  | 'recents'
  | 'applications'
  | 'desktop'
  | 'users'
  | 'icloud'
  | 'documents'
  | 'shared'
  | 'macintosh'
  | 'bootcamp'
  | 'red'
  | 'blue'
  | 'portfolio';

type FinderIcon = 'folder' | 'file' | 'pdf' | 'app' | 'user' | 'project' | 'settings' | 'mail';

interface FinderItem {
  id: string;
  name: string;
  kind: string;
  lastOpened: string;
  group: string;
  section: FinderSection;
  location: string;
  icon: FinderIcon;
  appId?: AppId;
  tag?: FinderSection;
}

interface FinderAppProps {
  windowControls?: {
    isFocused: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
    isMaximized: boolean;
  };
}

interface SidebarItem {
  id: FinderSection;
  label: string;
  icon: LucideIcon;
  muted?: boolean;
  warning?: boolean;
}

const sidebarGroups: { label: string; items: SidebarItem[] }[] = [
  {
    label: 'Favorites',
    items: [
      { id: 'airdrop', label: 'AirDrop', icon: Circle },
      { id: 'downloads', label: 'Downloads', icon: Download },
      { id: 'recents', label: 'Recents', icon: Clock3 },
      { id: 'applications', label: 'Applications', icon: AppWindow },
      { id: 'desktop', label: 'Desktop', icon: Grid3X3 },
      { id: 'users', label: 'Users', icon: Users },
    ],
  },
  {
    label: 'iCloud',
    items: [
      { id: 'icloud', label: 'iCloud Drive', icon: Cloud, warning: true },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'shared', label: 'Shared', icon: Users },
    ],
  },
  {
    label: 'Locations',
    items: [
      { id: 'macintosh', label: 'Macintosh HD', icon: HardDrive, muted: true },
      { id: 'bootcamp', label: 'BOOTCAMP', icon: HardDrive, muted: true },
    ],
  },
  {
    label: 'Tags',
    items: [
      { id: 'red', label: 'Red', icon: Circle },
      { id: 'blue', label: 'Blue', icon: Circle },
      { id: 'portfolio', label: 'Portfolio', icon: Circle },
    ],
  },
];

const appItems: FinderItem[] = [
  { id: 'app-about', name: 'About.app', kind: 'Application', lastOpened: 'Today at 1:09 AM', group: 'Today', section: 'applications', location: 'Applications', icon: 'app', appId: 'about', tag: 'portfolio' },
  { id: 'app-work', name: 'Work.app', kind: 'Application', lastOpened: 'Today at 12:25 AM', group: 'Today', section: 'applications', location: 'Applications', icon: 'project', appId: 'projects', tag: 'portfolio' },
  { id: 'app-resume', name: 'Resume.app', kind: 'Application', lastOpened: 'Yesterday at 11:31 PM', group: 'Yesterday', section: 'applications', location: 'Applications', icon: 'pdf', appId: 'resume', tag: 'red' },
  { id: 'app-contact', name: 'Contact.app', kind: 'Application', lastOpened: 'May 21, 2026 at 7:16 PM', group: 'Previous 30 Days', section: 'applications', location: 'Applications', icon: 'user', appId: 'contact', tag: 'blue' },
  { id: 'app-settings', name: 'Settings.app', kind: 'Application', lastOpened: 'May 22, 2026 at 12:41 AM', group: 'Previous 30 Days', section: 'applications', location: 'Applications', icon: 'settings', appId: 'settings' },
  { id: 'app-mail', name: 'Mail.app', kind: 'Application', lastOpened: 'May 21, 2026 at 7:16 PM', group: 'Previous 30 Days', section: 'applications', location: 'Applications', icon: 'mail', appId: 'mail' },
];

const documentItems: FinderItem[] = [
  { id: 'doc-resume', name: 'Kurtis_Resume.pdf', kind: 'PDF document', lastOpened: 'Today at 1:09 AM', group: 'Today', section: 'documents', location: 'iCloud Drive > Documents', icon: 'pdf', appId: 'resume', tag: 'red' },
  { id: 'doc-profile', name: 'About Kurtis.txt', kind: 'Plain text document', lastOpened: 'Today at 12:25 AM', group: 'Today', section: 'documents', location: 'iCloud Drive > Documents', icon: 'file', appId: 'about', tag: 'portfolio' },
  { id: 'doc-contact', name: contact.email, kind: 'Internet location', lastOpened: 'Yesterday at 11:31 PM', group: 'Yesterday', section: 'documents', location: 'iCloud Drive > Documents', icon: 'mail', appId: 'mail', tag: 'blue' },
  ...experience.map((job, index): FinderItem => ({
    id: `doc-experience-${index}`,
    name: `${job.company} - ${job.role}.rtf`,
    kind: 'Rich text document',
    lastOpened: index === 0 ? 'May 4, 2026 at 12:52 AM' : 'Mar 21, 2026 at 12:36 AM',
    group: index === 0 ? 'Previous 30 Days' : 'March',
    section: 'documents',
    location: 'iCloud Drive > Documents',
    icon: 'file',
    appId: 'projects',
    tag: 'portfolio',
  })),
];

const desktopItems: FinderItem[] = [
  { id: 'desktop-portfolio', name: 'Portfolio Desktop', kind: 'Folder', lastOpened: 'Today at 1:09 AM', group: 'Today', section: 'desktop', location: 'iCloud Drive > Desktop', icon: 'folder', tag: 'portfolio' },
  { id: 'desktop-projects', name: 'Project Shortcuts', kind: 'Folder', lastOpened: 'Yesterday at 11:31 PM', group: 'Yesterday', section: 'desktop', location: 'iCloud Drive > Desktop', icon: 'folder', appId: 'projects', tag: 'portfolio' },
];

const projectItems: FinderItem[] = projects.map((project, index) => ({
  id: `project-${project.id}`,
  name: `${project.name}.webloc`,
  kind: 'Internet location',
  lastOpened: index < 2 ? 'May 4, 2026 at 12:52 AM' : 'Mar 10, 2026 at 4:06 AM',
  group: index < 2 ? 'Previous 30 Days' : 'March',
  section: 'downloads',
  location: 'Downloads',
  icon: 'project',
  appId: 'projects',
  tag: index % 2 === 0 ? 'portfolio' : 'blue',
}));

const systemItems: FinderItem[] = [
  { id: 'user-home', name: 'Kurtis', kind: 'Home folder', lastOpened: 'Today at 12:25 AM', group: 'Today', section: 'users', location: 'Users', icon: 'user' },
  { id: 'icloud-documents', name: 'Documents', kind: 'Folder', lastOpened: 'Today at 1:09 AM', group: 'Today', section: 'icloud', location: 'iCloud Drive', icon: 'folder' },
  { id: 'icloud-desktop', name: 'Desktop', kind: 'Folder', lastOpened: 'Yesterday at 11:31 PM', group: 'Yesterday', section: 'icloud', location: 'iCloud Drive', icon: 'folder' },
  { id: 'shared-folder', name: 'Shared Portfolio Links', kind: 'Shared folder', lastOpened: 'Mar 9, 2026 at 4:00 AM', group: 'March', section: 'shared', location: 'Shared', icon: 'folder', tag: 'blue' },
  { id: 'mac-applications', name: 'Applications', kind: 'Folder', lastOpened: 'Today at 12:25 AM', group: 'Today', section: 'macintosh', location: 'Macintosh HD', icon: 'folder' },
  { id: 'mac-users', name: 'Users', kind: 'Folder', lastOpened: 'Mar 9, 2026 at 3:19 AM', group: 'March', section: 'macintosh', location: 'Macintosh HD', icon: 'folder' },
  { id: 'bootcamp-empty', name: 'No items', kind: 'Unavailable', lastOpened: '--', group: 'BOOTCAMP', section: 'bootcamp', location: 'BOOTCAMP', icon: 'file' },
  { id: 'airdrop-nearby', name: 'Nearby devices', kind: 'AirDrop discovery', lastOpened: '--', group: 'AirDrop', section: 'airdrop', location: 'AirDrop', icon: 'user' },
];

const allItems = [...appItems, ...documentItems, ...desktopItems, ...projectItems, ...systemItems];
const groupOrder = ['Today', 'Yesterday', 'Previous 30 Days', 'March', 'AirDrop', 'BOOTCAMP'];

function FinderApp({ windowControls }: FinderAppProps) {
  const openApp = useWindowStore(s => s.openApp);
  const [selectedSection, setSelectedSection] = useState<FinderSection>('recents');
  const [selectedItemId, setSelectedItemId] = useState<string>(appItems[0].id);
  const [query, setQuery] = useState('');

  const selectedSidebarItem = sidebarGroups.flatMap(group => group.items).find(item => item.id === selectedSection);
  const normalizedQuery = query.trim().toLowerCase();

  const visibleItems = useMemo(() => {
    const sectionItems = selectedSection === 'recents'
      ? allItems.filter(item => item.section !== 'airdrop' && item.section !== 'bootcamp')
      : allItems.filter(item => item.section === selectedSection || item.tag === selectedSection);

    if (!normalizedQuery) return sectionItems;

    return allItems.filter(item => {
      const haystack = `${item.name} ${item.kind} ${item.location} ${item.group}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery, selectedSection]);

  const selectedItem = visibleItems.find(item => item.id === selectedItemId) ?? visibleItems[0];
  const title = normalizedQuery ? 'Search Results' : selectedSidebarItem?.label ?? 'Recents';

  const groupedItems = useMemo(() => {
    return groupOrder
      .map(group => ({ group, items: visibleItems.filter(item => item.group === group) }))
      .filter(entry => entry.items.length > 0);
  }, [visibleItems]);

  const openItem = (item: FinderItem) => {
    if (item.appId) openApp(item.appId);
  };

  return (
    <div className="finder-app">
      <aside className="finder-sidebar window-titlebar">
        <TrafficLights controls={windowControls} />

        <div className="finder-sidebar-scroll">
          {sidebarGroups.map(group => (
            <div className="finder-sidebar-group" key={group.label}>
              <div className="finder-sidebar-heading">{group.label}</div>
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = selectedSection === item.id && !normalizedQuery;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`finder-sidebar-item window-no-drag${isActive ? ' is-active' : ''}${item.muted ? ' is-muted' : ''}`}
                    onClick={() => {
                      setSelectedSection(item.id);
                      setQuery('');
                    }}
                    title={item.label}
                  >
                    <Icon className={item.id === 'red' ? 'tag-red' : item.id === 'blue' ? 'tag-blue' : ''} size={18} />
                    <span>{item.label}</span>
                    {item.warning && <span className="finder-warning">!</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      <main className="finder-main">
        <header className="finder-toolbar window-titlebar">
          <div className="finder-nav">
            <IconButton icon={ChevronLeft} label="Back" disabled />
            <IconButton icon={ChevronRight} label="Forward" disabled />
          </div>

          <h1 className="finder-title">{title}</h1>

          <div className="finder-toolbar-actions">
            <IconButton icon={List} label="List view" active />
            <IconButton icon={ChevronDown} label="Sort" />
            <IconButton icon={Grid3X3} label="Icon view" />
            <IconButton icon={Share} label="Share" />
            <IconButton icon={Tag} label="Tags" />
            <IconButton icon={CircleEllipsis} label="More" />
            <div className="finder-search window-no-drag">
              <Search size={16} />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search"
                aria-label="Search Finder"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} title="Clear search">
                  x
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="finder-list">
          <div className="finder-column-header">
            <span className="finder-name-col">{normalizedQuery ? 'Name' : 'Today'}</span>
            <span className="finder-kind-col">Kind</span>
            <span className="finder-date-col">Date Last Opened</span>
          </div>

          {groupedItems.length > 0 ? (
            groupedItems.map(group => (
              <section className="finder-group" key={group.group}>
                {group.group !== 'Today' && <h2>{group.group}</h2>}
                {group.items.map(item => (
                  <button
                    type="button"
                    key={item.id}
                    className={`finder-row window-no-drag${selectedItem?.id === item.id ? ' is-selected' : ''}`}
                    onClick={() => setSelectedItemId(item.id)}
                    onDoubleClick={() => openItem(item)}
                  >
                    <span className="finder-name-col">
                      <FileGlyph item={item} />
                      <span className="finder-row-name">{item.name}</span>
                    </span>
                    <span className="finder-kind-col">{item.kind}</span>
                    <span className="finder-date-col">{item.lastOpened}</span>
                  </button>
                ))}
              </section>
            ))
          ) : (
            <div className="finder-empty">
              <Search size={30} />
              <p>No Results</p>
            </div>
          )}
        </div>

        <footer className="finder-pathbar">
          <Cloud size={17} />
          <span>iCloud Drive</span>
          <ChevronRight size={14} />
          <span>{normalizedQuery ? 'Search' : title}</span>
          {selectedItem && (
            <>
              <ChevronRight size={14} />
              <FileGlyph item={selectedItem} small />
              <span>{selectedItem.name}</span>
            </>
          )}
        </footer>
      </main>
    </div>
  );
}

function TrafficLights({ controls }: { controls?: FinderAppProps['windowControls'] }) {
  return (
    <div className="finder-traffic-lights window-no-drag">
      <TrafficLight color="#ff5f57" dimmed={!controls?.isFocused} symbol="x" title="Close" onClick={controls?.onClose} />
      <TrafficLight color="#febc2e" dimmed={!controls?.isFocused} symbol="-" title="Minimize" onClick={controls?.onMinimize} />
      <TrafficLight color="#28c840" dimmed={!controls?.isFocused} symbol="+" title={controls?.isMaximized ? 'Restore' : 'Maximize'} onClick={controls?.onMaximize} />
    </div>
  );
}

function TrafficLight({
  color,
  dimmed,
  symbol,
  title,
  onClick,
}: {
  color: string;
  dimmed: boolean;
  symbol: string;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      className="finder-traffic-light"
      style={{ background: dimmed ? '#7b8388' : color }}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
    >
      <span>{symbol}</span>
    </button>
  );
}

function IconButton({
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
      className={`finder-icon-button window-no-drag${active ? ' is-active' : ''}`}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      <Icon size={22} />
    </button>
  );
}

function FileGlyph({ item, small = false }: { item: FinderItem; small?: boolean }) {
  const appIcon = item.appId ? appMap[item.appId]?.icon : undefined;
  const className = `finder-file-glyph${small ? ' is-small' : ''}`;

  if (item.icon === 'app' || item.icon === 'project' || item.icon === 'pdf' || item.icon === 'settings' || item.icon === 'mail' || item.icon === 'user') {
    return appIcon ? (
      <img className={className} src={appIcon} alt="" draggable={false} />
    ) : (
      <span className={`${className} is-generic`}>
        <File size={small ? 12 : 17} />
      </span>
    );
  }

  const Icon = item.icon === 'folder' ? Folder : FileText;
  return (
    <span className={`${className} is-generic${item.icon === 'folder' ? ' is-folder' : ''}`}>
      <Icon size={small ? 12 : 17} />
    </span>
  );
}

export default FinderApp;
