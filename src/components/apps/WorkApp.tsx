import { Briefcase, ExternalLink, Github, GraduationCap } from 'lucide-react';
import { experience, education, projects } from '../../config/content';

export default function WorkApp() {
  return (
    <div style={{ padding: 28, fontFamily: 'var(--font-content)', color: 'var(--color-text-primary)' }}>

      {/* ── Experience ── */}
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Experience</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36, maxWidth: 680 }}>
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
                  <Briefcase size={12} />{job.company}
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

      {/* ── Education ── */}
      <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        Education
      </h2>
      <div style={{
        background: 'var(--color-card-bg)',
        border: '1px solid var(--color-card-border)',
        borderRadius: 'var(--radius-card)',
        padding: '20px 20px 20px 24px',
        marginBottom: 40,
        position: 'relative',
        maxWidth: 680,
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
              <GraduationCap size={12} />{education.school}
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

      {/* ── Projects ── */}
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Projects</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16,
      }}>
        {projects.map(project => (
          <div
            key={project.id}
            style={{
              background: 'var(--color-card-bg)',
              border: '1px solid var(--color-card-border)',
              borderRadius: 'var(--radius-card)',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              boxShadow: 'var(--shadow-card)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = '';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
            }}
          >
            <div style={{
              width: '100%',
              height: 120,
              borderRadius: 6,
              background: 'var(--color-badge-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              overflow: 'hidden',
            }}>
              {project.id === 'soundsage' && '🎵'}
              {project.id === 'tft-dualytics' && '🎮'}
              {project.id === 'quoted' && '💬'}
              {project.id === 'habitflow' && '✅'}
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 600 }}>{project.name}</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.55, flex: 1 }}>
              {project.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {project.tech.map(t => (
                <span key={t} style={{
                  fontSize: 11,
                  background: 'var(--color-badge-bg)',
                  color: 'var(--color-badge-text)',
                  border: '1px solid var(--color-card-border)',
                  padding: '2px 7px',
                  borderRadius: 4,
                  fontWeight: 500,
                }}>
                  {t}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}
                >
                  <Github size={13} /> GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}
                >
                  <ExternalLink size={13} /> Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
