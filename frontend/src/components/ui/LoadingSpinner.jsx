export default function LoadingSpinner({ label = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-command-700 border-t-teal-500" />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">{content}</div>
    );
  }

  return content;
}
