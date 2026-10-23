import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function TopNav({ portalLabel, portal = 'user' }) {
  const { user, logout } = useAuth();
  const isAdminUser = user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-command-700 bg-command-950/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <span className="hidden rounded border border-command-700 bg-command-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:inline">
          {portalLabel}
        </span>
        <p className="text-sm text-slate-400">
          <span className="hidden sm:inline">Signed in as </span>
          <span className="font-medium text-slate-200">{user?.name}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {isAdminUser && portal === 'admin' && (
          <Link
            to="/dashboard"
            className="rounded-lg border border-command-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-command-800"
          >
            User Portal
          </Link>
        )}
        {isAdminUser && portal === 'user' && (
          <Link
            to="/admin"
            className="rounded-lg border border-teal-500/30 px-3 py-1.5 text-xs text-teal-300 hover:bg-teal-500/10"
          >
            Admin Portal
          </Link>
        )}
        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-command-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-command-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
