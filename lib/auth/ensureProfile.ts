import { getServerSupabase } from '@/lib/supabase/server';

export async function ensureProfile() {
  const supabase = getServerSupabase();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return null;

  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!existing) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
    });
  }

  return user;
}
