export default function FinderApp() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      fontFamily: 'var(--font-content)',
      color: 'var(--color-text-tertiary)',
      gap: 10,
      minHeight: 200,
    }}>
      <p style={{ fontSize: 36, lineHeight: 1 }}>📁</p>
      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>Finder</p>
      <p style={{ fontSize: 13 }}>Coming soon</p>
    </div>
  );
}
