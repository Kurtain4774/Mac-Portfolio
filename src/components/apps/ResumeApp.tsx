import { Download, FileText } from 'lucide-react';

const RESUME_URL = '/Gavin-Portfolio/resume.pdf';

export default function ResumeApp() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: 'var(--font-content)',
      color: 'var(--color-text-primary)',
    }}>
      {/* Toolbar */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--color-card-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        background: 'var(--color-titlebar-bg)',
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
          <FileText size={14} /> resume.pdf
        </span>
        <a
          href={RESUME_URL}
          download="resume.pdf"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            color: '#fff',
            background: 'var(--color-accent)',
            padding: '6px 12px',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          <Download size={13} /> Download
        </a>
      </div>

      {/* PDF embed */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <object
          data={RESUME_URL}
          type="application/pdf"
          style={{ width: '100%', height: '100%', border: 'none' }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 12,
            color: 'var(--color-text-secondary)',
          }}>
            <FileText size={48} strokeWidth={1} />
            <p style={{ fontSize: 15, fontWeight: 500 }}>Resume not yet uploaded</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>
              Drop your <code>resume.pdf</code> into the <code>public/</code> folder to display it here.
            </p>
          </div>
        </object>
      </div>
    </div>
  );
}
