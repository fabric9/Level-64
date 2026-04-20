import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth/ensureProfile';

export default async function OnboardingPage() {
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

  if (profile?.username) {
    redirect(profile.role === 'admin' ? '/admin' : '/dashboard');
  }

  return (
    <main style={{ padding: 40, maxWidth: 720 }}>
      <h1>Complete your profile</h1>
      <p>Your account is active. The next pass will attach a username form here.</p>
      <p>Logged in as {profile?.email ?? user.email}</p>
      <p>Current role: {profile?.role ?? 'player'}</p>
    </main>
  );
}
