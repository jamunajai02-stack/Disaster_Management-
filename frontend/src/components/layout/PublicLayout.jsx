import { Link, Outlet } from 'react-router-dom';
import DisclaimerBanner from '../ui/DisclaimerBanner';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-command-950">
      <header className="border-b border-command-700 bg-command-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="rounded bg-teal-500/20 px-2 py-0.5 text-xs font-bold text-teal-400">SDRP</span>
            <span className="text-sm font-medium text-slate-200">Smart Disaster Response</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-400 hover:text-slate-200">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-500"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <DisclaimerBanner />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
