import { getUser } from '@/lib/auth/getUser';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Admin Panel</h1>
      <p>Admin session active: {user.email}</p>
    </main>
  );
}
