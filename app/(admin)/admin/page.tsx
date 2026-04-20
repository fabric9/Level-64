import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth/ensureProfile';

export default async function AdminDashboard() {
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

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Admin Panel</h1>
      <p>Admin: {profile.email}</p>
    </main>
  );
}
