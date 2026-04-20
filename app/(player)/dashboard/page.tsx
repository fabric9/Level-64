import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth/ensureProfile';
import { startRun } from './actions';

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

  const { data: run } = await supabase
    .from('player_runs')
    .select('*')
    .eq('player_id', user.id)
    .in('status', ['queued', 'active'])
    .maybeSingle();

  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .or(`player_a_id.eq.${user.id},player_b_id.eq.${user.id}`)
    .in('status', ['pending', 'active'])
    .maybeSingle();

  if (match) {
    redirect('/player/match');
  }

  const currentLevel = run?.current_level || 1;
  const runStatus = run ? run.status : 'Ready to begin';

  return (
    <main style={{ minHeight: '100vh', padding: 32, background: 'linear-gradient(180deg, #06130f, #0f172a)', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 28, marginBottom: 24 }}>
          <h1>Welcome, {profile.username}</h1>
          <p>Run Status: {runStatus}</p>
          {run?.status === 'queued' && <p style={{ opacity: 0.78 }}>Waiting for another player to enter Level {currentLevel}.</p>}
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {!run && (
            <form action={startRun}>
              <button style={{ padding: 14, borderRadius: 12, background: '#16a34a', color: '#fff', border: 'none', fontWeight: 700 }}>
                Enter Level 1
              </button>
            </form>
          )}

          {run && (
            <div style={cardStyle}>
              <div><strong>Current Level:</strong> {currentLevel}</div>
              <div style={{ marginTop: 8 }}><strong>Status:</strong> {run.status}</div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 30, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/onboarding" style={{ color: '#ccc' }}>Edit Profile</Link>
          <Link href="/player/match" style={{ color: '#93c5fd' }}>Open Match Room</Link>
        </div>
      </div>
    </main>
  );
}
