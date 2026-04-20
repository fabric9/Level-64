import Link from 'next/link';

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 20,
  padding: 20,
  background: 'rgba(255,255,255,0.05)',
};

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 32,
        background: 'radial-gradient(circle at top, #163321 0%, #081018 40%, #05080d 100%)',
        color: '#f8fafc',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            marginBottom: 28,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ fontSize: 13, opacity: 0.72, letterSpacing: 1.4 }}>LEVEL 64</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>Sponsored Chess Progression</div>
          </div>
          <nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/login" style={{ color: '#f8fafc', textDecoration: 'none', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 12 }}>
              Login
            </Link>
            <Link href="/dashboard" style={{ color: '#f8fafc', textDecoration: 'none', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 12 }}>
              Player Dashboard
            </Link>
            <Link href="/admin" style={{ color: '#f8fafc', textDecoration: 'none', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 12 }}>
              Admin
            </Link>
          </nav>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1.25fr 0.85fr',
            gap: 20,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 28,
              padding: 32,
              background: 'linear-gradient(135deg, rgba(22,163,74,0.20), rgba(15,23,42,0.78))',
            }}
          >
            <div style={{ fontSize: 13, opacity: 0.72, letterSpacing: 1.5, marginBottom: 12 }}>
              COMPETITIVE LADDER / 64 TIERS
            </div>
            <h1 style={{ fontSize: 56, lineHeight: 1.02, margin: '0 0 14px' }}>
              Enter the sponsored path from Level 1 to Level 64.
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.84, maxWidth: 760, margin: 0 }}>
              Level 64 is a head-to-head chess progression platform where players enter funded runs,
              advance through the ladder, build identity and ratings, and operate inside an admin-controlled system.
            </p>

            <div style={{ display: 'flex', gap: 14, marginTop: 24, flexWrap: 'wrap' }}>
              <Link
                href="/login"
                style={{
                  textDecoration: 'none',
                  background: '#16a34a',
                  color: '#fff',
                  padding: '14px 18px',
                  borderRadius: 14,
                  fontWeight: 800,
                }}
              >
                Enter Platform
              </Link>
              <Link
                href="/dashboard"
                style={{
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.16)',
                  color: '#f8fafc',
                  padding: '14px 18px',
                  borderRadius: 14,
                }}
              >
                Open Player Command
              </Link>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.72, marginBottom: 10 }}>SYSTEM STATUS</div>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>Auth</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Live</div>
              </div>
              <div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>Profiles & Roles</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Active</div>
              </div>
              <div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>Admin Controls</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Online</div>
              </div>
              <div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>Run Engine</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Level 1 Ready</div>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Sponsored Entry</div>
            <div style={{ opacity: 0.78, lineHeight: 1.6 }}>
              Players enter through funded participation flows designed for sponsor-backed progression.
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Progressive Ladder</div>
            <div style={{ opacity: 0.78, lineHeight: 1.6 }}>
              Every run begins at Level 1 and advances through a structured 64-level system.
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Admin Governance</div>
            <div style={{ opacity: 0.78, lineHeight: 1.6 }}>
              Identity, roles, queues, and future withdrawals are designed to remain under platform control.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
