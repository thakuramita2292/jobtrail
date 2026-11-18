import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Layout as BoardIcon, User, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/applications', label: 'Applications', icon: <Briefcase size={20} /> },
    { path: '/board', label: 'Board', icon: <BoardIcon size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">
              <img src="src/assets/logo3.png" alt="JobTrail Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">JobTrail</h1>
          </div>

          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm flex items-center justify-center shrink-0">
              {userInitials}
            </div>
            <div className="text-xs min-w-0">
              <p className="font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
              <p className="text-slate-500 truncate">{user?.email || 'Candidate'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="text-sm font-semibold text-slate-600 capitalize">
            {location.pathname.split('/')[1] || 'Dashboard'}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/applications/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={16} /> Add application
            </Link>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;