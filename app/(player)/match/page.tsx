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
    .eq('status', 'pending')
    .maybeSingle();

  if (!match) {
    return <main style={{ padding: 40 }}>No active match</main>;
  }

  const opponentId = match.player_a_id === user.id ? match.player_b_id : match.player_a_id;

  return (
    <main style={{ padding: 40 }}>
      <h1>Match Found</h1>
      <p>Opponent ID: {opponentId}</p>

      <form action={submitResult}>
        <input type="hidden" name="matchId" value={match.id} />
        <input type="hidden" name="winnerId" value={user.id} />
        <button type="submit">Declare Win</button>
      </form>
    </main>
  );
}
