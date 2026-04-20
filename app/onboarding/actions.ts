'use server';

import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';

function normalizeUsername(input: string) {
  return input.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
}

export async function saveUsername(formData: FormData) {
  const supabase = getServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect('/login');
  }

  const rawUsername = String(formData.get('username') ?? '');
  const username = normalizeUsername(rawUsername);

  if (username.length < 3) {
    redirect('/onboarding?error=username-too-short');
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .neq('id', user.id)
    .maybeSingle();

  if (existing) {
    redirect('/onboarding?error=username-taken');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ username, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) {
    redirect('/onboarding?error=save-failed');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  redirect(profile?.role === 'admin' ? '/admin' : '/dashboard');
}
