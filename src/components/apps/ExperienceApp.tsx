import { Briefcase, GraduationCap } from 'lucide-react';
import { experience, education } from '../../config/content';
import { CrossNavLink } from '../shared/CrossNavLink';
import { useWindowStore } from '../../stores/windowStore';

export default function ExperienceApp() {
  const focusedWindowId = useWindowStore(s => s.focusedWindowId);

  return (
    <div style={{ padding: 32, fontFamily: 'var(--font-content)', color: 'var(--color-text-primary)', maxWidth: 640, width: '100%', margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Experience</h1>

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
        {experience.map((job, i) => (
          <div key={i} style={{
            background: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
            borderRadius: 'var(--radius-card)',
            padding: '20px 20px 20px 24px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              left: -1,
              top: 20,
              bottom: 20,
              width: 3,
              background: 'linear-gradient(135deg, #1a73e8, #34c77b)',
              borderRadius: 2,
            }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{job.role}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Briefcase size={12} />
                  {job.company}
                </p>
              </div>
              <span style={{
                fontSize: 12,
                color: 'var(--color-text-tertiary)',
                background: 'var(--color-badge-bg)',
                padding: '3px 8px',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {job.dates}
              </span>
            </div>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {job.bullets.map((b, j) => (
                <li key={j} style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Education */}
      <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        Education
      </h2>
      <div style={{
        background: 'var(--color-card-bg)',
        border: '1px solid var(--color-card-border)',
        borderRadius: 'var(--radius-card)',
        padding: '20px 20px 20px 24px',
        marginBottom: 28,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          left: -1,
          top: 20,
          bottom: 20,
          width: 3,
          background: 'linear-gradient(135deg, #f97316, #a855f7)',
          borderRadius: 2,
        }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{education.degree}</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <GraduationCap size={12} />
              {education.school}
            </p>
          </div>
          <span style={{
            fontSize: 12,
            color: 'var(--color-text-tertiary)',
            background: 'var(--color-badge-bg)',
            padding: '3px 8px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {education.dates}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>GPA: {education.gpa}</p>
        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', lineHeight: 1.6 }}>{education.notes}</p>
      </div>

      <CrossNavLink to="projects" label="See what I've built →" minimizeSourceId={focusedWindowId ?? undefined} />
    </div>
  );
}
