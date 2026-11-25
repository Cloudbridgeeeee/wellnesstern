import { Check, ShieldCheck, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { business } from '../../config/business'
import { cn } from '../../lib/cn'
import { useClock } from '../../lib/motion'
import { hash } from '../../lib/random'

const L = business.hero.labels
const W = business.workspace
const label = (i: number) => L[i % L.length]!
const H = hash(business.slug)
/** Per-site KPI values so no two forecast visuals show the same numbers. */
const KPI = [62 + (H % 33), 3 + ((H >> 5) % 24), 71 + ((H >> 9) % 27)]

/** A window frame used by every hero visual. */
export function Frame({ title, children, className, status }: { title: string; children: ReactNode; className?: string; status?: string }) {
  return (
    <div className={cn('panel overflow-hidden', className)}>
      <div className="flex items-center justify-between border-b px-4 py-2.5 hairline">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-bad/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-good/70" />
          <span className="ml-2 font-mono text-[0.68rem] text-faint">{title}</span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[0.65rem] text-faint">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-good" /> {status ?? 'live'}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function Vision() {
  const n = useClock(1400)
  const active = n % 6
  const tiles = Array.from({ length: 6 }, (_, i) => i)
  return (
    <Frame title={`${W.title.toLowerCase().replace(/\s+/g, '-')}/review`}>
      <div className="grid grid-cols-3 gap-2.5">
        {tiles.map((i) => {
          const found = (i + n) % 6 <= active
          const isNow = i === active
          const clear = label(i + n) === L[L.length - 1]
          return (
            <div key={i} className="relative aspect-square overflow-hidden rounded-ctl border hairline" style={{ background: `linear-gradient(${40 + i * 50}deg, color-mix(in oklab, var(--color-raised) 90%, var(--color-accent2)), var(--color-raised) 60%, color-mix(in oklab, var(--color-raised) 85%, var(--color-accent3)))` }}>
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-40">
                {Array.from({ length: 9 }, (_, k) => (
                  <circle key={k} cx={(k * 37 + i * 13) % 100} cy={(k * 53 + i * 29) % 100} r={1 + ((k + i) % 3)} fill="var(--color-ink)" opacity=".25" />
                ))}
              </svg>
              {isNow && <div className="absolute inset-x-0 h-8 animate-[float_1.4s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-accent/35 to-transparent" />}
              {found && !clear && (
                <div className="absolute animate-scale-in rounded-sm border-2 border-accent" style={{ left: `${18 + ((i * 17) % 30)}%`, top: `${20 + ((i * 23) % 30)}%`, width: '38%', height: '34%' }}>
                  <span className="absolute -top-5 left-0 whitespace-nowrap rounded-sm bg-accent px-1 font-mono text-[0.55rem] text-on-accent">{label(i + n)}</span>
                </div>
              )}
              {found && clear && <Check className="absolute right-1.5 top-1.5 h-4 w-4 text-good" />}
            </div>
          )
        })}
      </div>
      <div className="mt-3 space-y-1.5">
        {[0, 1, 2].map((k) => (
          <div key={k} className="flex items-center justify-between rounded-ctl bg-raised/70 px-3 py-2 text-xs">
            <span className="text-soft">{W.entity.names[(n + k) % W.entity.names.length]}</span>
            <span className="font-mono text-ink">{label(n + k)}</span>
            <span className="font-mono text-accent">{88 - ((n + k * 7) % 21)}%</span>
          </div>
        ))}
      </div>
    </Frame>
  )
}

function DocumentV() {
  const n = useClock(1100)
  const step = n % (L.length + 3)
  return (
    <Frame title="extraction/review">
      <div className="grid grid-cols-[1.1fr_1fr] gap-3">
        <div className="relative rounded-ctl border bg-raised/60 p-3 hairline">
          <div className="mb-2 h-2.5 w-2/3 rounded bg-ink/25" />
          {Array.from({ length: 11 }, (_, i) => (
            <div key={i} className={cn('mb-1.5 h-1.5 rounded transition-all duration-500', i % 4 === 3 ? 'w-1/2' : 'w-full', i === (step % 11) ? 'bg-accent/70' : 'bg-ink/12')} />
          ))}
          <div className="absolute inset-x-2 h-6 rounded bg-accent/10 transition-all duration-700" style={{ top: `${20 + (step % 11) * 9}px` }} />
        </div>
        <div className="space-y-1.5">
          {L.map((l, i) => {
            const [k, v] = l.split(':')
            const shown = i < step
            return (
              <div key={l} className={cn('rounded-ctl border px-2.5 py-1.5 transition-all duration-500 hairline', shown ? 'translate-x-0 bg-surface opacity-100' : 'translate-x-3 opacity-0')}>
                <p className="font-mono text-[0.58rem] uppercase tracking-wider text-faint">{k}</p>
                <p className="truncate text-xs text-ink">{v?.trim() ?? '—'}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-ctl bg-accent/10 px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5 text-accent"><Sparkles className="h-3.5 w-3.5" /> {Math.min(step, L.length)} of {L.length} fields extracted</span>
        <span className="text-soft">Awaiting human review</span>
      </div>
    </Frame>
  )
}

function Forecast() {
  const n = useClock(1600)
  const pts = Array.from({ length: 13 }, (_, i) => 120 - i * 4 - Math.sin(i / 1.6) * 18 - ((i * 7) % 5) * 3)
  const fut = Array.from({ length: 6 }, (_, i) => pts[12]! - (i + 1) * 4 - Math.sin((13 + i) / 1.6) * 18)
  const x = (i: number) => 20 + i * 22
  const line = pts.map((y, i) => `${i ? 'L' : 'M'} ${x(i)} ${y}`).join(' ')
  const fline = [pts[12]!, ...fut].map((y, i) => `${i ? 'L' : 'M'} ${x(12 + i)} ${y}`).join(' ')
  const band = `M ${x(12)} ${pts[12]} ${fut.map((y, i) => `L ${x(13 + i)} ${y - 6 - i * 3}`).join(' ')} ${[...fut].reverse().map((y, i) => `L ${x(18 - i)} ${y + 6 + (5 - i) * 3}`).join(' ')} Z`
  const hi = n % 6
  return (
    <Frame title="forecast/next-6">
      <div className="mb-3 grid grid-cols-3 gap-2">
        {L.slice(0, 3).map((l, i) => (
          <div key={l} className="rounded-ctl bg-raised/70 px-2.5 py-2">
            <p className="truncate text-[0.62rem] text-faint">{l}</p>
            <p className="display text-lg text-ink">{KPI[i]}{['%', '', '%'][i]}</p>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 440 170" className="draw w-full">
        {[40, 80, 120, 160].map((y) => <line key={y} x1="10" x2="430" y1={y} y2={y} stroke="var(--color-line)" strokeOpacity=".12" style={{ strokeDasharray: 'none' }} />)}
        <path d={band} fill="var(--color-accent)" fillOpacity=".14" stroke="none" style={{ strokeDasharray: 'none' }} />
        <path d={line} fill="none" stroke="var(--color-accent2)" strokeWidth="2.5" style={{ ['--len' as string]: 600 }} />
        <path d={fline} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" style={{ strokeDasharray: '6 5', strokeDashoffset: 0 }} />
        <line x1={x(12)} x2={x(12)} y1="10" y2="165" stroke="var(--color-ink)" strokeOpacity=".25" style={{ strokeDasharray: '3 4', strokeDashoffset: 0 }} />
        <circle cx={x(13 + hi)} cy={fut[hi]} r="5" fill="var(--color-accent)" className="transition-all duration-700" style={{ strokeDasharray: 'none' }} />
        <text x={x(12) + 6} y="20" fontSize="10" fill="var(--color-faint)" fontFamily="var(--font-mono)">{W.series.forecastLabel}</text>
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-soft">{W.series.label}</span>
        <span className="font-mono text-accent">{label(3 + hi)}</span>
      </div>
    </Frame>
  )
}

function Sensor() {
  const n = useClock(700)
  const rows = L.slice(0, 4)
  return (
    <Frame title="readings/stream">
      <div className="space-y-2.5">
        {rows.map((r, ri) => {
          const anomaly = ri === 1 && n % 10 > 5
          const vals = Array.from({ length: 28 }, (_, i) => {
            const t = i + n
            let v = 50 + Math.sin(t / (2 + ri)) * 14 + ((t * (ri + 3)) % 7) * 2
            if (anomaly && i > 21) v += 24
            return v
          })
          const d = vals.map((v, i) => `${i ? 'L' : 'M'} ${i * 9} ${80 - v}`).join(' ')
          return (
            <div key={r} className={cn('flex items-center gap-3 rounded-ctl border px-3 py-2 transition-colors duration-500 hairline', anomaly ? 'border-bad/40 bg-bad/5' : 'bg-raised/50')}>
              <div className="w-24 shrink-0">
                <p className="truncate text-xs text-ink">{r}</p>
                <p className="font-mono text-[0.6rem] text-faint">{(vals[27]! / 10).toFixed(1)} {['°C', 'kW', 'bar', '%'][ri]}</p>
              </div>
              <svg viewBox="0 0 250 60" className="h-9 flex-1" preserveAspectRatio="none">
                <path d={d} fill="none" stroke={anomaly ? 'var(--color-bad)' : 'var(--color-accent2)'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
              {anomaly ? <span className="h-2.5 w-2.5 animate-pulse-ring rounded-full bg-bad" /> : <span className="h-2 w-2 rounded-full bg-good" />}
            </div>
          )
        })}
      </div>
      <div className={cn('mt-3 flex items-center gap-2 rounded-ctl px-3 py-2 text-xs transition-all duration-500', n % 10 > 5 ? 'bg-bad/10 text-bad' : 'bg-good/10 text-good')}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {n % 10 > 5 ? `Unusual reading on ${rows[1]} — sent to an operator for review` : 'All readings within expected range'}
      </div>
    </Frame>
  )
}

function Network() {
  const n = useClock(1800)
  const nodes = [
    { x: 60, y: 60 }, { x: 200, y: 36 }, { x: 330, y: 80 }, { x: 110, y: 170 }, { x: 250, y: 150 }, { x: 370, y: 190 },
  ]
  const edges = [[0, 1], [1, 2], [0, 3], [3, 4], [1, 4], [4, 5], [2, 5]]
  const busy = n % nodes.length
  return (
    <Frame title="network/demand">
      <svg viewBox="0 0 420 230" className="w-full">
        {edges.map(([a, b], i) => {
          const A = nodes[a!]!, B = nodes[b!]!
          const id = `e${i}`
          const d = `M ${A.x} ${A.y} Q ${(A.x + B.x) / 2} ${(A.y + B.y) / 2 - 30} ${B.x} ${B.y}`
          return (
            <g key={id}>
              <path id={id} d={d} fill="none" stroke="var(--color-line)" strokeOpacity=".22" strokeWidth="2" strokeDasharray="4 5" />
              <circle r="3.5" fill="var(--color-accent)">
                <animateMotion dur={`${3 + (i % 3)}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}>
                  <mpath href={`#${id}`} />
                </animateMotion>
              </circle>
            </g>
          )
        })}
        {nodes.map((p, i) => (
          <g key={i}>
            {i === busy && <circle cx={p.x} cy={p.y} r="22" fill="var(--color-accent)" opacity=".15"><animate attributeName="r" values="12;26;12" dur="1.8s" repeatCount="indefinite" /></circle>}
            <circle cx={p.x} cy={p.y} r="11" fill="var(--color-surface)" stroke={i === busy ? 'var(--color-accent)' : 'var(--color-accent2)'} strokeWidth="3" />
            <text x={p.x} y={p.y + 27} textAnchor="middle" fontSize="10" fill="var(--color-soft)" fontFamily="var(--font-sans)">{label(i)}</text>
          </g>
        ))}
      </svg>
      <div className="mt-1 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((k) => {
          const v = 40 + (((n + k) * 23) % 55)
          return (
            <div key={k} className="rounded-ctl bg-raised/70 px-2.5 py-2">
              <p className="truncate text-[0.62rem] text-faint">{label(busy + k)}</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-gradient-to-r from-accent2 to-accent transition-all duration-1000" style={{ width: `${v}%` }} />
              </div>
              <p className="mt-1 font-mono text-[0.62rem] text-soft">{v}% forecast load</p>
            </div>
          )
        })}
      </div>
    </Frame>
  )
}

function Inventory() {
  const n = useClock(1700)
  const cols = L.slice(0, 5)
  return (
    <Frame title="allocation/plan">
      <div className="flex h-44 items-stretch gap-3 px-1">
        {cols.map((c, i) => {
          const a = 30 + (((n + i) * 37) % 60)
          const b = 15 + (((n + i * 3) * 19) % 35)
          return (
            <div key={c} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full flex-1 items-end gap-1">
                <div className="flex-1 rounded-t-[4px] bg-accent2/80 transition-all duration-1000" style={{ height: `${a}%` }} />
                <div className="flex-1 rounded-t-[4px] bg-accent transition-all duration-1000" style={{ height: `${b + 20}%` }} />
              </div>
              <span className="w-full truncate text-center text-[0.6rem] text-faint">{c}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex gap-3 text-[0.65rem] text-soft">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-accent2" /> Current</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-accent" /> Forecast need</span>
      </div>
      <div key={n} className="mt-3 flex animate-fade-up items-center justify-between rounded-ctl border border-accent/30 bg-accent/8 px-3 py-2 text-xs">
        <span className="text-ink">Suggested: {label(n)} → {label(n + 2)}</span>
        <span className="font-mono text-accent">{12 + (n % 5) * 6} units</span>
      </div>
    </Frame>
  )
}

function Captions() {
  const n = useClock(1300)
  const lines = L
  return (
    <Frame title="captions/editor">
      <div className="flex h-16 items-center gap-[3px]">
        {Array.from({ length: 60 }, (_, i) => {
          const h = 18 + Math.abs(Math.sin((i + n * 3) / 3.2)) * 60 + ((i * 7) % 9) * 2
          return <span key={i} className={cn('w-full rounded-full transition-all duration-500', i < (n * 6) % 60 ? 'bg-accent' : 'bg-ink/15')} style={{ height: `${Math.min(h, 100)}%` }} />
        })}
      </div>
      <div className="mt-3 space-y-1.5">
        {[0, 1, 2].map((k) => {
          const idx = (n + k) % lines.length
          const now = k === 1
          return (
            <div key={`${idx}-${k}`} className={cn('flex gap-3 rounded-ctl px-3 py-2 text-xs transition-all', now ? 'bg-accent/12 text-ink' : 'text-soft')}>
              <span className="font-mono text-faint">00:{String(((n + k) * 4) % 60).padStart(2, '0')}</span>
              <span className="flex-1">{lines[idx]}</span>
              {now && <span className="animate-blink text-accent">▍</span>}
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {['EN', 'YO', 'HA', 'IG', 'FR'].map((l, i) => (
          <span key={l} className={cn('rounded-ctl border px-2 py-0.5 font-mono text-[0.62rem] transition hairline', i === n % 5 ? 'border-accent bg-accent text-on-accent' : 'text-soft')}>{l}</span>
        ))}
        <span className="ml-auto text-[0.65rem] text-faint">Reviewer edits saved</span>
      </div>
    </Frame>
  )
}

function Redaction() {
  const n = useClock(900)
  const tokens = [
    { t: 'Customer ' }, { t: L[0]!, k: 'NAME' }, { t: ' asked to change the delivery to ' }, { t: L[1]!, k: 'ADDRESS' },
    { t: '. Call back on ' }, { t: L[2]!, k: 'PHONE' }, { t: ' or email ' }, { t: L[3]!, k: 'EMAIL' }, { t: '. Order ' }, { t: L[4] ?? '#48213', k: 'ORDER' }, { t: ' — discreet packaging requested.' },
  ]
  const sensitive = tokens.filter((x) => x.k)
  const done = n % (sensitive.length + 3)
  let seen = 0
  return (
    <Frame title="support/redact" status="private">
      <div className="rounded-ctl border bg-raised/50 p-4 text-sm leading-7 text-soft hairline">
        {tokens.map((x, i) => {
          if (!x.k) return <span key={i}>{x.t}</span>
          const red = seen++ < done
          return (
            <span key={i} className="relative mx-0.5 inline-block align-baseline">
              <span className={cn('rounded px-1 transition-all duration-500', red ? 'bg-ink text-transparent' : 'bg-warn/20 text-ink')}>{x.t}</span>
              {red && <span className="absolute -top-3 left-0 animate-fade-in font-mono text-[0.5rem] tracking-wider text-accent">{x.k}</span>}
            </span>
          )
        })}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-ctl bg-raised/70 py-2"><p className="display text-lg text-ink">{Math.min(done, sensitive.length)}</p><p className="text-[0.6rem] text-faint">items redacted</p></div>
        <div className="rounded-ctl bg-raised/70 py-2"><p className="display text-lg text-ink">{sensitive.length}</p><p className="text-[0.6rem] text-faint">detected</p></div>
        <div className="flex flex-col items-center justify-center rounded-ctl bg-good/10 py-2 text-good"><ShieldCheck className="h-4 w-4" /><p className="text-[0.6rem]">reviewer approves</p></div>
      </div>
    </Frame>
  )
}

function Feedback() {
  const n = useClock(1500)
  const themes = L.slice(0, 4)
  // Labels after the first four are sample comments; otherwise fall back to the evidence templates.
  const comments = L.length > 5 ? L.slice(4) : W.findings.evidence.map((e) => e.replace(/\{[^}]+\}/g, '…'))
  return (
    <Frame title="themes/clustering">
      <div className="relative h-24 overflow-hidden">
        {[0, 1, 2].map((k) => (
          <div key={`${n}-${k}`} className="absolute left-0 right-8 animate-fade-up rounded-ctl border bg-raised/70 px-3 py-1.5 text-[0.7rem] text-soft hairline" style={{ top: `${k * 32}px`, animationDelay: `${k * 120}ms`, marginLeft: `${k * 14}px` }}>
            “{comments[(n + k) % comments.length]!.slice(0, 64)}”
            <span className="ml-2 rounded bg-accent/15 px-1 font-mono text-[0.55rem] text-accent">{themes[(n + k) % themes.length]}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {themes.map((t, i) => {
          const v = 25 + (((n + i * 2) * 17) % 65)
          return (
            <div key={t}>
              <div className="mb-1 flex justify-between text-[0.7rem]"><span className="text-ink">{t}</span><span className="font-mono text-faint">{v}</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full transition-all duration-1000" style={{ width: `${v}%`, background: ['var(--color-accent)', 'var(--color-accent2)', 'var(--color-accent3)', 'var(--color-good)'][i] }} /></div>
            </div>
          )
        })}
      </div>
    </Frame>
  )
}

function Ledger() {
  const n = useClock(1600)
  const cats = L.slice(0, 5)
  return (
    <Frame title="budget/variance">
      <div className="space-y-2.5">
        {cats.map((c, i) => {
          const budget = 50 + ((i * 13) % 40)
          const actual = budget + ((((n + i) * 11) % 30) - 12)
          const over = actual > budget
          return (
            <div key={c}>
              <div className="mb-1 flex justify-between text-[0.7rem]"><span className="text-ink">{c}</span><span className={cn('font-mono', over ? 'text-bad' : 'text-good')}>{over ? '+' : ''}{actual - budget}%</span></div>
              <div className="relative h-2.5 rounded-full bg-ink/10">
                <div className="absolute inset-y-0 left-0 rounded-full bg-accent2/60" style={{ width: `${budget}%` }} />
                <div className={cn('absolute inset-y-0 left-0 rounded-full transition-all duration-1000', over ? 'bg-bad/80' : 'bg-accent')} style={{ width: `${Math.min(actual, 100)}%`, opacity: 0.85 }} />
              </div>
            </div>
          )
        })}
      </div>
      <div key={n % 3} className="mt-4 flex animate-fade-up items-center justify-between rounded-ctl border border-accent/25 bg-accent/8 px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5 text-ink"><Sparkles className="h-3.5 w-3.5 text-accent" /> {W.importSample.sourceLabel} read · {cats[n % cats.length]}</span>
        <span className="font-mono text-accent">₦{(184 + (n % 7) * 23).toLocaleString()}k</span>
      </div>
    </Frame>
  )
}

function Compare() {
  const n = useClock(1500)
  const rows = L.map((l, i) => {
    const [a, b] = l.split('→').map((x) => x.trim())
    return { a: a ?? l, b: b ?? a ?? l, changed: !!b && b !== a, i }
  })
  const shown = n % (rows.length + 2)
  return (
    <Frame title="versions/compare">
      <div className="mb-3 flex items-center justify-between text-[0.68rem] font-mono text-faint">
        <span className="rounded bg-raised px-2 py-0.5">v{3 + (n % 2)}.0 — previous</span>
        <span className="rounded bg-accent/15 px-2 py-0.5 text-accent">v{4 + (n % 2)}.0 — current</span>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => {
          const on = r.i < shown
          return (
            <div key={r.i} className="grid grid-cols-2 gap-2 text-xs">
              <div className={cn('rounded-ctl border px-2.5 py-2 transition-all duration-500 hairline', r.changed && on ? 'border-bad/30 bg-bad/8 text-soft line-through decoration-bad/50' : 'text-soft')}>{r.a}</div>
              <div className={cn('rounded-ctl border px-2.5 py-2 transition-all duration-500 hairline', r.changed && on ? 'border-good/40 bg-good/10 text-ink' : 'text-soft', !on && 'opacity-40')}>{r.b}</div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-ctl bg-accent/10 px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5 text-accent"><Sparkles className="h-3.5 w-3.5" /> {rows.filter((r) => r.changed && r.i < shown).length} changes detected</span>
        <span className="text-soft">Reviewer sign-off required</span>
      </div>
    </Frame>
  )
}

const MAP = {
  vision: Vision,
  document: DocumentV,
  forecast: Forecast,
  sensor: Sensor,
  network: Network,
  inventory: Inventory,
  captions: Captions,
  redaction: Redaction,
  feedback: Feedback,
  ledger: Ledger,
  compare: Compare,
}

export function HeroVisual({ className }: { className?: string }) {
  const C = MAP[business.hero.visual]
  return (
    <div className={cn('relative', className)}>
      <div className="absolute -inset-8 -z-10 rounded-[40px] bg-gradient-to-br from-accent/20 via-accent2/10 to-transparent blur-3xl" />
      <C />
    </div>
  )
}
