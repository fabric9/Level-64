import Link from 'next/link';
import { getServerSupabase } from '@/lib/supabase/server';

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 20,
  padding: 20,
  background: 'rgba(255,255,255,0.05)',
};

export default async function HomePage() {
  const supabase = getServerSupabase();

  const [{ count: profilesCount }, { count: matchesCount }, { count: queuedRunsCount }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('*', { count: 'exact', head: true }).in('status', ['pending', 'active']),
    supabase.from('player_runs').select('*', { count: 'exact', head: true }).eq('status', 'queued'),
  ]);

  const ladderPreview = Array.from({ length: 16 }, (_, i) => i + 1);

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
              Create Account
            </Link>
          </nav>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1.18fr 0.82fr',
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
              Create your account and enter the path to Level 64.
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.84, maxWidth: 760, margin: 0 }}>
              Level 64 is a head-to-head chess progression platform where players create accounts with email,
              enter runs, and compete across a structured 64-level system.
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
                Create Account
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginTop: 24 }}>
              <div style={cardStyle}>
                <div style={{ fontSize: 13, opacity: 0.7 }}>Players</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{profilesCount ?? 0}</div>
              </div>
              <div style={cardStyle}>
                <div style={{ fontSize: 13, opacity: 0.7 }}>Active Matches</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{matchesCount ?? 0}</div>
              </div>
              <div style={cardStyle}>
                <div style={{ fontSize: 13, opacity: 0.7 }}>Queued Runs</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{queuedRunsCount ?? 0}</div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.72, marginBottom: 10 }}>HOW IT WORKS</div>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>1. Create your account with email</div>
              <div>2. Enter Level 1</div>
              <div>3. Get matched</div>
              <div>4. Win and advance</div>
            </div>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Ladder Preview</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
              {ladderPreview.map((level) => (
                <div key={level} style={{ borderRadius: 14, padding: 14, border: '1px solid rgba(255,255,255,0.12)', background: level === 1 ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: 12, opacity: 0.72 }}>Level</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{level}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>System Status</div>
            <div style={{ display: 'grid', gap: 12 }}>
              <div><strong>Auth:</strong> Email Only</div>
              <div><strong>Profiles & Roles:</strong> Active</div>
              <div><strong>Matchmaking:</strong> Online</div>
              <div><strong>Result Security:</strong> Guarded</div>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
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
              Identity and progression remain under platform control.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
