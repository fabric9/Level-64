'use server';

import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';

function calc(oldA: number, oldB: number, scoreA: number) {
  const K = 32;
  const expectedA = 1 / (1 + Math.pow(10, (oldB - oldA) / 400));
  const newA = Math.round(oldA + K * (scoreA - expectedA));
  return { newA, delta: newA - oldA };
}

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

  const { data: winnerProfile } = await supabase.from('profiles').select('*').eq('id', winnerId).single();
  const { data: loserProfile } = await supabase.from('profiles').select('*').eq('id', loserId).single();

  const w = calc(winnerProfile.rating, loserProfile.rating, 1);
  const l = calc(loserProfile.rating, winnerProfile.rating, 0);

  await supabase.from('match_results').insert({
    match_id: matchId,
    winner_player_id: winnerId,
    loser_player_id: loserId,
    winning_run_id: winningRun,
    losing_run_id: losingRun,
    level_number: match.level_number,
    result_type: 'adjudicated'
  });

  await supabase.from('matches').update({ status: 'completed' }).eq('id', matchId);

  await supabase.from('player_runs').update({ current_level: match.level_number + 1, status: 'queued' }).eq('id', winningRun);
  await supabase.from('player_runs').update({ status: 'eliminated' }).eq('id', losingRun);

  await supabase.from('profiles').update({ rating: w.newA, wins: winnerProfile.wins + 1 }).eq('id', winnerId);
  await supabase.from('profiles').update({ rating: l.newA, losses: loserProfile.losses + 1 }).eq('id', loserId);

  await supabase.from('rating_events').insert([
    { player_id: winnerId, match_id: matchId, old_rating: winnerProfile.rating, new_rating: w.newA, delta: w.delta },
    { player_id: loserId, match_id: matchId, old_rating: loserProfile.rating, new_rating: l.newA, delta: l.delta }
  ]);

  redirect('/dashboard?result=submitted');
}
