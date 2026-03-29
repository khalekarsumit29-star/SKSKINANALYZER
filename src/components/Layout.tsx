import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, History, LogOut, ShoppingBag, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../ThemeContext';


export default function Layout({ user, onLogout }: { user: any; onLogout: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/dashboard',              label: 'Dashboard',    icon: Home        },
    { path: '/dashboard/new-analysis', label: 'New Analysis', icon: Camera      },
    { path: '/dashboard/history',      label: 'History',      icon: History     },
    { path: '/dashboard/products',     label: 'Products',     icon: ShoppingBag },
  ];

  const handleLogout = async () => {
    await onLogout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 256,
          minWidth: 256,
          maxWidth: 256,
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--bg-surface)',
          overflowY: 'auto',
        }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-lg font-bold text-emerald-400 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Dermify AI
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle Switch */}
        <div className="px-4 pb-3">
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 border border-transparent hover:border-gray-700"
          >
            <div
              className="relative w-11 h-6 rounded-full transition-all duration-300 flex items-center shrink-0"
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, #1e3a5f, #0f2540)'
                  : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                boxShadow: theme === 'dark'
                  ? 'inset 0 1px 3px rgba(0,0,0,0.4), 0 0 8px rgba(96,165,250,0.15)'
                  : 'inset 0 1px 3px rgba(0,0,0,0.2), 0 0 8px rgba(251,191,36,0.25)',
              }}
            >
              {/* Track decorations */}
              {theme === 'dark' && (
                <>
                  <span className="absolute top-1 right-2 w-0.5 h-0.5 rounded-full bg-white/40" />
                  <span className="absolute top-2.5 right-3 w-1 h-1 rounded-full bg-white/20" />
                  <span className="absolute bottom-1.5 right-1.5 w-0.5 h-0.5 rounded-full bg-white/30" />
                </>
              )}
              {/* Thumb */}
              <div
                className="absolute w-5 h-5 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
                style={{
                  left: theme === 'dark' ? '2px' : 'calc(100% - 22px)',
                  background: theme === 'dark'
                    ? 'linear-gradient(135deg, #e2e8f0, #cbd5e1)'
                    : 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                  boxShadow: theme === 'dark'
                    ? '0 1px 4px rgba(0,0,0,0.4)'
                    : '0 1px 4px rgba(0,0,0,0.2), 0 0 6px rgba(251,191,36,0.4)',
                }}
              >
                {theme === 'dark'
                  ? <Moon className="w-3 h-3 text-slate-700" />
                  : <Sun className="w-3 h-3 text-amber-600" />}
              </div>
            </div>
            <span className="text-xs">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
        </div>

        {/* User + Logout */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/80">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}>
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-xl text-sm text-gray-400 hover:bg-red-600/15 hover:text-red-400 border border-transparent hover:border-red-600/25 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main
        style={{
          marginLeft: 256,
          flex: 1,
          minHeight: '100vh',
          backgroundColor: 'var(--bg-base)',
          overflowX: 'hidden',
        }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 48px' }}>
          <Outlet />
        </div>
      </main>


    </div>
  );
}