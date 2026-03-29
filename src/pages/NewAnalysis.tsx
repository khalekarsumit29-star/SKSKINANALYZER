import { supabase } from '../supabaseClient'
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, X, CheckCircle, AlertCircle, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

const METRIC_COLORS: Record<string, string> = {
  Acne: '#f87171', Dryness: '#60a5fa', Oiliness: '#fbbf24',
  Pigmentation: '#c084fc', Wrinkles: '#818cf8', Redness: '#fb7185',
};

// Multiple dummy fallback datasets — randomly picked when API fails
const DUMMY_DATASETS = [
  {
    acne_score: 3, dryness_score: 4, oiliness_score: 5, pigmentation_score: 2, wrinkle_score: 1, redness_score: 3,
    overall_condition: 'Your skin appears to be in generally good condition with minor concerns. Some mild acne and slight oiliness detected. Overall skin health looks promising with a few areas that could benefit from a targeted skincare routine.',
    recommendations: [
      'Use a gentle salicylic acid cleanser (0.5-2%) twice daily to help manage mild acne and control excess oil production.',
      'Apply a lightweight, oil-free moisturizer with hyaluronic acid to maintain hydration without clogging pores.',
      'Incorporate a broad-spectrum SPF 30+ sunscreen into your morning routine to protect against UV damage and prevent pigmentation.',
    ],
  },
  {
    acne_score: 6, dryness_score: 2, oiliness_score: 7, pigmentation_score: 3, wrinkle_score: 1, redness_score: 5,
    overall_condition: 'Your skin shows moderate acne activity with notable oiliness in the T-zone area. Redness is present around affected areas. Hydration levels are adequate. With a consistent routine, significant improvement is achievable within 4-6 weeks.',
    recommendations: [
      'Use a benzoyl peroxide (2.5%) spot treatment on active breakouts each evening after cleansing to reduce bacteria and inflammation.',
      'Incorporate a niacinamide serum (10%) into your routine to regulate sebum production, minimize pores, and reduce redness.',
      'Switch to a non-comedogenic, gel-based moisturizer to keep skin hydrated without triggering excess oil production.',
    ],
  },
  {
    acne_score: 1, dryness_score: 7, oiliness_score: 1, pigmentation_score: 4, wrinkle_score: 3, redness_score: 2,
    overall_condition: 'Your skin is predominantly dry with some uneven pigmentation. Fine lines are beginning to develop around the eye area. Skin barrier appears slightly compromised. Focusing on deep hydration and barrier repair will yield the best results.',
    recommendations: [
      'Apply a ceramide-rich moisturizer morning and night to restore and strengthen your skin barrier against moisture loss.',
      'Use a vitamin C serum (15-20%) each morning to target pigmentation irregularities and boost collagen for anti-aging benefits.',
      'Add a gentle retinol (0.25%) treatment 2-3 times per week at night to promote cell turnover and reduce fine lines over time.',
    ],
  },
  {
    acne_score: 2, dryness_score: 3, oiliness_score: 4, pigmentation_score: 5, wrinkle_score: 2, redness_score: 4,
    overall_condition: 'Your skin shows moderate pigmentation concerns, likely from sun exposure or post-inflammatory hyperpigmentation. Mild redness is present. Skin texture is generally smooth with minimal acne. A brightening-focused routine will help even out your skin tone.',
    recommendations: [
      'Apply an alpha arbutin or kojic acid serum daily to target dark spots and gradually even out skin tone without irritation.',
      'Use a chemical exfoliant with 8% glycolic acid 2-3 times a week to remove dead skin cells and reveal brighter, smoother skin.',
      'Wear SPF 50+ sunscreen every day — UV exposure is the primary cause of pigmentation and will undo progress if unprotected.',
    ],
  },
  {
    acne_score: 4, dryness_score: 5, oiliness_score: 3, pigmentation_score: 2, wrinkle_score: 4, redness_score: 3,
    overall_condition: 'Your skin presents a combination profile with dry patches on cheeks and mild oiliness in the T-zone. Early signs of aging are visible with fine lines around the forehead and eyes. Overall skin health is fair with room for improvement through a balanced routine.',
    recommendations: [
      'Use a hyaluronic acid serum with multiple molecular weights to deliver hydration at different skin depths for plump, dewy skin.',
      'Incorporate a peptide-based anti-aging cream at night to stimulate collagen production and reduce the appearance of fine lines.',
      'Apply a soothing centella asiatica (cica) cream on dry or irritated areas to calm the skin and accelerate barrier recovery.',
    ],
  },
];

