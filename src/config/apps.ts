import { lazy, type ComponentType } from 'react';
import type { AppId } from '../types';

export interface AppConfig {
  id: AppId;
  name: string;
  dockOrder: number;
  iconBg: string;
  iconColor: string;
  component: ReturnType<typeof lazy<ComponentType>>;
}

export const apps: AppConfig[] = [
  {
    id: 'about',
    name: 'About',
    dockOrder: 1,
    iconBg: 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
    iconColor: '#ffffff',
    component: lazy(() => import('../components/apps/AboutApp')),
  },
  {
    id: 'experience',
    name: 'Experience',
    dockOrder: 2,
    iconBg: 'linear-gradient(135deg, #b5732d 0%, #d4944a 100%)',
    iconColor: '#ffffff',
    component: lazy(() => import('../components/apps/ExperienceApp')),
  },
  {
    id: 'projects',
    name: 'Projects',
    dockOrder: 3,
    iconBg: 'linear-gradient(135deg, #0f9d58 0%, #34c77b 100%)',
    iconColor: '#ffffff',
    component: lazy(() => import('../components/apps/ProjectsApp')),
  },
  {
    id: 'contact',
    name: 'Contact',
    dockOrder: 4,
    iconBg: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
    iconColor: '#ffffff',
    component: lazy(() => import('../components/apps/ContactApp')),
  },
  {
    id: 'resume',
    name: 'Resume',
    dockOrder: 5,
    iconBg: 'linear-gradient(135deg, #ea4335 0%, #f97316 100%)',
    iconColor: '#ffffff',
    component: lazy(() => import('../components/apps/ResumeApp')),
  },
  {
    id: 'settings',
    name: 'Settings',
    dockOrder: 6,
    iconBg: 'linear-gradient(135deg, #636366 0%, #8e8e93 100%)',
    iconColor: '#ffffff',
    component: lazy(() => import('../components/apps/SettingsApp')),
  },
];

export const appMap = Object.fromEntries(apps.map(a => [a.id, a])) as Record<AppId, AppConfig>;
