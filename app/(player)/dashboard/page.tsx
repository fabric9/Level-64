import { getUser } from '@/lib/auth/getUser';
import { redirect } from 'next/navigation';

export default async function PlayerDashboard() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Player Dashboard</h1>
      <p>Welcome {user.email}</p>
    </main>
  );
}
