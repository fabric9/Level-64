import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth/ensureProfile';
import { saveUsername } from './actions';

export default async function OnboardingPage({ searchParams }: any) {
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

  const error = searchParams?.error;

  return (
    <main style={{ padding: 40, maxWidth: 720 }}>
      <h1>Choose your username</h1>
      <p>This will be your public player identity.</p>

      <form action={saveUsername} style={{ marginTop: 20 }}>
        <input
          name="username"
          placeholder="Enter username"
          style={{ padding: 10, width: 300 }}
          required
        />
        <button type="submit" style={{ marginLeft: 10 }}>
          Continue
        </button>
      </form>

      {error === 'username-too-short' && (
        <p style={{ color: 'red' }}>Username must be at least 3 characters.</p>
      )}

      {error === 'username-taken' && (
        <p style={{ color: 'red' }}>Username is already taken.</p>
      )}

      {error === 'save-failed' && (
        <p style={{ color: 'red' }}>Something went wrong. Try again.</p>
      )}

      <p style={{ marginTop: 20 }}>
        Logged in as {profile?.email ?? user.email}
      </p>
    </main>
  );
}
