import { business } from '../../config/business'
import { cn } from '../../lib/cn'

const t = business.theme

function shapes(kind: string, c: string) {
  switch (kind) {
    case 'tile':
      return (<><rect x="6" y="6" width="24" height="24" rx="5" fill="url(#lg)" /><rect x="34" y="6" width="24" height="24" rx="5" fill={c} /><rect x="6" y="34" width="24" height="24" rx="5" fill={c} opacity=".55" /><rect x="34" y="34" width="24" height="24" rx="5" fill="url(#lg)" opacity=".85" /></>)
    case 'drop':
      return (<><path d="M32 4C32 4 10 28 10 41a22 22 0 0 0 44 0C54 28 32 4 32 4Z" fill="url(#lg)" /><circle cx="25" cy="42" r="6" fill={c} opacity=".8" /></>)
    case 'stack':
      return (<><rect x="8" y="10" width="48" height="12" rx="6" fill="url(#lg)" /><rect x="14" y="26" width="42" height="12" rx="6" fill={c} opacity=".85" /><rect x="8" y="42" width="34" height="12" rx="6" fill="url(#lg)" opacity=".7" /></>)
    case 'spark':
      return (<><path d="M32 4l6 20 20 8-20 8-6 20-6-20-20-8 20-8z" fill="url(#lg)" /><circle cx="50" cy="14" r="5" fill={c} /></>)
    case 'arch':
      return (<><path d="M8 58V32a24 24 0 0 1 48 0v26H44V32a12 12 0 0 0-24 0v26z" fill="url(#lg)" /><rect x="26" y="44" width="12" height="14" rx="2" fill={c} /></>)
    case 'wave':
      return (<><rect x="4" y="4" width="56" height="56" rx="16" fill="url(#lg)" /><path d="M12 38c6-8 10-8 16 0s10 8 16 0 8-8 10-6" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" /><path d="M12 26c6-8 10-8 16 0s10 8 16 0 8-8 10-6" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="4" strokeLinecap="round" /></>)
    case 'hex':
      return (<><path d="M32 4l24 14v28L32 60 8 46V18z" fill="url(#lg)" /><path d="M32 18l12 7v14l-12 7-12-7V25z" fill={c} /></>)
    case 'leaf':
      return (<><path d="M10 54C10 26 28 8 56 8c0 28-18 46-46 46z" fill="url(#lg)" /><path d="M14 50L44 20" stroke={c} strokeWidth="4" strokeLinecap="round" /></>)
    case 'bolt':
      return (<><circle cx="32" cy="32" r="28" fill="url(#lg)" /><path d="M35 10L18 36h13l-3 18 17-26H32z" fill={c} /></>)
    case 'frame':
      return (<><rect x="6" y="6" width="52" height="52" rx="10" fill="none" stroke="url(#lg)" strokeWidth="7" /><rect x="20" y="20" width="24" height="24" rx="4" fill={c} /></>)
    case 'knot':
      return (<><circle cx="24" cy="24" r="16" fill="none" stroke="url(#lg)" strokeWidth="8" /><circle cx="40" cy="40" r="16" fill="none" stroke={c} strokeWidth="8" /></>)
    default:
      return (<><circle cx="32" cy="32" r="22" fill="none" stroke="url(#lg)" strokeWidth="9" /><circle cx="32" cy="32" r="7" fill={c} /></>)
  }
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.accent} />
          <stop offset="1" stopColor={t.accent2} />
        </linearGradient>
      </defs>
      {shapes(t.logo, t.accent3)}
    </svg>
  )
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="h-7 w-7 transition-transform duration-500 group-hover:rotate-[8deg]" />
      {!compact && <span className="display text-[1.2rem] leading-none text-ink">{business.name}</span>}
    </span>
  )
}
