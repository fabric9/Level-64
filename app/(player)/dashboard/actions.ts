'use server';

import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';

export async function startRun() {
  const supabase = getServerSupabase();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect('/login');
  }

  const { data: existingRun } = await supabase
    .from('player_runs')
    .select('*')
    .eq('player_id', user.id)
    .in('status', ['queued', 'active'])
    .maybeSingle();

  if (existingRun) {
    redirect('/dashboard?run=exists');
  }

  const { data: newRun } = await supabase
    .from('player_runs')
    .insert({ player_id: user.id, current_level: 1, status: 'queued' })
    .select()
    .single();

  if (!newRun) {
    redirect('/dashboard?error=run-failed');
  }

  // simple matchmaking
  const { data: opponentRuns } = await supabase
    .from('player_runs')
    .select('*')
    .eq('current_level', 1)
    .eq('status', 'queued')
    .neq('id', newRun.id)
    .limit(1);

  if (opponentRuns && opponentRuns.length > 0) {
    const opponent = opponentRuns[0];

    await supabase.from('matches').insert({
      level_number: 1,
      player_a_id: newRun.player_id,
      player_b_id: opponent.player_id,
      run_a_id: newRun.id,
      run_b_id: opponent.id,
      status: 'pending'
    });

    await supabase
      .from('player_runs')
      .update({ status: 'active' })
      .in('id', [newRun.id, opponent.id]);
  }

  redirect('/dashboard');
}
