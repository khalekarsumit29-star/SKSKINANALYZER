import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, ArrowRight, TrendingUp, TrendingDown,
  Minus, Activity, Zap, Eye, Sun, Sparkles
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '../supabaseClient';
import { useTheme } from '../ThemeContext';


const METRICS = [
  { key: 'acne',         label: 'Acne',         color: '#f87171', glow: 'rgba(248,113,113,0.3)',  stop1: '#f87171', stop2: 'rgba(248,113,113,0)' },
  { key: 'dryness',      label: 'Dryness',      color: '#60a5fa', glow: 'rgba(96,165,250,0.3)',   stop1: '#60a5fa', stop2: 'rgba(96,165,250,0)'  },
  { key: 'oiliness',     label: 'Oiliness',     color: '#fbbf24', glow: 'rgba(251,191,36,0.3)',   stop1: '#fbbf24', stop2: 'rgba(251,191,36,0)'  },
  { key: 'pigmentation', label: 'Pigment',       color: '#c084fc', glow: 'rgba(192,132,252,0.3)', stop1: '#c084fc', stop2: 'rgba(192,132,252,0)' },
  { key: 'wrinkles',     label: 'Wrinkles',      color: '#818cf8', glow: 'rgba(129,140,248,0.3)', stop1: '#818cf8', stop2: 'rgba(129,140,248,0)' },
  { key: 'score',        label: 'Skin Score',    color: '#34d399', glow: 'rgba(52,211,153,0.3)',  stop1: '#34d399', stop2: 'rgba(52,211,153,0)'  },
];

