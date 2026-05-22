import { lazy, type ComponentType } from 'react';
import type { AppId } from '../types';
import { contact } from './content';

import notesIcon from '../assets/icons/notes_256x256x32.png';
import folderIcon from '../assets/icons/folder_256x256x32.png';
import contactsIcon from '../assets/icons/contacts_256x256x32.png';
import mailIcon from '../assets/icons/mail_256x256x32.png';
import pdfIcon from '../assets/icons/pdf_256x256x32.png';
import systemPrefsIcon from '../assets/icons/system_preferences_256x256x32.png';
import finderIcon from '../assets/icons/finder_256x256x32.png';
import launchpadIcon from '../assets/icons/launchpad_256x256x32.png';

export interface AppConfig {
  id: AppId;
  name: string;
  dockOrder: number;
  icon: string;
  component?: ReturnType<typeof lazy<ComponentType>>;
  mailto?: string;
}

export const apps: AppConfig[] = [
  {
    id: 'finder',
    name: 'Finder',
    dockOrder: 1,
    icon: finderIcon,
    component: lazy(() => import('../components/apps/FinderApp')),
  },
  {
    id: 'launchpad',
    name: 'Launchpad',
    dockOrder: 2,
    icon: launchpadIcon,
    component: lazy(() => import('../components/apps/LaunchpadApp')),
  },
  {
    id: 'about',
    name: 'About',
    dockOrder: 3,
    icon: notesIcon,
    component: lazy(() => import('../components/apps/AboutApp')),
  },
  {
    id: 'projects',
    name: 'Work',
    dockOrder: 4,
    icon: folderIcon,
    component: lazy(() => import('../components/apps/WorkApp')),
  },
  {
    id: 'contact',
    name: 'Contact',
    dockOrder: 5,
    icon: contactsIcon,
    component: lazy(() => import('../components/apps/ContactApp')),
  },
  {
    id: 'mail',
    name: 'Mail',
    dockOrder: 6,
    icon: mailIcon,
    mailto: contact.email,
  },
  {
    id: 'resume',
    name: 'Resume',
    dockOrder: 7,
    icon: pdfIcon,
    component: lazy(() => import('../components/apps/ResumeApp')),
  },
  {
    id: 'settings',
    name: 'Settings',
    dockOrder: 8,
    icon: systemPrefsIcon,
    component: lazy(() => import('../components/apps/SettingsApp')),
  },
];

export const appMap = Object.fromEntries(apps.map(a => [a.id, a])) as Record<AppId, AppConfig>;
