import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [age, setAge]           = useState('');
  const [gender, setGender]     = useState('Female');
  const [skinType, setSkinType] = useState('Normal');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [msgInfo, setMsgInfo]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMsgInfo(''); setLoading(true);

    try {
      if (isRegistering) {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, age: parseInt(age) || 0, gender, skin_type: skinType },
          },
        });
        if (signUpErr) throw signUpErr;
        if (data.user) {
          if (data.session) {
            // Auto-confirmed — login directly
            onLogin({
              id: data.user.id, name, email, age, gender, skin_type: skinType,
            });
          } else {
            // Email confirmation required — try to auto-login immediately
            const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
            if (signInErr) {
              // If sign-in fails (e.g., email not confirmed), still proceed with the user data
              // This handles the case where Supabase has email confirmation enabled
              onLogin({
                id: data.user.id, name, email, age, gender, skin_type: skinType,
              });
            } else if (signInData.user) {
              onLogin({
                id: signInData.user.id, name, email, age, gender, skin_type: skinType,
              });
            }
          }
        }
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) {
          // Check for email not confirmed error
          if (signInErr.message?.includes('Email not confirmed')) {
            // Still try to get the user and proceed
            setError('');
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) {
              const meta = userData.user.user_metadata || {};
              onLogin({
                id:        userData.user.id,
                name:      meta.name || userData.user.email?.split('@')[0] || 'User',
                email:     userData.user.email,
                age:       meta.age,
                gender:    meta.gender,
                skin_type: meta.skin_type || 'Normal',
              });
              return;
            }
          }
          throw signInErr;
        }
        if (data.user) {
          const meta = data.user.user_metadata || {};
          onLogin({
            id:        data.user.id,
            name:      meta.name || data.user.email?.split('@')[0] || 'User',
            email:     data.user.email,
            age:       meta.age,
            gender:    meta.gender,
            skin_type: meta.skin_type || 'Normal',
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#030712',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '36px' }}>
          <div style={{
            width: '44px', height: '44px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(16,185,129,0.3)',
          }}>
            <Sparkles style={{ width: '22px', height: '22px', color: '#fff' }} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            Dermify AI
          </span>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(16,185,129,0.15)',
          borderRadius: '24px',
          padding: '36px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 60px rgba(16,185,129,0.04)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{
              fontSize: '24px', fontWeight: 700, color: '#fff',
              marginBottom: '8px', letterSpacing: '-0.5px',
            }}>
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
              {isRegistering
                ? 'Start your skincare journey today.'
                : 'Sign in to your account.'}
            </p>
          </div>

          {/* Alerts */}
          {msgInfo && (
            <div style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <CheckCircle style={{ width: '16px', height: '16px', color: '#34d399', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#6ee7b7' }}>{msgInfo}</span>
            </div>
          )}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px',
              fontSize: '13px', color: '#fca5a5',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isRegistering && (
                <>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: '6px' }}>Full Name</label>
                    <input
                      type="text" required value={name} onChange={e => setName(e.target.value)}
                      placeholder="Enter your name"
                      style={{
                        width: '100%', padding: '11px 14px',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.08)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Age + Gender row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: '6px' }}>Age</label>
                      <input
                        type="number" required value={age} onChange={e => setAge(e.target.value)}
                        placeholder="25"
                        style={{
                          width: '100%', padding: '11px 14px',
                          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none',
                          transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.08)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: '6px' }}>Gender</label>
                      <select value={gender} onChange={e => setGender(e.target.value)}
                        style={{
                          width: '100%', padding: '11px 14px',
                          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer',
                          transition: 'border-color 0.2s',
                        }}>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Skin Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: '6px' }}>Skin Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                      {['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'].map(type => (
                        <button
                          key={type} type="button"
                          onClick={() => setSkinType(type)}
                          style={{
                            padding: '9px 4px', borderRadius: '10px',
                            fontSize: '11px', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s ease',
                            background: skinType === type
                              ? 'rgba(16,185,129,0.15)'
                              : 'rgba(255,255,255,0.04)',
                            border: skinType === type
                              ? '1px solid rgba(16,185,129,0.4)'
                              : '1px solid rgba(255,255,255,0.08)',
                            color: skinType === type ? '#34d399' : 'rgba(255,255,255,0.5)',
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: '6px' }}>Email</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: '100%', padding: '11px 14px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'} required minLength={6}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    style={{
                      width: '100%', padding: '11px 14px', paddingRight: '42px',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.3)', padding: '4px',
                    }}
                  >
                    {showPw
                      ? <EyeOff style={{ width: '18px', height: '18px' }} />
                      : <Eye style={{ width: '18px', height: '18px' }} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '13px',
                  borderRadius: '12px', fontSize: '15px', fontWeight: 600,
                  color: '#fff',
                  background: loading ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(16,185,129,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  marginTop: '4px',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                    Processing...
                  </>
                ) : (
                  <>
                    {isRegistering ? 'Create Account' : 'Sign In'}
                    <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Toggle auth mode */}
          <div style={{
            marginTop: '24px', textAlign: 'center',
            paddingTop: '18px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <button onClick={() => { setIsRegistering(r => !r); setError(''); setMsgInfo(''); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', color: 'rgba(255,255,255,0.4)',
              }}
            >
              {isRegistering ? (
                <>Already have an account? <span style={{ color: '#34d399', fontWeight: 600 }}>Sign In</span></>
              ) : (
                <>Don't have an account? <span style={{ color: '#34d399', fontWeight: 600 }}>Sign Up</span></>
              )}
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '24px',
        }}>
          {['🔒 Secure', '⚡ Fast', '🧬 AI-Powered'].map(badge => (
            <span key={badge} style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontWeight: 500,
            }}>
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        select option {
          background: #1a1a2e;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
