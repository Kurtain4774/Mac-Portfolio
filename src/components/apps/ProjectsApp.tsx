import { ExternalLink, Github } from 'lucide-react';
import { projects } from '../../config/content';

export default function ProjectsApp() {
  return (
    <div style={{ padding: 28, fontFamily: 'var(--font-content)', color: 'var(--color-text-primary)' }}>
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
            {/* Thumbnail placeholder */}
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

            {/* Tech badges */}
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

            {/* Links */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    color: 'var(--color-accent)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  <Github size={13} /> GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    color: 'var(--color-accent)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
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
