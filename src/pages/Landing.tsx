import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import {
  Sparkles, Camera, Shield, Brain, TrendingUp,
  ChevronRight, Star, Zap, Heart,
  Sun, Moon, ArrowRight, Scan,
  Droplets, Leaf, Activity, Users, Award, Clock,
  CheckCircle, Globe, Lock, Cpu
} from 'lucide-react';
import { motion } from 'motion/react';


export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setActiveFeature(prev => (prev + 1) % 4), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('mousemove', handleMouse); window.removeEventListener('scroll', handleScroll); };
  }, []);

  const features = [
    { icon: Scan, title: 'AI Skin Analysis', desc: 'Advanced AI scans your skin in seconds providing detailed scoring across 6 key health metrics with clinical-grade accuracy.', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { icon: Droplets, title: 'Personalized Routines', desc: 'Get tailored skincare routines based on your unique skin profile, concerns, and goals with smart product recommendations.', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { icon: Leaf, title: 'Smart Product Recs', desc: 'Get personalized product recommendations tailored to your unique skin profile. Discover the best cleansers, serums, and treatments for your needs.', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { icon: TrendingUp, title: 'Progress Tracking', desc: 'Monitor your skin health journey over time with visual analytics, trend charts, and improvement insights.', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  ];

  const howItWorks = [
    { step: '01', title: 'Snap a Photo', desc: 'Take or upload a clear photo of your face', icon: Camera },
    { step: '02', title: 'AI Analyzes', desc: 'Our AI examines 6 key skin health metrics', icon: Brain },
    { step: '03', title: 'Get Results', desc: 'Receive detailed scores and personalized tips', icon: Activity },
    { step: '04', title: 'Track Progress', desc: 'Monitor improvements over time with analytics', icon: TrendingUp },
  ];

  const testimonials = [
    { name: 'Eshwari K', role: 'Skincare Enthusiast', text: '"Dermify AI completely transformed my skincare routine. The analysis was spot-on and the product recommendations actually worked!"', rating: 5, avatar: 'E' },
    { name: 'Aishwarya Rai', role: 'First-time User', text: '"I had no idea about my skin type before using this. The analysis explained everything so clearly. Highly recommended!"', rating: 5, avatar: 'A' },
    { name: 'Priya K.', role: 'Beauty Blogger', text: '"The progress tracking feature is amazing. I can visually see how my skin has improved over the past 3 months."', rating: 5, avatar: 'P' },
  ];

  const stats = [
    { value: '50K+', label: 'Skin Analyses', icon: Scan },
    { value: '99.2%', label: 'Accuracy Rate', icon: Award },
    { value: '10K+', label: 'Happy Users', icon: Users },
    { value: '<3s', label: 'Analysis Time', icon: Clock },
  ];

  const techFeatures = [
    { icon: Cpu, title: 'Gemini AI Engine', desc: 'Powered by Google\'s latest AI model' },
    { icon: Lock, title: 'Encrypted & Private', desc: 'Your data is never shared or stored' },
    { icon: Globe, title: 'Works Everywhere', desc: 'Access from any device, any browser' },
  ];

  const c = isDark ? {
    bg: '#030712', surface: '#111827', surface2: '#1f2937',
    border: 'rgba(255,255,255,0.06)', text1: '#f9fafb', text2: '#9ca3af', text3: '#6b7280',
    cardBg: 'rgba(17,24,39,0.8)', cardBorder: 'rgba(255,255,255,0.06)',
    glassBg: 'rgba(17,24,39,0.6)', glassBlur: '20px',
    heroBg: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(16,185,129,0.15), transparent 70%)',
    navBg: 'rgba(3,7,18,0.85)',
  } : {
    bg: '#f8fafc', surface: '#ffffff', surface2: '#f1f5f9',
    border: 'rgba(0,0,0,0.08)', text1: '#0f172a', text2: '#475569', text3: '#94a3b8',
    cardBg: 'rgba(255,255,255,0.9)', cardBorder: 'rgba(0,0,0,0.08)',
    glassBg: 'rgba(255,255,255,0.7)', glassBlur: '20px',
    heroBg: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(16,185,129,0.08), transparent 70%)',
    navBg: 'rgba(248,250,252,0.85)',
  };

  const analysisMetrics = [
    { label: 'Hydration', score: 85, color: '#3b82f6' },
    { label: 'Clarity', score: 78, color: '#10b981' },
    { label: 'Elasticity', score: 92, color: '#8b5cf6' },
    { label: 'Tone', score: 88, color: '#f59e0b' },
    { label: 'Texture', score: 74, color: '#ef4444' },
    { label: 'Overall', score: 83, color: '#10b981' },
  ];

  return (
    <div style={{ background: c.bg, color: c.text1, minHeight: '100vh', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>

      {/* Ambient Cursor Glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${isDark ? 'rgba(16,185,129,0.04)' : 'rgba(16,185,129,0.03)'}, transparent 60%)`,
      }} />

      {/* ═══ NAVBAR ═══ */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: c.navBg, backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${scrolled ? c.border : 'transparent'}`,
          transition: 'border-color 0.3s',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
            }}>
              <Sparkles style={{ width: 20, height: 20, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
              Dermify <span style={{ color: '#10b981' }}>AI</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {['Features', 'How It Works', 'Reviews'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                style={{ padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: c.text2, textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = c.text1; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = c.text2; e.currentTarget.style.background = 'transparent'; }}
              >{item}</a>
            ))}
            <button onClick={toggleTheme} style={{
              width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${c.border}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              cursor: 'pointer', color: c.text2, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.text2; }}
            >
              {isDark ? <Sun style={{ width: 18, height: 18 }} /> : <Moon style={{ width: 18, height: 18 }} />}
            </button>
            <button onClick={() => navigate('/login')} style={{
              padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600,
              color: '#fff', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 4px 16px rgba(16,185,129,0.3)', transition: 'all 0.3s', marginLeft: 8,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.3)'; }}
            >Get Started</button>
          </div>
        </div>
      </motion.nav>

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: c.heroBg }} />
        {/* Floating Orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 300, height: 300, borderRadius: '50%', filter: 'blur(80px)', opacity: isDark ? 0.1 : 0.06, background: '#10b981', animation: 'float1 8s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', right: '10%', width: 250, height: 250, borderRadius: '50%', filter: 'blur(80px)', opacity: isDark ? 0.07 : 0.04, background: '#8b5cf6', animation: 'float2 10s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '40%', width: 200, height: 200, borderRadius: '50%', filter: 'blur(80px)', opacity: isDark ? 0.06 : 0.03, background: '#3b82f6', animation: 'float1 12s ease-in-out infinite', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto' }}>

          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px 6px 8px', borderRadius: 999,
              background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              fontSize: 13, fontWeight: 600, color: '#10b981', marginBottom: 32,
            }}>
            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}>NEW</span>
            Powered by Google Gemini AI
          </motion.div>

          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24 }}>
            Your Skin,{' '}
            <span style={{ background: 'linear-gradient(135deg, #10b981, #34d399, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Decoded by AI
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: c.text2, maxWidth: 580, margin: '0 auto 44px', lineHeight: 1.7 }}>
            Upload a selfie and get instant AI-powered skin analysis with personalized routines, product recommendations, and progress tracking.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              style={{
                padding: '16px 36px', borderRadius: 16, border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 8px 32px rgba(16,185,129,0.35), 0 0 60px rgba(16,185,129,0.1)',
              }}>
              Start Free Analysis <ArrowRight style={{ width: 18, height: 18 }} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '16px 36px', borderRadius: 16,
                border: `1px solid ${c.border}`,
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: c.text1, fontSize: 16, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                backdropFilter: 'blur(10px)',
              }}>
              See How It Works <ChevronRight style={{ width: 18, height: 18 }} />
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }}
            style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
            {[
              { icon: Shield, text: 'Privacy First', color: '#10b981' },
              { icon: Zap, text: 'Instant Results', color: '#f59e0b' },
              { icon: Heart, text: 'Dermatologist Informed', color: '#ef4444' },
            ].map(t => (
              <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: c.text3, fontSize: 13, fontWeight: 500 }}>
                <t.icon style={{ width: 15, height: 15, color: t.color }} /> {t.text}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero Preview Card */}
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 740, margin: '64px auto 0' }}>
          <div style={{
            background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 24, padding: 32,
            backdropFilter: `blur(${c.glassBlur})`,
            boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.4), 0 0 80px rgba(16,185,129,0.06)' : '0 24px 64px rgba(0,0,0,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: c.text2 }}>Live Analysis Preview</span>
              <div style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 999, background: 'rgba(16,185,129,0.1)', fontSize: 11, fontWeight: 600, color: '#10b981' }}>AI Active</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {analysisMetrics.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    borderRadius: 16, padding: 16, textAlign: 'center',
                  }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.score}</div>
                  <div style={{ fontSize: 12, color: c.text3, fontWeight: 500, marginTop: 4 }}>{item.label}</div>
                  <div style={{ marginTop: 8, height: 3, borderRadius: 99, overflow: 'hidden', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.score}%` }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 99, background: item.color }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                textAlign: 'center', padding: 24, borderRadius: 20,
                background: c.cardBg, border: `1px solid ${c.cardBorder}`, backdropFilter: `blur(${c.glassBlur})`,
              }}>
              <stat.icon style={{ width: 20, height: 20, color: '#10b981', margin: '0 auto 8px' }} />
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: c.text3, fontWeight: 500 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ padding: '80px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 999,
              background: isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.15)', fontSize: 12, fontWeight: 600, color: '#10b981',
              marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              <Leaf style={{ width: 13, height: 13 }} /> Features
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
              Everything Your Skin Needs
            </h2>
            <p style={{ color: c.text2, fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
              Cutting-edge AI technology meets dermatological expertise for the most accurate skin analysis.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              const isActive = activeFeature === i;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                  onMouseEnter={() => setActiveFeature(i)}
                  style={{
                    padding: 32, borderRadius: 24, minHeight: 220,
                    display: 'flex', flexDirection: 'column',
                    background: isActive ? c.cardBg : (isDark ? 'rgba(17,24,39,0.4)' : 'rgba(255,255,255,0.5)'),
                    border: `1px solid ${isActive ? f.color + '30' : c.cardBorder}`,
                    backdropFilter: `blur(${c.glassBlur})`, cursor: 'pointer', transition: 'all 0.4s ease',
                    boxShadow: isActive ? `0 8px 32px ${f.color}15, 0 0 60px ${f.color}08` : 'none',
                  }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, background: f.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20, boxShadow: `0 4px 16px ${f.color}30`,
                    transition: 'all 0.3s', transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}>
                    <Icon style={{ width: 22, height: 22, color: '#fff' }} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.3px' }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: c.text2, lineHeight: 1.7, flex: 1 }}>{f.desc}</p>
                  <div style={{
                    marginTop: 16, display: 'flex', alignItems: 'center', gap: 6,
                    color: isActive ? f.color : c.text3, fontSize: 13, fontWeight: 600,
                    opacity: isActive ? 1 : 0.5, transition: 'all 0.3s',
                  }}>
                    Learn more <ArrowRight style={{ width: 14, height: 14 }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 999,
              background: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.06)',
              border: '1px solid rgba(59,130,246,0.15)', fontSize: 12, fontWeight: 600, color: '#3b82f6',
              marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              <Zap style={{ width: 13, height: 13 }} /> How It Works
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
              Three Minutes to Better Skin
            </h2>
            <p style={{ color: c.text2, fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
              Our AI-powered platform makes skin analysis effortless and accessible.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {howItWorks.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }}
                  style={{
                    textAlign: 'center', padding: 28, borderRadius: 24,
                    background: c.cardBg, border: `1px solid ${c.cardBorder}`,
                    backdropFilter: `blur(${c.glassBlur})`, position: 'relative',
                  }}>
                  <div style={{
                    fontSize: 48, fontWeight: 900,
                    color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                    position: 'absolute', top: 12, right: 16, lineHeight: 1,
                  }}>{step.step}</div>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
                  }}>
                    <Icon style={{ width: 22, height: 22, color: '#fff' }} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: c.text3, lineHeight: 1.6 }}>{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ TECH STRIP ═══ */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {techFeatures.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div key={t.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: 24, borderRadius: 20,
                  background: isDark ? 'rgba(16,185,129,0.04)' : 'rgba(16,185,129,0.03)',
                  border: `1px solid ${isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)'}`,
                }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon style={{ width: 20, height: 20, color: '#10b981' }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: c.text3 }}>{t.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="reviews" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 999,
              background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.15)', fontSize: 12, fontWeight: 600, color: '#8b5cf6',
              marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              <Star style={{ width: 13, height: 13 }} /> Reviews
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
              Loved by Thousands
            </h2>
            <p style={{ color: c.text2, fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
              See what our users have to say about their skin transformation journey.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }}
                style={{
                  padding: 28, borderRadius: 24, background: c.cardBg,
                  border: `1px solid ${c.cardBorder}`, backdropFilter: `blur(${c.glassBlur})`,
                  display: 'flex', flexDirection: 'column',
                }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} style={{ width: 16, height: 16, fill: '#f59e0b', color: '#f59e0b' }} />
                  ))}
                </div>
                <p style={{ fontSize: 14, color: c.text2, lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic', flex: 1 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 16,
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: c.text3 }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding: '80px 24px 100px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{
            maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: 56, borderRadius: 32,
            background: isDark
              ? 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.05))'
              : 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(59,130,246,0.04))',
            border: `1px solid ${isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.12)'}`,
            position: 'relative', overflow: 'hidden',
          }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(16,185,129,0.06)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(59,130,246,0.05)', filter: 'blur(50px)', pointerEvents: 'none' }} />
          <Sparkles style={{ width: 36, height: 36, color: '#10b981', margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
            Ready to Transform Your Skin?
          </h2>
          <p style={{ color: c.text2, fontSize: 17, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Join thousands of users who have already discovered their skin's potential with Dermify AI.
          </p>
          <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            style={{
              padding: '16px 40px', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff', fontSize: 17, fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '0 8px 32px rgba(16,185,129,0.35)',
            }}>
            Get Started — It's Free <ArrowRight style={{ width: 18, height: 18 }} />
          </motion.button>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: '32px 24px', textAlign: 'center', borderTop: `1px solid ${c.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles style={{ width: 14, height: 14, color: '#fff' }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Dermify AI</span>
        </div>
        <p style={{ fontSize: 13, color: c.text3 }}>
          © {new Date().getFullYear()} Dermify AI. skincare analysis platform by Sumit K.
        </p>
      </footer>



      {/* ═══ ANIMATIONS ═══ */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section > div > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          section > div > div[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
