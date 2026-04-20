import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth/ensureProfile';
import { updateUserAdmin } from './actions';

export default async function AdminUsersPage({ searchParams }: any) {
  const user = await ensureProfile();

  if (!user) {
    redirect('/login');
  }

  const supabase = getServerSupabase();

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (currentProfile?.role !== 'admin') {
    redirect('/dashboard');
  }

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const error = searchParams?.error;
  const saved = searchParams?.saved;

  return (
    <main style={{ padding: 40 }}>
      <h1>Admin — Users</h1>

      {saved && <p style={{ color: 'green' }}>Changes saved</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <table style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '10px 8px' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '10px 8px' }}>Username</th>
            <th style={{ textAlign: 'left', padding: '10px 8px' }}>Role</th>
            <th style={{ textAlign: 'left', padding: '10px 8px' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '10px 8px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u: any) => (
            <tr key={u.id} style={{ borderTop: '1px solid #ccc' }}>
              <td style={{ padding: '12px 8px' }}>{u.email}</td>
              <td style={{ padding: '12px 8px' }}>{u.username || '-'}</td>
              <td colSpan={3} style={{ padding: '12px 8px' }}>
                <form
                  action={updateUserAdmin}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'center' }}
                >
                  <input type="hidden" name="userId" value={u.id} />
                  <select name="role" defaultValue={u.role}>
                    <option value="player">player</option>
                    <option value="admin">admin</option>
                  </select>
                  <select name="status" defaultValue={u.status}>
                    <option value="active">active</option>
                    <option value="suspended">suspended</option>
                    <option value="banned">banned</option>
                  </select>
                  <button type="submit">Save</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
