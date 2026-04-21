import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth/ensureProfile';
import { startRun } from './actions';

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 18,
  padding: 20,
  background: 'rgba(255,255,255,0.05)',
};

function getResultMessage(result?: string | string[], error?: string | string[]) {
  if (result === 'submitted') return 'Result submitted successfully. Winner advanced and loser eliminated.';
  if (error === 'already-reported') return 'This match has already been reported.';
  if (error === 'match-closed') return 'This match is already closed.';
  if (error === 'not-participant') return 'You are not a participant in that match.';
  return null;
}

export default async function PlayerDashboard({ searchParams }: any) {
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

  const { data: run } = await supabase
    .from('player_runs')
    .select('*')
    .eq('player_id', user.id)
    .in('status', ['queued', 'active'])
    .maybeSingle();

  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .or(`player_a_id.eq.${user.id},player_b_id.eq.${user.id}`)
    .in('status', ['pending', 'active'])
    .maybeSingle();

  if (match) {
    redirect('/player/match');
  }

  const { data: recentResults } = await supabase
    .from('match_results')
    .select('*')
    .or(`winner_player_id.eq.${user.id},loser_player_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: ratingEvents } = await supabase
    .from('rating_events')
    .select('*')
    .eq('player_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const currentLevel = run?.current_level || 1;
  const runStatus = run ? run.status : 'Ready to begin';
  const feedback = getResultMessage(searchParams?.result, searchParams?.error);
  const levels = Array.from({ length: 16 }, (_, i) => i + 1);

  const ratingByMatch = new Map((ratingEvents || []).map((e: any) => [e.match_id, e]));

  return (
    <main style={{ minHeight: '100vh', padding: 32, background: 'linear-gradient(180deg, #06130f, #0f172a)', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 28, marginBottom: 24, background: 'linear-gradient(135deg, rgba(22,163,74,0.18), rgba(15,23,42,0.68))' }}>
          <div style={{ fontSize: 13, opacity: 0.72, letterSpacing: 1.3 }}>LEVEL 64 PROGRESSION COMMAND</div>
          <h1 style={{ margin: '10px 0 8px', fontSize: 38 }}>Welcome, {profile.username}</h1>
          <p style={{ margin: 0, opacity: 0.82 }}>Run Status: {runStatus}</p>
          {run?.status === 'queued' && <p style={{ opacity: 0.78, marginTop: 10 }}>Waiting for another player to enter Level {currentLevel}.</p>}
        </div>

        {feedback && (
          <div style={{ ...cardStyle, marginBottom: 20, borderColor: 'rgba(34,197,94,0.35)' }}>
            {feedback}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.72, marginBottom: 8 }}>Current Level</div>
            <div style={{ fontSize: 30, fontWeight: 800 }}>{currentLevel}</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.72, marginBottom: 8 }}>Run State</div>
            <div style={{ fontSize: 30, fontWeight: 800 }}>{runStatus}</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.72, marginBottom: 8 }}>Rating</div>
            <div style={{ fontSize: 30, fontWeight: 800 }}>{profile.rating ?? 1200}</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.72, marginBottom: 8 }}>Record</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{profile.wins ?? 0}W / {profile.losses ?? 0}L</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 16, marginBottom: 16 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Level Ladder</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
              {levels.map((level) => {
                const isCurrent = level === currentLevel;
                const isPassed = level < currentLevel;
                return (
                  <div
                    key={level}
                    style={{
                      borderRadius: 14,
                      padding: 14,
                      border: '1px solid rgba(255,255,255,0.12)',
                      background: isCurrent
                        ? 'rgba(34,197,94,0.22)'
                        : isPassed
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Level</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{level}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Player Actions</div>
            {!run ? (
              <form action={startRun}>
                <button style={{ padding: 14, borderRadius: 12, background: '#16a34a', color: '#fff', border: 'none', fontWeight: 700, width: '100%' }}>
                  Enter Level 1
                </button>
              </form>
            ) : (
              <div style={{ opacity: 0.82, lineHeight: 1.7 }}>
                Your run is active in the system. As soon as a valid match is available, the platform will route you into the match room.
              </div>
            )}

            <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
              <Link href="/player/match" style={{ color: '#93c5fd', textDecoration: 'none' }}>Open Match Room</Link>
              <Link href="/onboarding" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Edit Profile</Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Recent Match History</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {(recentResults || []).length === 0 && <div style={{ opacity: 0.72 }}>No matches recorded yet.</div>}
              {(recentResults || []).map((result: any) => {
                const didWin = result.winner_player_id === user.id;
                const ratingEvent = ratingByMatch.get(result.match_id);
                return (
                  <div key={result.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{didWin ? 'Win' : 'Loss'} · Level {result.level_number}</div>
                        <div style={{ opacity: 0.72, fontSize: 13 }}>{new Date(result.created_at).toLocaleString()}</div>
                      </div>
                      {ratingEvent && (
                        <div style={{ fontWeight: 700, color: ratingEvent.delta >= 0 ? '#4ade80' : '#f87171' }}>
                          {ratingEvent.delta >= 0 ? '+' : ''}{ratingEvent.delta}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Recent Rating Events</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {(ratingEvents || []).length === 0 && <div style={{ opacity: 0.72 }}>No rating changes yet.</div>}
              {(ratingEvents || []).map((event: any) => (
                <div key={event.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{event.old_rating} → {event.new_rating}</div>
                      <div style={{ opacity: 0.72, fontSize: 13 }}>{new Date(event.created_at).toLocaleString()}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: event.delta >= 0 ? '#4ade80' : '#f87171' }}>
                      {event.delta >= 0 ? '+' : ''}{event.delta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
