import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth/ensureProfile';

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 18,
  padding: 20,
  background: 'rgba(255,255,255,0.05)',
};

export default async function PlayerDashboard() {
  const user = await ensureProfile();

  if (!user) {
    redirect('/login');
  }

  const supabase = getServerSupabase();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile?.username) {
    redirect('/onboarding');
  }

  if (profile.role !== 'player') {
    redirect('/admin');
  }

  const rating = 1200;
  const currentLevel = 1;
  const runStatus = 'Ready to begin';

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 32,
        background: 'linear-gradient(180deg, #06130f 0%, #0f172a 100%)',
        color: '#f8fafc',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 24,
            padding: 28,
            background: 'linear-gradient(135deg, rgba(22,101,52,0.28), rgba(15,23,42,0.72))',
            marginBottom: 24,
          }}
        >
          <p style={{ margin: 0, opacity: 0.75, fontSize: 13, letterSpacing: 1.2 }}>
            LEVEL 64 PLAYER COMMAND
          </p>
          <h1 style={{ margin: '10px 0 8px', fontSize: 38 }}>
            Welcome, {profile.username}
          </h1>
          <p style={{ margin: 0, opacity: 0.82 }}>
            Sponsored progression chess platform — profile active and ready.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>Rating</div>
            <div style={{ fontSize: 30, fontWeight: 700 }}>{rating}</div>
            <div style={{ marginTop: 8, opacity: 0.75 }}>Initial competitive rating baseline.</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>Current Level</div>
            <div style={{ fontSize: 30, fontWeight: 700 }}>{currentLevel}</div>
            <div style={{ marginTop: 8, opacity: 0.75 }}>Run entry point for your next match.</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>Run Status</div>
            <div style={{ fontSize: 30, fontWeight: 700 }}>{runStatus}</div>
            <div style={{ marginTop: 8, opacity: 0.75 }}>No live match is active yet.</div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 0.9fr',
            gap: 16,
          }}
        >
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Progression Brief</div>
            <p style={{ marginTop: 0, opacity: 0.8, lineHeight: 1.6 }}>
              Your player identity is initialized. The next system layer will connect sponsor entry,
              live queueing, run tracking, and match outcomes across the Level 64 ladder.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
              <button
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#16a34a',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Enter Level 1
              </button>
              <Link
                href="/onboarding"
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: '#f8fafc',
                  textDecoration: 'none',
                }}
              >
                Edit Profile
              </Link>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Account Snapshot</div>
            <div style={{ display: 'grid', gap: 10, opacity: 0.82 }}>
              <div><strong>Email:</strong> {profile.email}</div>
              <div><strong>Username:</strong> {profile.username}</div>
              <div><strong>Status:</strong> {profile.status}</div>
              <div><strong>Role:</strong> {profile.role}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
