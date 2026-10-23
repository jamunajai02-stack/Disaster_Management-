export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-command-700 bg-command-900/50 px-6 py-12 text-center">
      <div className="mb-3 text-3xl opacity-40">📭</div>
      <h3 className="text-base font-medium text-slate-200">{title}</h3>
      {message && <p className="mt-2 max-w-md text-sm text-slate-400">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
