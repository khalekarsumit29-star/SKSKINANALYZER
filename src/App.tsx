import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewAnalysis from './pages/NewAnalysis';
import History from './pages/History';
import Products from './pages/Products';
import { supabase } from './supabaseClient';
import { ThemeProvider } from './ThemeContext';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Restore existing Supabase session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        setUser({
          id: session.user.id,
          name: meta.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          age: meta.age,
          gender: meta.gender,
          skin_type: meta.skin_type,
        });
      }
      setAuthLoading(false);
    });

    // Listen for future auth changes (sign-in / sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        setUser({
          id: session.user.id,
          name: meta.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          age: meta.age,
          gender: meta.gender,
          skin_type: meta.skin_type,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (authLoading) {
    return (
      <ThemeProvider>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#030712',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid rgba(16,185,129,0.2)',
            borderTopColor: '#10b981',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Landing page — public, shown when not logged in */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />

          {/* Auth */}
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />

          {/* Authenticated app */}
          <Route path="/dashboard" element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard user={user} />} />
            <Route path="new-analysis" element={<NewAnalysis user={user} />} />
            <Route path="history" element={<History user={user} />} />
            <Route path="products" element={<Products user={user} />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}