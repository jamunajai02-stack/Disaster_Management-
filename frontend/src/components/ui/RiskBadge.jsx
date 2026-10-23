const styles = {
  LOW: 'bg-risk-low/20 text-teal-300 border-risk-low/40',
  MEDIUM: 'bg-risk-medium/20 text-amber-300 border-risk-medium/40',
  HIGH: 'bg-risk-high/20 text-red-300 border-risk-high/40',
};

export default function RiskBadge({ level, className = '' }) {
  const key = level?.toUpperCase() || 'LOW';
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles[key] || styles.LOW} ${className}`}
    >
      {key}
    </span>
  );
}
