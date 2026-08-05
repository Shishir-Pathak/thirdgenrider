export default function LoadingSpinner({
  label = "Loading...",
  className = "",
  size = "md",
}) {
  const sizeClass = {
    sm: "h-5 w-5 border-2",
    md: "h-9 w-9 border-3",
    lg: "h-12 w-12 border-4",
  }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 text-center ${className}`}
    >
      <span
        className={`${sizeClass} animate-spin rounded-full border-slate-200 border-t-[var(--color-primary)]`}
        aria-hidden="true"
      />
      {label && (
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}
