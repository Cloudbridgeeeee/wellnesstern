import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type Tone = 'good' | 'warn' | 'bad' | 'info' | 'muted' | 'accent'

const tones: Record<Tone, string> = {
  good: 'bg-good/12 text-good border-good/25',
  warn: 'bg-warn/12 text-warn border-warn/25',
  bad: 'bg-bad/12 text-bad border-bad/25',
  info: 'bg-accent2/12 text-accent2 border-accent2/25',
  muted: 'bg-ink/5 text-soft border-ink/10',
  accent: 'bg-accent/12 text-accent border-accent/25',
}

export function Badge({ tone = 'muted', children, className, dot }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-btn border px-2 py-0.5 text-[0.7rem] font-medium', tones[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
