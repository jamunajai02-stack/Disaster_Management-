export default function SourceLabel({ source }) {
  if (!source) return null;
  const isDemo = source === 'DEMO' || source === 'SIMULATED';
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
        isDemo
          ? 'bg-risk-medium/25 text-amber-300 ring-1 ring-risk-medium/40'
          : 'bg-risk-low/25 text-teal-300 ring-1 ring-risk-low/40'
      }`}
    >
      {source}
    </span>
  );
}
