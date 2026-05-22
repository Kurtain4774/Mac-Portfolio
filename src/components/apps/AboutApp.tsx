import { User } from 'lucide-react';
import { profile, techStack } from '../../config/content';
import { CrossNavLink } from '../shared/CrossNavLink';
import { useWindowStore } from '../../stores/windowStore';

export default function AboutApp() {
  const focusedWindowId = useWindowStore(s => s.focusedWindowId);

  return (
    <div style={{ padding: 32, fontFamily: 'var(--font-content)', color: 'var(--color-text-primary)', maxWidth: 640, width: '100%', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a73e8, #4285f4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          {profile.avatarUrl
            ? <img src={profile.avatarUrl} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <User size={36} color="#fff" />}
        </div>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1, marginBottom: 4 }}>{profile.name}</h1>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{profile.title}</p>
        </div>
      </div>

      {/* Bio */}
      <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        {profile.bio}
      </p>

      {/* Stats row */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 28,
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'School', value: profile.school },
          { label: 'Location', value: profile.location },
          { label: 'Focus', value: profile.focus },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--color-badge-bg)',
            border: '1px solid var(--color-card-border)',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 13,
          }}>
            <span style={{ color: 'var(--color-text-tertiary)', display: 'block', marginBottom: 2 }}>{stat.label}</span>
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        Tech Stack
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
        {techStack.map(tech => (
          <span key={tech.name} style={{
            background: 'var(--color-badge-bg)',
            color: 'var(--color-badge-text)',
            border: '1px solid var(--color-card-border)',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 500,
          }}>
            {tech.name}
          </span>
        ))}
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 14 }}>
        <CrossNavLink to="projects" label="View my Work →" minimizeSourceId={focusedWindowId ?? undefined} />
        <CrossNavLink to="resume" label="Download Resume →" minimizeSourceId={focusedWindowId ?? undefined} />
      </div>
    </div>
  );
}
