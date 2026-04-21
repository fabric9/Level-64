'use server';

import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';

export async function submitResult(formData: FormData) {
  const supabase = getServerSupabase();

  const { data: authData } = await supabase.auth.getUser();
  const currentUser = authData.user;

  if (!currentUser) {
    redirect('/login');
  }

  const matchId = String(formData.get('matchId') ?? '');

  if (!matchId) {
    redirect('/dashboard?error=missing-match');
  }

  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single();

  if (!match) {
    redirect('/dashboard?error=missing-match');
  }

  const isParticipant = match.player_a_id === currentUser.id || match.player_b_id === currentUser.id;

  if (!isParticipant) {
    redirect('/dashboard?error=not-participant');
  }

  if (!['pending', 'active'].includes(match.status)) {
    redirect('/dashboard?error=match-closed');
  }

  const { data: existingResult } = await supabase
    .from('match_results')
    .select('id')
    .eq('match_id', matchId)
    .maybeSingle();

  if (existingResult) {
    redirect('/dashboard?error=already-reported');
  }

  const winnerId = currentUser.id;
  const loserId = match.player_a_id === winnerId ? match.player_b_id : match.player_a_id;
  const winningRun = match.player_a_id === winnerId ? match.run_a_id : match.run_b_id;
  const losingRun = match.player_a_id === winnerId ? match.run_b_id : match.run_a_id;

  const { error: insertError } = await supabase.from('match_results').insert({
    match_id: matchId,
    winner_player_id: winnerId,
    loser_player_id: loserId,
    winning_run_id: winningRun,
    losing_run_id: losingRun,
    level_number: match.level_number,
    result_type: 'adjudicated'
  });

  if (insertError) {
    redirect('/dashboard?error=result-failed');
  }

  const { error: matchUpdateError } = await supabase
    .from('matches')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', matchId)
    .in('status', ['pending', 'active']);

  if (matchUpdateError) {
    redirect('/dashboard?error=match-update-failed');
  }

  const { error: winnerUpdateError } = await supabase
    .from('player_runs')
    .update({
      current_level: match.level_number + 1,
      status: 'queued',
      updated_at: new Date().toISOString()
    })
    .eq('id', winningRun)
    .in('status', ['pending', 'active', 'queued']);

  if (winnerUpdateError) {
    redirect('/dashboard?error=winner-update-failed');
  }

  const { error: loserUpdateError } = await supabase
    .from('player_runs')
    .update({
      status: 'eliminated',
      updated_at: new Date().toISOString()
    })
    .eq('id', losingRun)
    .in('status', ['pending', 'active', 'queued']);

  if (loserUpdateError) {
    redirect('/dashboard?error=loser-update-failed');
  }

  redirect('/dashboard?result=submitted');
}
