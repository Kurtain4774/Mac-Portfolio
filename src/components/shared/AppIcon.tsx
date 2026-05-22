import { type FC } from 'react';
import { appMap } from '../../config/apps';
import type { AppId } from '../../types';

interface AppIconProps {
  appId: AppId;
  size?: number;
  className?: string;
}

// Each icon renders into a 60×60 SVG viewBox
const AboutIcon: FC = () => (
  <>
    <circle cx="30" cy="21" r="11.5" fill="white" />
    <path d="M8 55C8 40.5 18 34 30 34C42 34 52 40.5 52 55" fill="white" />
  </>
);

const ExperienceIcon: FC = () => (
  <>
    <rect x="10" y="26" width="40" height="26" rx="5" fill="white" />
    <path
      d="M22 26V21C22 18.2 24.2 16 27 16H33C35.8 16 38 18.2 38 21V26"
      stroke="white"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    <rect x="10" y="36" width="40" height="4" fill="rgba(0,0,0,0.1)" />
    <rect x="27" y="34" width="6" height="8" rx="2" fill="rgba(0,0,0,0.12)" />
    <rect x="28.5" y="35.5" width="3" height="5" rx="1" fill="rgba(255,255,255,0.7)" />
  </>
);

const ProjectsIcon: FC = () => (
  <>
    <path d="M22 14L8 30L22 46" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M38 14L52 30L38 46" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M36 12L24 48" stroke="white" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
  </>
);

const ContactIcon: FC = () => (
  <>
    <rect x="7" y="16" width="46" height="32" rx="5" fill="white" />
    <path d="M7 21L30 36L53 21" stroke="rgba(0,0,0,0.09)" strokeWidth="2" fill="none" />
    <path d="M7 48L25 34" stroke="rgba(0,0,0,0.07)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M53 48L35 34" stroke="rgba(0,0,0,0.07)" strokeWidth="1.5" strokeLinecap="round" />
  </>
);

const ResumeIcon: FC = () => (
  <>
    <path
      d="M13 5H39L51 17V57C51 57.6 50.6 58 50 58H13C12.4 58 12 57.6 12 57V6C12 5.4 12.4 5 13 5Z"
      fill="white"
    />
    <path d="M39 5L51 17H41C39.9 17 39 16.1 39 15V5Z" fill="rgba(200,70,50,0.2)" />
    <rect x="18" y="24" width="20" height="2.5" rx="1.2" fill="rgba(200,60,40,0.5)" />
    <rect x="18" y="30" width="26" height="2" rx="1" fill="rgba(180,50,40,0.25)" />
    <rect x="18" y="35" width="22" height="2" rx="1" fill="rgba(180,50,40,0.25)" />
    <rect x="18" y="40" width="24" height="2" rx="1" fill="rgba(180,50,40,0.25)" />
    <rect x="18" y="45" width="16" height="2" rx="1" fill="rgba(180,50,40,0.2)" />
  </>
);

const SettingsIcon: FC = () => (
  <g transform="translate(30,30)">
    <circle r="19" fill="white" />
    {Array.from({ length: 8 }, (_, i) => (
      <rect
        key={i}
        x="-5"
        y="-24"
        width="10"
        height="12"
        rx="2.5"
        fill="white"
        transform={`rotate(${i * 45})`}
      />
    ))}
    <circle r="9" fill="rgba(0,0,0,0.28)" />
    <circle r="6" fill="rgba(0,0,0,0.18)" />
  </g>
);

const ICONS: Record<AppId, FC> = {
  about: AboutIcon,
  experience: ExperienceIcon,
  projects: ProjectsIcon,
  contact: ContactIcon,
  resume: ResumeIcon,
  settings: SettingsIcon,
};

export function AppIcon({ appId, size = 60, className }: AppIconProps) {
  const app = appMap[appId];
  const IconContent = ICONS[appId];
  const svgSize = Math.round(size * 0.78);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '22%',
        background: app.iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <svg
        viewBox="0 0 60 60"
        width={svgSize}
        height={svgSize}
        fill="none"
        style={{ display: 'block' }}
      >
        <IconContent />
      </svg>
      {/* Glass highlight shimmer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.2) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
