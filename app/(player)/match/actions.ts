'use server';

import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';

export async function submitResult(formData: FormData) {
  const supabase = getServerSupabase();

  const matchId = String(formData.get('matchId'));
  const winnerId = String(formData.get('winnerId'));

  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single();

  if (!match) redirect('/dashboard');

  const loserId = match.player_a_id === winnerId ? match.player_b_id : match.player_a_id;
  const winningRun = match.player_a_id === winnerId ? match.run_a_id : match.run_b_id;
  const losingRun = match.player_a_id === winnerId ? match.run_b_id : match.run_a_id;

  await supabase.from('match_results').insert({
    match_id: matchId,
    winner_player_id: winnerId,
    loser_player_id: loserId,
    winning_run_id: winningRun,
    losing_run_id: losingRun,
    level_number: match.level_number
  });

  await supabase.from('matches').update({ status: 'completed' }).eq('id', matchId);

  await supabase.from('player_runs').update({
    current_level: match.level_number + 1,
    status: 'queued'
  }).eq('id', winningRun);

  await supabase.from('player_runs').update({
    status: 'eliminated'
  }).eq('id', losingRun);

  redirect('/dashboard');
}
