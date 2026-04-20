import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth/ensureProfile';

export default async function PlayerDashboard() {
  const user = await ensureProfile();

  if (!user) {
    redirect('/login');
  }

  const supabase = getServerSupabase();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile?.username) {
    redirect('/onboarding');
  }

  if (profile.role !== 'player') {
    redirect('/admin');
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Player Dashboard</h1>
      <p>Welcome {profile.email}</p>
    </main>
  );
}
