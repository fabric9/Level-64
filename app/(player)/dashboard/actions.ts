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

  const { error } = await supabase
    .from('player_runs')
    .insert({ player_id: user.id, current_level: 1, status: 'queued' });

  if (error) {
    redirect('/dashboard?error=run-failed');
  }

  redirect('/dashboard?run=created');
}
