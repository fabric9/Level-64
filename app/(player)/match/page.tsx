import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth/ensureProfile';
import { submitResult } from '@/app/(player)/match/actions';

export default async function MatchPage() {
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
    return <main style={{ padding: 40 }}>No active match</main>;
  }

  const opponentId = match.player_a_id === user.id ? match.player_b_id : match.player_a_id;

  const { data: opponentProfile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', opponentId)
    .single();

  return (
    <main style={{ minHeight: '100vh', padding: 32, background: '#020617', color: '#fff' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h1>Match Ready</h1>
        <p style={{ opacity: 0.8 }}>
          You are paired against <strong>{opponentProfile?.username || opponentId}</strong>
        </p>

        <div style={{ marginTop: 30 }}>
          <form action={submitResult}>
            <input type="hidden" name="matchId" value={match.id} />
            <input type="hidden" name="winnerId" value={user.id} />
            <button style={{ padding: '16px 24px', borderRadius: 12, background: '#16a34a', border: 'none', color: '#fff', fontWeight: 800 }}>
              Declare Win
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
