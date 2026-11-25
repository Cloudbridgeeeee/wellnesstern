export function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-sm text-soft">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        {label}…
      </div>
    </div>
  )
}
