import { CircleAlert, CircleCheck, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { business } from '../config/business'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/cn'
import type { ReviewState } from '../lib/data'
import { useCountUp } from '../lib/motion'
import { useWorkspace } from './store'

export function Card({ title, action, children, className }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('panel animate-fade-up p-5', className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Kpi({ label, value, unit, decimals = 0, hint, tone }: { label: string; value: number; unit?: string; decimals?: number; hint?: string; tone?: 'good' | 'warn' | 'bad' }) {
  const [ref, v] = useCountUp<HTMLParagraphElement>(value, 1100)
  return (
    <div className="panel animate-fade-up p-5">
      <p className="text-xs text-faint">{label}</p>
      <p ref={ref} className={cn('display mt-2 text-3xl', tone === 'bad' ? 'text-bad' : tone === 'warn' ? 'text-warn' : 'text-ink')}>
        {v.toFixed(decimals)}
        {unit && <span className="ml-0.5 text-lg text-soft">{unit}</span>}
      </p>
      {hint && <p className="mt-1 text-xs text-soft">{hint}</p>}
    </div>
  )
}

export function StatusBadge({ id }: { id: string }) {
  const s = business.workspace.entity.statuses.find((x) => x.id === id)
  return <Badge tone={s?.tone ?? 'muted'} dot>{s?.label ?? id}</Badge>
}

const REVIEW: Record<ReviewState, { label: string; tone: 'good' | 'warn' | 'bad' | 'info' }> = {
  pending: { label: 'Needs review', tone: 'warn' },
  accepted: { label: 'Confirmed', tone: 'good' },
  edited: { label: 'Corrected', tone: 'info' },
  rejected: { label: 'Rejected', tone: 'bad' },
}

export function ReviewBadge({ state }: { state: ReviewState }) {
  return <Badge tone={REVIEW[state].tone}>{REVIEW[state].label}</Badge>
}

export function Confidence({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-ink/10">
        <span className={cn('block h-full rounded-full', pct < 75 ? 'bg-warn' : 'bg-accent')} style={{ width: `${pct}%` }} />
      </span>
      <span className="font-mono text-xs text-soft">{pct}%</span>
    </span>
  )
}

export function PageTitle({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="animate-fade-up">
        <h1 className="display text-3xl text-ink">{title}</h1>
        {sub && <p className="mt-1 text-sm text-soft">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Toasts() {
  const { toasts } = useWorkspace()
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={cn('pointer-events-auto flex animate-slide-in-right items-center gap-2.5 rounded-ctl border px-4 py-3 text-sm shadow-xl', t.tone === 'bad' ? 'border-bad/30 bg-surface text-bad' : t.tone === 'info' ? 'border-accent2/30 bg-surface text-ink' : 'border-good/30 bg-surface text-ink')}>
          {t.tone === 'bad' ? <CircleAlert className="h-4 w-4" /> : t.tone === 'info' ? <Info className="h-4 w-4 text-accent2" /> : <CircleCheck className="h-4 w-4 text-good" />}
          {t.text}
        </div>
      ))}
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-card border border-dashed px-6 py-12 text-center text-sm text-soft hairline">{children}</div>
}

/** Recharts colour helpers read from the theme so charts match each site. */
export const chart = {
  grid: 'color-mix(in oklab, var(--color-line) 14%, transparent)',
  axis: 'var(--color-faint)',
  a: 'var(--color-accent)',
  b: 'var(--color-accent2)',
  c: 'var(--color-accent3)',
  good: 'var(--color-good)',
  bad: 'var(--color-bad)',
  tooltip: {
    contentStyle: { background: 'var(--color-surface)', border: '1px solid color-mix(in oklab, var(--color-line) 18%, transparent)', borderRadius: 10, fontSize: 12, color: 'var(--color-ink)' },
    labelStyle: { color: 'var(--color-soft)' },
    itemStyle: { color: 'var(--color-ink)' },
  },
}
