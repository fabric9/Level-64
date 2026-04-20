import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth/ensureProfile';

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 18,
  padding: 20,
  background: 'rgba(255,255,255,0.04)',
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
};

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
    <main
      style={{
        minHeight: '100vh',
        padding: 32,
        background: 'linear-gradient(180deg, #0a0f1c 0%, #111827 100%)',
        color: '#f8fafc',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 24,
            padding: 28,
            background: 'rgba(255,255,255,0.05)',
            marginBottom: 24,
          }}
        >
          <p style={{ margin: 0, opacity: 0.7, fontSize: 13, letterSpacing: 1.2 }}>
            LEVEL 64 ADMIN
          </p>
          <h1 style={{ margin: '10px 0 8px', fontSize: 36 }}>Control Center</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Signed in as {profile.email}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>Users</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>Admin Controls</div>
            <div style={{ marginTop: 8, opacity: 0.78 }}>Manage roles, suspension, and account access.</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>Matches</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>Match Operations</div>
            <div style={{ marginTop: 8, opacity: 0.78 }}>Monitor queue flow and result governance.</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>Finance</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>Payout Oversight</div>
            <div style={{ marginTop: 8, opacity: 0.78 }}>Review future withdrawals, wallets, and ledger events.</div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          <Link href="/admin/users" style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>User Management</div>
            <div style={{ opacity: 0.78 }}>Open the user control table to update roles and status.</div>
          </Link>

          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Sponsor Management</div>
            <div style={{ opacity: 0.78 }}>Reserved for sponsor campaigns and funding controls.</div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Queue & Match Control</div>
            <div style={{ opacity: 0.78 }}>Reserved for level queues, adjudication, and run supervision.</div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Platform Settings</div>
            <div style={{ opacity: 0.78 }}>Reserved for policy, payout, and system-level controls.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