const RANGES = [
  { label: '7D',  days: 7  },
  { label: '30D', days: 30 },
  { label: 'All', days: 0  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'rgba(15,15,25,0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '14px 18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        minWidth: '160px',
      }}
    >
      <p style={{ color: '#9ca3af', fontSize: 11, marginBottom: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, boxShadow: `0 0 6px ${entry.color}`, flexShrink: 0 }} />
          <span style={{ color: '#d1d5db', fontSize: 12, fontWeight: 500 }}>{entry.name}</span>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginLeft: 'auto' }}>{entry.value}<span style={{ color: '#6b7280', fontSize: 11, fontWeight: 500 }}>/10</span></span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard({ user }: { user: any }) {
  const [history, setHistory]             = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(new Set(['acne', 'dryness', 'score']));
  const [range, setRange]                 = useState(30);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!user?.id) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('analyses').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setHistory(data || []);
      setLoading(false);
    };
    fetch();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const latestAnalysis = history[0];

  const filteredHistory = (range === 0 ? [...history] : history.filter(item => {
    const daysAgo = (Date.now() - new Date(item.created_at).getTime()) / 86400000;
    return daysAgo <= range;
  })).reverse();

  const chartData = filteredHistory.map(item => ({
    date:         new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    acne:         item.acne         ?? 0,
    dryness:      item.dryness      ?? 0,
    oiliness:     item.oiliness     ?? 0,
    pigmentation: item.pigmentation ?? 0,
    wrinkles:     item.wrinkles     ?? 0,
    score:        item.score        ?? 0,
  }));

  const getTrend = (key: string) => {
    if (history.length < 2) return 'neutral';
    const a = history[0][key] ?? 0, b = history[1][key] ?? 0;
    if (key === 'score') return a > b ? 'up' : a < b ? 'down' : 'neutral';
    return a < b ? 'up' : a > b ? 'down' : 'neutral';
  };

  const toggleMetric = (key: string) =>
    setActiveMetrics(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const avgScore = history.length
    ? Math.round(history.reduce((s, h) => s + (h.score ?? 0), 0) / history.length) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Header */}
      <header style={{ paddingBottom: '12px' }}>
        <h1 className="text-3xl font-bold text-white" style={{ letterSpacing: '-0.5px' }}>Hello, {user.name} 👋</h1>
        <p className="text-gray-400" style={{ marginTop: '8px', fontSize: '15px' }}>Here is your skin health overview.</p>
      </header>

      {history.length === 0 ? (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(16,185,129,0.18)',
          borderRadius: '24px',
          padding: '56px 40px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(16,185,129,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', border: '1px solid rgba(16,185,129,0.15)',
          }}>
            <Sparkles className="w-8 h-8" style={{ color: '#34d399' }} />
          </div>
          <h2 className="text-xl font-bold text-white" style={{ marginBottom: '10px' }}>Welcome to Dermify AI</h2>
          <p className="text-gray-400" style={{ marginBottom: '36px', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto', fontSize: '14px', lineHeight: 1.6 }}>
            Start your skincare journey by taking your first analysis. Explore all the tools below.
          </p>

          <Link to="/dashboard/new-analysis" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition font-medium" style={{ boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}>
            <Camera className="w-5 h-5" /> Start First Analysis
          </Link>
        </div>
      ) : (
        <>
          {/* ── Stat Cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
            {[
              { label: 'Skin Score',      value: `${latestAnalysis.score ?? '—'}/10`, icon: <Activity className="w-5 h-5" />, color: '#34d399', trend: getTrend('score')   },
              { label: 'Total Analyses',  value: history.length,                      icon: <Eye      className="w-5 h-5" />, color: '#60a5fa', trend: 'neutral'           },
              { label: 'Avg Score',       value: `${avgScore}/10`,                    icon: <Zap      className="w-5 h-5" />, color: '#fbbf24', trend: 'neutral'           },
              { label: 'Acne Level',      value: `${latestAnalysis.acne ?? '—'}/10`,  icon: <Sun      className="w-5 h-5" />, color: '#f87171', trend: getTrend('acne')    },
            ].map(card => (
              <div key={card.label}
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${card.color}30`,
                  borderRadius: '20px',
                  padding: '24px',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.3s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${card.color}20`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${card.color}50`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${card.color}30`;
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
                  background: `${card.color}15`, color: card.color,
                }}>
                  {card.icon}
                </div>
                <p className="text-gray-500" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '6px' }}>{card.label}</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <span className="text-white" style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.5px' }}>{card.value}</span>
                  {card.trend === 'up'      && <TrendingUp   className="w-4 h-4" style={{ color: '#34d399', marginBottom: '4px' }} />}
                  {card.trend === 'down'    && <TrendingDown className="w-4 h-4" style={{ color: '#f87171', marginBottom: '4px' }} />}
                  {card.trend === 'neutral' && history.length >= 2 && <Minus className="w-4 h-4 text-gray-600" style={{ marginBottom: '4px' }} />}
                </div>
              </div>
            ))}
          </div>

          {/* ══ SKIN PROGRESS CHART ══ */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid rgba(16,185,129,0.18)',
              borderRadius: '24px',
              padding: '36px',
              boxShadow: 'var(--shadow)',
            }}
          >
            {/* Chart Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-white" style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' }}>Skin Progress</h2>
                </div>
                <p className="text-gray-500" style={{ fontSize: '14px' }}>Visual tracking of all your skin metrics over time</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                {/* Time Range Pills */}
                <div style={{ display: 'flex', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  {RANGES.map(r => (
                    <button
                      key={r.label}
                      onClick={() => setRange(r.days)}
                      style={{
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'all 0.2s',
                        background: range === r.days ? 'linear-gradient(135deg,#10b981,#059669)' : 'var(--bg-surface2)',
                        color: range === r.days ? '#fff' : '#6b7280',
                        boxShadow: range === r.days ? '0 0 12px rgba(16,185,129,0.4)' : 'none',
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <Link to="/dashboard/history" className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition font-medium" style={{ fontSize: '13px' }}>
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Glowing Metric Toggle Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
              {METRICS.map(m => {
                const on = activeMetrics.has(m.key);
                return (
                  <button
                    key={m.key}
                    onClick={() => toggleMetric(m.key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '7px',
                      padding: '8px 14px', borderRadius: '99px',
                      fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background:  on ? `${m.color}18` : 'var(--bg-surface2)',
                      border:      `1px solid ${on ? `${m.color}60` : 'var(--border)'}`,
                      color:       on ? m.color : '#4b5563',
                      boxShadow:   on ? `0 0 10px ${m.glow}` : 'none',
                      transform:   on ? 'translateY(-1px)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: on ? m.color : '#374151',
                        boxShadow: on ? `0 0 5px ${m.color}` : 'none',
                      }}
                    />
                    {m.label}
                  </button>
                );
              })}
            </div>

            {/* Chart or Empty State */}
            {chartData.length < 2 ? (
              <div style={{
                height: '256px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                borderRadius: '16px',
                background: 'var(--bg-surface2)', border: '1px dashed var(--border)',
              }}>
                <Activity className="w-10 h-10" style={{ color: '#374151', marginBottom: '14px' }} />
                <p className="text-gray-500" style={{ fontSize: '14px' }}>
                  Complete at least <span className="text-white font-semibold">2 analyses</span> to see your progress chart.
                </p>
                <Link to="/dashboard/new-analysis" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition" style={{ marginTop: '16px', fontSize: '14px' }}>
                  <Camera className="w-4 h-4" /> Start new analysis
                </Link>
              </div>
            ) : (
              <div style={{ height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
                    <defs>
                      {METRICS.map(m => (
                        <linearGradient key={m.key} id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor={m.stop1} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={m.stop2} stopOpacity={0}    />
                        </linearGradient>
                      ))}
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />

                    <XAxis
                      dataKey="date"
                      stroke="transparent"
                      tick={{ fill: '#4b5563', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 10]}
                      ticks={[0, 2, 4, 6, 8, 10]}
                      stroke="transparent"
                      tick={{ fill: '#4b5563', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1, strokeDasharray: '4 4' }} />

                    {METRICS.map(m =>
                      activeMetrics.has(m.key) ? (
                        <Area
                          key={m.key}
                          type="monotoneX"
                          dataKey={m.key}
                          name={m.label}
                          stroke={m.color}
                          strokeWidth={2.5}
                          fill={`url(#grad-${m.key})`}
                          dot={false}
                          activeDot={{
                            r: 5,
                            fill: m.color,
                            stroke: '#0a0c16',
                            strokeWidth: 2,
                            style: { filter: `drop-shadow(0 0 6px ${m.color})` },
                          }}
                        />
                      ) : null
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Trend Summary */}
            {history.length >= 2 && (
              <div style={{
                marginTop: '32px', paddingTop: '28px',
                display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '20px',
                borderTop: '1px solid var(--border)',
              }}>
                {METRICS.map(m => {
                  const trend  = getTrend(m.key);
                  const latest = latestAnalysis[m.key] ?? 0;
                  const prev   = history[1]?.[m.key]  ?? 0;
                  const diff   = latest - prev;
                  return (
                    <div key={m.key} style={{ textAlign: 'center', padding: '8px 0' }}>
                      <p className="text-gray-600" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '6px' }}>{m.label}</p>
                      <p style={{ fontSize: '24px', fontWeight: 800, color: m.color, textShadow: `0 0 10px ${m.glow}` }}>{latest}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginTop: '4px' }}>
                        {trend === 'up'      && <><TrendingUp   className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400" style={{ fontSize: '10px' }}>{Math.abs(diff)}</span></>}
                        {trend === 'down'    && <><TrendingDown className="w-3 h-3 text-red-400"     /><span className="text-red-400"     style={{ fontSize: '10px' }}>{Math.abs(diff)}</span></>}
                        {trend === 'neutral' && <Minus className="w-3 h-3 text-gray-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Latest + CTA ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
            <div style={{
              padding: '32px',
              borderRadius: '20px',
              background: 'var(--bg-surface)',
              border: '1px solid rgba(16,185,129,0.18)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>Latest Analysis</h2>
                <span className="text-gray-500" style={{ fontSize: '14px' }}>
                  {new Date(latestAnalysis.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-surface2)' }}>
                  {latestAnalysis.image_url && latestAnalysis.image_url !== 'no-image' ? (
                    <img src={latestAnalysis.image_url} alt="Latest scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', fontSize: '12px' }}>No image</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p className="text-gray-400" style={{ fontSize: '14px', marginBottom: '20px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {latestAnalysis.routine?.split(' | ')[0] || 'No summary available.'}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {METRICS.map(m => (
                      <div key={m.key} style={{
                        borderRadius: '14px', padding: '12px 8px', textAlign: 'center',
                        background: `${m.color}10`, border: `1px solid ${m.color}20`,
                      }}>
                        <p style={{ fontSize: '18px', fontWeight: 700, color: m.color }}>{latestAnalysis[m.key] ?? '—'}</p>
                        <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px', fontWeight: 500 }}>{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              borderRadius: '20px', padding: '32px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #065f46, #047857)', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div>
                <h2 className="text-white" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Ready for a checkup?</h2>
                <p style={{ color: '#a7f3d0', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>Track your progress by taking a new photo today.</p>
              </div>
              <Link to="/dashboard/new-analysis"
                style={{
                  color: '#fff', fontWeight: 600, padding: '14px', borderRadius: '14px',
                  textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
              >
                <Camera className="w-5 h-5" /> New Analysis
              </Link>
            </div>
          </div>

          {/* ── Recommendations ── */}
          {latestAnalysis.routine && (
            <div style={{
              padding: '32px', borderRadius: '20px',
              background: 'var(--bg-surface)', border: '1px solid rgba(16,185,129,0.18)',
            }}>
              <h2 className="text-white" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Recommended Routine</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {latestAnalysis.routine.split(' | ').filter(Boolean).map((rec: string, idx: number) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '14px',
                    padding: '18px', borderRadius: '16px',
                    background: 'var(--bg-surface2)', border: '1px solid var(--border)',
                    transition: 'transform 0.15s ease',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(4px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(0)')}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, flexShrink: 0,
                      color: '#34d399', background: 'rgba(52,211,153,0.12)',
                    }}>
                      {idx + 1}
                    </div>
                    <p className="text-gray-300" style={{ fontSize: '14px', lineHeight: 1.6 }}>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}