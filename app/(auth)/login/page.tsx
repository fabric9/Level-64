'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailEntry = async () => {
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for your secure sign-in link and account access.');
    }

    setLoading(false);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 32,
        background: 'radial-gradient(circle at top, #163321 0%, #081018 40%, #05080d 100%)',
        color: '#f8fafc',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 560,
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
          padding: 28,
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.72, letterSpacing: 1.3, marginBottom: 10 }}>
          LEVEL 64 ACCESS
        </div>
        <h1 style={{ margin: '0 0 10px', fontSize: 36 }}>Create account with email</h1>
        <p style={{ margin: '0 0 20px', opacity: 0.82, lineHeight: 1.6 }}>
          Email is the only sign-in method enabled for Level 64. Enter your email to create or access your player account.
        </p>

        <div style={{ display: 'grid', gap: 12 }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: 14,
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
            }}
          />
          <button
            onClick={handleEmailEntry}
            disabled={loading || !email}
            style={{
              padding: 14,
              borderRadius: 14,
              border: 'none',
              background: '#16a34a',
              color: '#fff',
              fontWeight: 800,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading || !email ? 0.65 : 1,
            }}
          >
            {loading ? 'Sending link...' : 'Create account / Sign in'}
          </button>
        </div>

        {message && (
          <p style={{ marginTop: 18, opacity: 0.9 }}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
