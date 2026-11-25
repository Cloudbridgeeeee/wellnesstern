import { initials } from '../../lib/format'
import { hash } from '../../lib/random'
import { cn } from '../../lib/cn'

const GRADS = [
  ['var(--color-accent)', 'var(--color-accent2)'],
  ['var(--color-accent2)', 'var(--color-accent3)'],
  ['var(--color-accent3)', 'var(--color-accent)'],
]

export function Avatar({ name, className }: { name: string; className?: string }) {
  const g = GRADS[hash(name) % GRADS.length]!
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white', className)}
      style={{ background: `linear-gradient(135deg, ${g[0]}, ${g[1]})` }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
