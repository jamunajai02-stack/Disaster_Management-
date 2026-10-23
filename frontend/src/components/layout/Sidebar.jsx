import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar({ navItems, title, subtitle }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 left-4 z-50 rounded-full border border-command-700 bg-command-800 p-3 text-slate-200 shadow-lg lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-command-700 bg-command-900 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-command-700 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">SDRP</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-100">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/dashboard' || item.to === '/admin'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-command-700 text-teal-300'
                        : 'text-slate-400 hover:bg-command-800 hover:text-slate-200'
                    }`
                  }
                >
                  <span className="text-base opacity-70">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
