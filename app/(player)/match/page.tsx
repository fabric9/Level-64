import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth/ensureProfile';
import { submitResult } from '@/app/(player)/match/actions';

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 20,
  padding: 20,
  background: 'rgba(255,255,255,0.05)',
};

export default async function MatchPage({ searchParams }: any) {
  const user = await ensureProfile();
  if (!user) redirect('/login');

  const supabase = getServerSupabase();

  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .or(`player_a_id.eq.${user.id},player_b_id.eq.${user.id}`)
    .in('status', ['pending', 'active'])
    .maybeSingle();

  if (!match) {
    return (
      <main style={{ minHeight: '100vh', padding: 32, background: '#020617', color: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={cardStyle}>
            <h1>No Active Match</h1>
            <p style={{ opacity: 0.8 }}>You are not currently paired. Return to the dashboard to manage your run.</p>
            <div style={{ marginTop: 18 }}>
              <Link href="/dashboard" style={{ color: '#93c5fd', textDecoration: 'none' }}>Return to Dashboard</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const opponentId = match.player_a_id === user.id ? match.player_b_id : match.player_a_id;

  const { data: opponentProfile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', opponentId)
    .single();

  const { data: existingResult } = await supabase
    .from('match_results')
    .select('id')
    .eq('match_id', match.id)
    .maybeSingle();

  const resultSubmitted = Boolean(existingResult) || searchParams?.result === 'submitted';

  return (
    <main style={{ minHeight: '100vh', padding: 32, background: 'radial-gradient(circle at top, #163321 0%, #081018 40%, #020617 100%)', color: '#fff' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <div style={{ ...cardStyle, marginBottom: 20, background: 'linear-gradient(135deg, rgba(22,163,74,0.18), rgba(15,23,42,0.70))' }}>
          <div style={{ fontSize: 13, opacity: 0.72, letterSpacing: 1.3 }}>LEVEL 64 MATCH ROOM</div>
          <h1 style={{ margin: '10px 0 8px', fontSize: 40 }}>Match Ready</h1>
          <p style={{ margin: 0, opacity: 0.84 }}>
            You are paired against <strong>{opponentProfile?.username || opponentId}</strong>
          </p>
        </div>

        {resultSubmitted && (
          <div style={{ ...cardStyle, marginBottom: 20, borderColor: 'rgba(34,197,94,0.38)' }}>
            Result submitted. The match is locked and your dashboard will reflect progression state.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Match State</div>
            <div style={{ display: 'grid', gap: 10, opacity: 0.84 }}>
              <div><strong>Level:</strong> {match.level_number}</div>
              <div><strong>Status:</strong> {match.status}</div>
              <div><strong>Opponent:</strong> {opponentProfile?.username || opponentId}</div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Result Control</div>
            {!resultSubmitted ? (
              <form action={submitResult}>
                <input type="hidden" name="matchId" value={match.id} />
                <button style={{ width: '100%', padding: '16px 24px', borderRadius: 12, background: '#16a34a', border: 'none', color: '#fff', fontWeight: 800 }}>
                  Declare Win
                </button>
              </form>
            ) : (
              <div style={{ opacity: 0.8 }}>
                Submission received. Further result claims are blocked for this match.
              </div>
            )}

            <div style={{ marginTop: 18 }}>
              <Link href="/dashboard" style={{ color: '#93c5fd', textDecoration: 'none' }}>Return to Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
