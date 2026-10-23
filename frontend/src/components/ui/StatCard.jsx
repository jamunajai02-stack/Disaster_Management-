export default function StatCard({ label, value, sub, icon, accent = 'slate' }) {
  const accents = {
    slate: 'border-command-700',
    teal: 'border-risk-low/30',
    amber: 'border-risk-medium/30',
    red: 'border-risk-high/30',
  };

  return (
    <div className={`rounded-xl border bg-command-900/80 p-5 ${accents[accent] || accents.slate}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{value ?? '—'}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        {icon && <span className="text-2xl opacity-60">{icon}</span>}
      </div>
    </div>
  );
}
