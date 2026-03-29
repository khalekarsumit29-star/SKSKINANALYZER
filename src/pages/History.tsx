import { useState, useEffect } from 'react';
import { Calendar, Activity, Trash2, TrendingUp } from 'lucide-react';
import { supabase } from '../supabaseClient';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

const METRIC_DEFS = [
  { key: 'acne',    label: 'Acne',    color: '#f87171' },
  { key: 'dryness', label: 'Dryness', color: '#60a5fa' },
  { key: 'oiliness',label: 'Oiliness',color: '#fbbf24' },
  { key: 'pigmentation', label: 'Pigment', color: '#c084fc' },
  { key: 'wrinkles',label: 'Wrinkles',color: '#818cf8' },
];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
      <p style={{ color: '#9ca3af', fontSize: 10, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      {payload.map((e: any) => (
        <div key={e.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: e.color, boxShadow: `0 0 4px ${e.color}` }} />
          <span style={{ color: '#d1d5db', fontSize: 12, fontWeight: 500 }}>{e.name}</span>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginLeft: 'auto' }}>{e.value}<span style={{ color: '#6b7280', fontSize: 10 }}>/10</span></span>
        </div>
      ))}
    </div>
  );
};

export default function History({ user }: { user: any }) {
  const [history, setHistory]         = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [activeLines, setActiveLines] = useState<Set<string>>(new Set(['acne', 'score']));

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      setLoading(true); setError('');
      const { data, error: err } = await supabase
        .from('analyses').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (err) { setError('Failed to load history. ' + err.message); }
      else setHistory(data || []);
      setLoading(false);
    })();
  }, [user?.id]);

  const deleteAllHistory = async () => {
    if (!confirm('Delete all your history? This cannot be undone.')) return;
    const { error: e } = await supabase.from('analyses').delete().eq('user_id', user.id);
    if (e) alert('Delete failed! ' + e.message);
    else setHistory([]);
  };

  const formatDate = (s: string) => {
    try { const d = new Date(s); return isNaN(d.getTime()) ? null : d; } catch { return null; }
  };

  const getRecs = (r: any): string[] => {
    if (r.routine && typeof r.routine === 'string' && r.routine.trim())
      return r.routine.split(' | ').filter(Boolean);
    return [];
  };

  const toggleLine = (key: string) =>
    setActiveLines(p => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });

  // Chart data from history (reversed so oldest → newest left→right)
  const chartData = [...history].reverse().map(h => ({
    date: new Date(h.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    acne: h.acne ?? 0, dryness: h.dryness ?? 0, oiliness: h.oiliness ?? 0,
    pigmentation: h.pigmentation ?? 0, wrinkles: h.wrinkles ?? 0, score: h.score ?? 0,
  }));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400" style={{ fontSize: '14px' }}>Loading history...</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="text-white" style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.5px' }}>Analysis History</h1>
          <p className="text-gray-400" style={{ marginTop: '8px', fontSize: '15px' }}>Track your skin health progress over time.</p>
        </div>
        {history.length > 0 && (
          <button onClick={deleteAllHistory}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
              color: '#fca5a5', padding: '10px 18px', borderRadius: '14px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)';
            }}
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </header>

      {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '16px', padding: '16px 20px', color: '#fca5a5', fontSize: '14px' }}>{error}</div>}

      {/* ── Progress Chart ── */}
      {history.length >= 2 && (
        <div style={{
          borderRadius: '24px', padding: '32px',
          background: 'var(--bg-surface)', border: '1px solid rgba(16,185,129,0.18)',
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-white" style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.3px' }}>Progress Over Time</h2>
          </div>
          <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>Select metrics to compare</p>

          {/* Metric Toggles */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
            {[...METRIC_DEFS, { key: 'score', label: 'Skin Score', color: '#34d399' }].map(m => {
              const on = activeLines.has(m.key);
              return (
                <button key={m.key} onClick={() => toggleLine(m.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '8px 14px', borderRadius: '99px',
                    fontSize: '12px', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: on ? `${m.color}15` : 'var(--bg-surface2)',
                    border: `1px solid ${on ? `${m.color}50` : 'var(--border)'}`,
                    color: on ? m.color : '#4b5563',
                    boxShadow: on ? `0 0 8px ${m.color}30` : 'none',
                    transform: on ? 'translateY(-1px)' : 'translateY(0)',
                  }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: on ? m.color : '#374151', boxShadow: on ? `0 0 4px ${m.color}` : 'none' }} />
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Chart */}
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" stroke="transparent" tick={{ fill: '#4b5563', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} stroke="transparent" tick={{ fill: '#4b5563', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                {[...METRIC_DEFS, { key: 'score', label: 'Skin Score', color: '#34d399' }].map(m =>
                  activeLines.has(m.key) ? (
                    <Line key={m.key} type="monotone" dataKey={m.key} name={m.label} stroke={m.color} strokeWidth={2.5}
                      dot={{ r: 4, fill: m.color, stroke: '#0a0c16', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: m.color, stroke: '#0a0c16', strokeWidth: 2, style: { filter: `drop-shadow(0 0 6px ${m.color})` } }} />
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Individual History Cards ── */}
      {history.length === 0 && !error ? (
        <div style={{
          borderRadius: '24px', padding: '60px 40px', textAlign: 'center',
          background: 'var(--bg-surface)', border: '1px solid rgba(16,185,129,0.18)',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--bg-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Activity className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-white" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>No History Found</h2>
          <p className="text-gray-400" style={{ maxWidth: '400px', margin: '0 auto', fontSize: '14px', lineHeight: 1.6 }}>
            You haven't completed any skin analyses yet. Take your first photo to start tracking your skin health.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {history.map((record) => {
            const date = formatDate(record.created_at);
            const recs = getRecs(record);
            return (
              <div key={record.id}
                style={{
                  borderRadius: '20px', overflow: 'hidden',
                  background: 'var(--bg-surface)', border: '1px solid rgba(16,185,129,0.15)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.15)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ padding: '32px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        background: 'rgba(16,185,129,0.1)', color: '#34d399',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-white" style={{ fontWeight: 700, fontSize: '15px' }}>
                          {date ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Analysis Result'}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>
                          {date ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                      padding: '8px 18px', borderRadius: '99px',
                    }}>
                      <span style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Score</span>
                      <span style={{ color: '#34d399', fontWeight: 800, fontSize: '20px', lineHeight: 1 }}>{record.score ?? '—'}</span>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>/10</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '24px', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {/* Image */}
                    <div style={{
                      width: '160px', height: '160px', borderRadius: '16px', overflow: 'hidden',
                      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--bg-surface2)', border: '1px solid var(--border)',
                    }}>
                      {record.image_url && record.image_url !== 'no-image'
                        ? <img src={record.image_url} alt="Scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        : <span style={{ color: '#6b7280', fontSize: '13px' }}>No image</span>}
                    </div>

                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {/* Score Bars */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {METRIC_DEFS.map(m => (
                          <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <span style={{ fontSize: '12px', color: '#9ca3af', width: '64px', flexShrink: 0, fontWeight: 600 }}>{m.label}</span>
                            <div style={{ flex: 1, borderRadius: '99px', height: '8px', overflow: 'hidden', background: 'var(--bg-surface2)' }}>
                              <div style={{
                                height: '100%', borderRadius: '99px',
                                transition: 'all 0.7s ease-out',
                                width: `${(record[m.key] ?? 0) * 10}%`,
                                background: `linear-gradient(90deg, ${m.color}, ${m.color}80)`,
                                boxShadow: `0 0 8px ${m.color}40`,
                              }} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 700, width: '24px', textAlign: 'right', color: m.color }}>{record[m.key] ?? 0}</span>
                          </div>
                        ))}
                      </div>

                      {/* Recommendations */}
                      {recs.length > 0 && (
                        <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                          <h4 style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>Recommendations</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {recs.slice(0, 2).map((rec: string, idx: number) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.5 }}>
                                <span style={{ color: '#34d399', marginTop: '2px', flexShrink: 0 }}>•</span>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}