export default function DisclaimerBanner({ compact = false }) {
  return (
    <div
      className={`rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200/90 ${
        compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'
      }`}
    >
      <strong className="font-semibold">Disclaimer:</strong>{' '}
      This platform is a college project demo. It is not an official government warning system.
      Do not rely on it for real emergency decisions.
    </div>
  );
}
