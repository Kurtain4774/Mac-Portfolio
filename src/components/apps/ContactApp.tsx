import { Mail, Linkedin, Github } from 'lucide-react';
import { contact } from '../../config/content';

export default function ContactApp() {
  return (
    <div style={{
      padding: 40,
      fontFamily: 'var(--font-content)',
      color: 'var(--color-text-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      minHeight: 280,
      gap: 32,
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Let's connect</h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', maxWidth: 340, lineHeight: 1.6 }}>
          I'm open to new opportunities, collaborations, and interesting conversations.
          Reach out through any of these channels.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 340 }}>
        <ContactMethod
          icon={<Mail size={20} />}
          label="Email"
          value={contact.email}
          href={`mailto:${contact.email}`}
          color="#1a73e8"
        />
        <ContactMethod
          icon={<Linkedin size={20} />}
          label="LinkedIn"
          value="linkedin.com/in/kurtis"
          href={contact.linkedin}
          color="#0077b5"
        />
        <ContactMethod
          icon={<Github size={20} />}
          label="GitHub"
          value="github.com/kurtismquant"
          href={contact.github}
          color="#24292e"
        />
      </div>
    </div>
  );
}

interface ContactMethodProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  color: string;
}

function ContactMethod({ icon, label, value, href, color }: ContactMethodProps) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        background: 'var(--color-card-bg)',
        border: '1px solid var(--color-card-border)',
        borderRadius: 'var(--radius-card)',
        textDecoration: 'none',
        color: 'var(--color-text-primary)',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease',
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
      }}
    >
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
      </div>
    </a>
  );
}
