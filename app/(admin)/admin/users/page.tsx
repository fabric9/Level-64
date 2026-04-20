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

      {error && (
        <p style={{ color: 'red' }}>Error: {error}</p>
      )}

      <table style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u: any) => (
            <tr key={u.id} style={{ borderTop: '1px solid #ccc' }}>
              <td>{u.email}</td>
              <td>{u.username || '-'}</td>
              <td>
                <form action={updateUserAdmin}>
                  <input type="hidden" name="userId" value={u.id} />
                  <select name="role" defaultValue={u.role}>
                    <option value="player">player</option>
                    <option value="admin">admin</option>
                  </select>
              </td>
              <td>
                  <select name="status" defaultValue={u.status}>
                    <option value="active">active</option>
                    <option value="suspended">suspended</option>
                    <option value="banned">banned</option>
                  </select>
              </td>
              <td>
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