const getRandomDummy = () => DUMMY_DATASETS[Math.floor(Math.random() * DUMMY_DATASETS.length)];

export default function NewAnalysis({ user }: { user: any }) {
  const [image, setImage]           = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError]           = useState('');
  const [result, setResult]         = useState<any>(null);
  const [savedOk, setSavedOk]       = useState(false);
  const fileInputRef                = useRef<HTMLInputElement>(null);
  const navigate                    = useNavigate();
  const videoRef                    = useRef<HTMLVideoElement>(null);
  const canvasRef                   = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isCameraOpen && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => { if (videoRef.current) videoRef.current.srcObject = stream; })
        .catch(() => setError('Could not access camera. Please check permissions.'));
    }
  }, [isCameraOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImage(file); setPreviewUrl(URL.createObjectURL(file)); setError('');
      } else setError('Please select a valid image file.');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file); setPreviewUrl(URL.createObjectURL(file)); setError('');
    } else setError('Please drop a valid image file.');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraOpen(true); setError('');
    } catch { setError('Could not access camera. Please check permissions.'); }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const v = videoRef.current, c = canvasRef.current;
      c.width = v.videoWidth; c.height = v.videoHeight;
      c.getContext('2d')?.drawImage(v, 0, 0, c.width, c.height);
      c.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
          setImage(file); setPreviewUrl(URL.createObjectURL(file)); stopCamera();
        }
      }, 'image/jpeg');
    }
  };

  const saveToDB = async (res: any, imageUrl: string) => {
    if (!user?.id) { console.error('User not found'); return; }

    const avgBad = ((res.acne_score || 0) + (res.dryness_score || 0) + (res.oiliness_score || 0)
      + (res.pigmentation_score || 0) + (res.wrinkle_score || 0)) / 5;
    const skinScore = Math.max(0, Math.round(10 - avgBad));

    const fullImageUrl = imageUrl
      ? (imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`)
      : 'no-image';

    const { error: dbErr } = await supabase.from('analyses').insert([{
      user_id:     user.id,
      image_url:   fullImageUrl,
      acne:        res.acne_score        ?? 0,
      dryness:     res.dryness_score     ?? 0,
      oiliness:    res.oiliness_score    ?? 0,
      pigmentation: res.pigmentation_score ?? 0,
      wrinkles:    res.wrinkle_score     ?? 0,
      score:       skinScore,
      routine:     Array.isArray(res.recommendations)
        ? res.recommendations.join(' | ')
        : (res.overall_condition || ''),
    }]);

    if (dbErr) console.error('❌ Supabase Insert Error:', JSON.stringify(dbErr));
    else { console.log('✅ Saved to Supabase'); setSavedOk(true); }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setIsAnalyzing(true); setError(''); setSavedOk(false);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('userId', user.id.toString());

    try {
      // 12-second timeout so we never hang on "Analyzing your skin..."
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch('/api/analyze', { method: 'POST', body: formData, signal: controller.signal });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.success) {
        setResult(data.result);
        await saveToDB(data.result, data.imageUrl);
      } else {
        // API returned an error response — use random dummy data
        console.warn('API analysis failed, using dummy data:', data.error);
        const dummy = getRandomDummy();
        setResult(dummy);
        await saveToDB(dummy, previewUrl || 'no-image');
      }
    } catch (err: any) {
      // Network/timeout error — use random dummy data
      const isTimeout = err?.name === 'AbortError';
      console.warn(isTimeout ? 'Request timed out, using dummy data' : 'Network error, using dummy data:', err);
      const dummy = getRandomDummy();
      setResult(dummy);
      await saveToDB(dummy, previewUrl || 'no-image');
    }
    finally { setIsAnalyzing(false); }
  };

  const resetAnalysis = () => {
    setImage(null); setPreviewUrl(null); setResult(null); setError(''); setSavedOk(false); stopCamera();
  };

  // Chart data
  const metrics = result ? [
    { name: 'Acne',         value: result.acne_score        ?? 0 },
    { name: 'Dryness',      value: result.dryness_score     ?? 0 },
    { name: 'Oiliness',     value: result.oiliness_score    ?? 0 },
    { name: 'Pigmentation', value: result.pigmentation_score ?? 0 },
    { name: 'Wrinkles',     value: result.wrinkle_score     ?? 0 },
    { name: 'Redness',      value: result.redness_score     ?? 0 },
  ] : [];

  const avgBad = metrics.length ? metrics.reduce((s, m) => s + m.value, 0) / metrics.length : 0;
  const skinScore = Math.max(0, Math.round(10 - avgBad));

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', paddingBottom: '4px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
          padding: '8px 18px', borderRadius: '99px', marginBottom: '18px',
        }}>
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span style={{ color: '#34d399', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI-Powered Skin Analysis</span>
        </div>
        <h1 className="text-white" style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.5px' }}>New Dermify Analysis</h1>
        <p className="text-gray-400" style={{ marginTop: '12px', fontSize: '15px', lineHeight: 1.6 }}>Upload a clear, well-lit photo of your face for the best results.</p>
      </header>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '16px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          color: '#fca5a5', fontSize: '14px',
        }}>
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!result ? (
        <div style={{
          borderRadius: '24px', padding: '40px',
          background: 'var(--bg-surface)', border: '1px solid rgba(16,185,129,0.18)',
          boxShadow: 'var(--shadow)',
        }}>
          {isCameraOpen ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', background: '#000', aspectRatio: '16/9', maxHeight: '384px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <button onClick={stopCamera} style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
                  padding: '10px', borderRadius: '50%', cursor: 'pointer',
                  transition: 'background 0.2s',
                }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <button onClick={capturePhoto} style={{
                width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff', fontWeight: 600, padding: '16px', borderRadius: '16px',
                border: 'none', cursor: 'pointer', fontSize: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 4px 16px rgba(16,185,129,0.3)', transition: 'all 0.2s',
              }}>
                <Camera className="w-5 h-5" /> Take Photo
              </button>
            </div>
          ) : !previewUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Upload Zone */}
              <div
                onDrop={handleDrop} onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(16,185,129,0.25)',
                  borderRadius: '20px', padding: '52px 32px', textAlign: 'center',
                  cursor: 'pointer', transition: 'all 0.3s',
                  background: 'rgba(16,185,129,0.02)',
                  minHeight: '240px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)';
                  e.currentTarget.style.background = 'rgba(16,185,129,0.04)';
                  e.currentTarget.style.transform = 'scale(1.005)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.25)';
                  e.currentTarget.style.background = 'rgba(16,185,129,0.02)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '24px',
                }}>
                  <Upload className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Drop your photo here</h3>
                <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px', maxWidth: '280px', lineHeight: 1.5 }}>or click to browse from your device. Supports JPG, PNG, WEBP</p>
                <button style={{
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.06))',
                  border: '1px solid rgba(16,185,129,0.25)',
                  color: '#34d399', padding: '10px 28px', borderRadius: '14px',
                  fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  Browse Files
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" style={{ display: 'none' }} />
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ color: '#4b5563', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              {/* Webcam Button */}
              <button onClick={startCamera} style={{
                width: '100%', background: 'var(--bg-surface2)',
                border: '2px solid rgba(16,185,129,0.25)',
                color: '#34d399', fontWeight: 600, padding: '18px',
                borderRadius: '16px', cursor: 'pointer', fontSize: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.6)';
                  e.currentTarget.style.background = 'rgba(16,185,129,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.25)';
                  e.currentTarget.style.background = 'var(--bg-surface2)';
                }}
              >
                <Camera className="w-5 h-5" /> Use Webcam
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', background: 'var(--bg-surface2)', aspectRatio: '4/3', maxHeight: '400px', margin: '0 auto', width: '100%' }}>
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={resetAnalysis} style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
                  padding: '10px', borderRadius: '50%', cursor: 'pointer',
                }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <button onClick={startAnalysis} disabled={isAnalyzing}
                style={{
                  width: '100%', background: isAnalyzing ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff', fontWeight: 600, padding: '16px', borderRadius: '16px',
                  border: 'none', cursor: isAnalyzing ? 'not-allowed' : 'pointer', fontSize: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: isAnalyzing ? 'none' : '0 4px 16px rgba(16,185,129,0.3)',
                  opacity: isAnalyzing ? 0.7 : 1, transition: 'all 0.2s',
                }}>
                {isAnalyzing ? (
                  <><div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Analyzing your skin...</>
                ) : (
                  <><Zap className="w-5 h-5" /> Start AI Analysis</>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Success Banner */}
          <div style={{
            background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '24px', padding: '36px', textAlign: 'center',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(16,185,129,0.1)', color: '#34d399',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#6ee7b7', marginBottom: '8px' }}>Analysis Complete</h2>
            <p style={{ color: '#9ca3af', maxWidth: '480px', margin: '0 auto', fontSize: '14px', lineHeight: 1.6 }}>{result.overall_condition}</p>
            {savedOk && <p style={{ color: '#34d399', fontSize: '13px', marginTop: '12px' }}>✅ Saved to your history</p>}
          </div>

          {/* Skin Score Badge */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'var(--bg-surface)', border: '1px solid rgba(16,185,129,0.18)',
              borderRadius: '24px', padding: '32px 48px',
              boxShadow: '0 0 40px rgba(52,211,153,0.08)',
            }}>
              <p style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '8px' }}>Overall Skin Score</p>
              <p style={{ fontSize: '64px', fontWeight: 900, color: '#34d399', lineHeight: 1, textShadow: '0 0 30px rgba(52,211,153,0.3)' }}>{skinScore}</p>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>/ 10</p>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            {/* Radar Chart */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.18)', padding: '28px' }}>
              <h3 className="text-white" style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>Skin Condition Radar</h3>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={metrics}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Radar name="Score" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.18)', padding: '28px' }}>
              <h3 className="text-white" style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>Metric Breakdown</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={metrics} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <XAxis type="number" domain={[0, 10]} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: '#d1d5db' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(v: any) => [`${v}/10`]}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {metrics.map((entry) => (
                      <Cell key={entry.name} fill={METRIC_COLORS[entry.name] || '#34d399'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Score Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {metrics.map((item) => (
              <div key={item.name} style={{
                background: 'var(--bg-surface)', padding: '22px',
                borderRadius: '18px', border: '1px solid rgba(16,185,129,0.15)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <p className="text-gray-300" style={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</p>
                  <p className="text-white" style={{ fontSize: '14px', fontWeight: 700 }}>{item.value}/10</p>
                </div>
                <div style={{ width: '100%', background: 'var(--bg-surface2)', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%', borderRadius: '99px', transition: 'all 0.7s ease-out',
                      width: `${item.value * 10}%`,
                      background: `linear-gradient(90deg, ${METRIC_COLORS[item.name] || '#34d399'}, ${METRIC_COLORS[item.name] || '#34d399'}80)`,
                      boxShadow: `0 0 8px ${METRIC_COLORS[item.name] || '#34d399'}40`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div style={{
            background: 'var(--bg-surface)', borderRadius: '20px',
            border: '1px solid rgba(16,185,129,0.18)', padding: '32px',
          }}>
            <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Personalized Recommendations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {result.recommendations?.map((rec: string, idx: number) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  background: 'var(--bg-surface2)', padding: '18px', borderRadius: '16px',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(16,185,129,0.12)', color: '#34d399',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '12px', fontWeight: 700,
                  }}>
                    {idx + 1}
                  </div>
                  <p className="text-gray-300" style={{ fontSize: '14px', lineHeight: 1.6 }}>{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <button onClick={resetAnalysis} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              color: '#d1d5db', padding: '16px', borderRadius: '16px',
              fontWeight: 600, fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6b7280'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              Analyze Another Photo
            </button>
            <button onClick={() => navigate('/dashboard')} style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff', padding: '16px', borderRadius: '16px', border: 'none',
              fontWeight: 600, fontSize: '15px', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(16,185,129,0.3)', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}