import { business } from '../../config/business'
import { cn } from '../../lib/cn'

/** The site's signature background pattern, faded at the edges. */
export function Motif({ className, strong }: { className?: string; strong?: boolean }) {
  const m = business.theme.motif
  const op = strong ? 0.16 : 0.09
  const id = `motif-${m}`
  const mask = 'radial-gradient(ellipse 75% 65% at 50% 35%, #000 30%, transparent 78%)'
  let pattern: React.ReactNode
  let size = 40
  switch (m) {
    case 'grid':
      size = 44
      pattern = <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke="currentColor" strokeWidth="1" />
      break
    case 'dots':
      size = 22
      pattern = <circle cx="2" cy="2" r="1.3" fill="currentColor" />
      break
    case 'diagonal':
      size = 18
      pattern = <path d="M0 18 L18 0" stroke="currentColor" strokeWidth="1" />
      break
    case 'hex':
      size = 36
      pattern = <path d="M18 0 L36 10 L36 30 L18 40 L0 30 L0 10 Z" fill="none" stroke="currentColor" strokeWidth="1" transform="scale(0.9)" />
      break
    case 'waves':
      size = 60
      pattern = <path d="M0 30 Q 15 18 30 30 T 60 30" fill="none" stroke="currentColor" strokeWidth="1" />
      break
    default:
      pattern = null
  }
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden text-ink', className)} style={{ maskImage: mask, WebkitMaskImage: mask }}>
      {pattern && (
        <svg className="absolute inset-0 h-full w-full" style={{ opacity: op }}>
          <defs>
            <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
              {pattern}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
      )}
      {m === 'contours' && (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{ opacity: op * 1.6 }}>
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M -50 ${120 + i * 48} C 250 ${40 + i * 52}, 450 ${260 + i * 40}, 700 ${150 + i * 46} S 1100 ${80 + i * 50}, 1300 ${200 + i * 44}`} fill="none" stroke="currentColor" strokeWidth="1" />
          ))}
        </svg>
      )}
      {m === 'rings' && (
        <svg className="absolute left-1/2 top-[-20%] h-[140%] w-[140%] -translate-x-1/2 animate-spin-slow" viewBox="0 0 800 800" style={{ opacity: op * 1.5 }}>
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx="400" cy="400" r={60 + i * 42} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray={i % 2 ? '4 10' : undefined} />
          ))}
        </svg>
      )}
      {m === 'beams' && (
        <div className="absolute inset-0" style={{ opacity: strong ? 0.9 : 0.6 }}>
          {[12, 34, 58, 81].map((x, i) => (
            <span key={x} className="absolute top-0 h-full w-px animate-float-slow" style={{ left: `${x}%`, animationDelay: `${i * 1.3}s`, background: 'linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-accent) 50%, transparent), transparent)' }} />
          ))}
        </div>
      )}
    </div>
  )
}
