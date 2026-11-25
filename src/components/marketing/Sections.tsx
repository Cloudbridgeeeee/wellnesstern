import { ArrowRight, Check, Minus, Plus, Quote, Sparkles, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { business } from '../../config/business'
import { cn } from '../../lib/cn'
import { isFlagged, makeRecords, makeSeries } from '../../lib/data'
import { fmtDate } from '../../lib/format'
import { Icon } from '../../lib/icons'
import { useCountUp, useTicker } from '../../lib/motion'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { ButtonLink } from '../ui/Button'
import { Headline } from '../ui/Headline'
import { Container, Section } from '../ui/Section'
import { Motif } from './Motif'

const b = business

/* ---------- Marquee ---------- */
export function Marquee() {
  const items = [...b.marquee, ...b.marquee]
  return (
    <div className="marquee-mask relative overflow-hidden border-y py-5 hairline">
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-faint">
            {m}
            <span className="h-1 w-1 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- Stats ---------- */
function Stat({ s, i }: { s: (typeof b.stats)[number]; i: number }) {
  const [ref, v] = useCountUp<HTMLParagraphElement>(s.value)
  return (
    <div className="reveal border-t px-6 py-8 hairline first:border-t-0 sm:border-t-0 lg:border-l lg:first:border-l-0" style={{ ['--d' as string]: `${i * 90}ms` }}>
      <p ref={ref} className="display text-5xl text-ink">
        {s.prefix}
        {Math.round(v)}
        <span className="text-accent">{s.suffix}</span>
      </p>
      <p className="mt-2 text-sm font-medium text-ink">{s.label}</p>
      <p className="mt-1 text-sm text-faint">{s.note}</p>
    </div>
  )
}

export function Stats() {
  return (
    <Container className="py-6">
      <div className="panel grid sm:grid-cols-2 lg:grid-cols-4">
        {b.stats.map((s, i) => (
          <Stat key={s.label} s={s} i={i} />
        ))}
      </div>
    </Container>
  )
}

/* ---------- Problem ---------- */
export function Problem() {
  const p = b.problem
  return (
    <Section id="problem" eyebrow={p.eyebrow} title={p.heading} intro={p.intro}>
      <div className="grid gap-5 md:grid-cols-3">
        {p.points.map((pt, i) => (
          <div key={pt.title} className="reveal panel spot lift p-7" style={{ ['--d' as string]: `${i * 110}ms` }}>
            <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-ctl bg-bad/10 text-bad">
              <Icon name={pt.icon} className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-semibold text-ink">{pt.title}</h3>
            <p className="mt-3 leading-relaxed text-soft">{pt.body}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ---------- Solution (before / after) ---------- */
export function Solution() {
  const s = b.solution
  return (
    <Section id="solution" eyebrow="What changes" title={s.heading} intro={s.body}>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="reveal reveal-left panel p-8">
          <p className="mb-6 flex items-center gap-2 text-sm font-semibold text-faint">
            <X className="h-4 w-4" /> Today
          </p>
          <ul className="space-y-4">
            {s.before.map((x) => (
              <li key={x} className="flex gap-3 text-soft line-through decoration-ink/20">
                <Minus className="mt-1 h-4 w-4 shrink-0 text-faint" /> {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal reveal-right panel relative overflow-hidden p-8">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/12 via-transparent to-accent2/10" />
          <p className="mb-6 flex items-center gap-2 text-sm font-semibold text-accent">
            <Sparkles className="h-4 w-4" /> With {b.name}
          </p>
          <ul className="space-y-4">
            {s.after.map((x, i) => (
              <li key={x} className="reveal flex gap-3 text-ink" style={{ ['--d' as string]: `${200 + i * 120}ms` }}>
                <Check className="mt-1 h-4 w-4 shrink-0 text-accent" /> {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

/* ---------- Features ---------- */
const statusTone = { 'In the demo': 'good', Pilot: 'info', Roadmap: 'muted' } as const

export function Features({ full }: { full?: boolean }) {
  const [main, ...rest] = b.features
  return (
    <Section id="features" eyebrow="Core features" title={`Everything ${b.name} does, in *one workspace*.`} intro={b.description}>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="reveal panel spot lift relative overflow-hidden p-8 md:col-span-2 lg:row-span-2">
          <Motif className="opacity-60" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-ctl bg-accent text-on-accent">
                <Icon name={main!.icon} className="h-6 w-6" />
              </span>
              <Badge tone={statusTone[main!.status]} dot>{main!.status}</Badge>
            </div>
            <h3 className="display mt-8 text-3xl text-ink">{main!.title}</h3>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-soft">{main!.body}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {main!.bullets.map((x) => (
                <li key={x} className="flex gap-2.5 rounded-ctl bg-raised/70 px-4 py-3 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {rest.map((f, i) => (
          <div key={f.title} className="reveal panel spot lift flex flex-col p-7" style={{ ['--d' as string]: `${(i + 1) * 90}ms` }}>
            <div className="flex items-center justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-ctl bg-accent/12 text-accent">
                <Icon name={f.icon} className="h-5 w-5" />
              </span>
              <Badge tone={statusTone[f.status]}>{f.status}</Badge>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-ink">{f.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-soft">{f.body}</p>
            {full && (
              <ul className="mt-5 space-y-2">
                {f.bullets.map((x) => (
                  <li key={x} className="flex gap-2 text-sm text-soft">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {x}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {!full && (
        <div className="reveal mt-10">
          <Link to="/product" className="link inline-flex items-center gap-1.5 text-sm font-medium">
            Explore every feature <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </Section>
  )
}

/* ---------- Workflow ---------- */
export function Workflow() {
  const active = useTicker(b.steps.length, 3200)
  return (
    <Section id="how" eyebrow="How it works" title={`From raw input to *reviewed insight* in ${b.steps.length} steps.`}>
      <div className="relative grid gap-5 lg:grid-cols-4">
        <div className="absolute left-0 right-0 top-[2.15rem] hidden h-px lg:block" style={{ background: 'linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-accent) 50%, transparent), transparent)' }} />
        {b.steps.map((s, i) => (
          <div key={s.title} className={cn('reveal relative panel p-6 transition-all duration-500', i === active && 'border-accent/50 shadow-[0_20px_50px_-30px_var(--color-accent)]')} style={{ ['--d' as string]: `${i * 120}ms` }}>
            <span className={cn('relative z-10 mb-5 flex h-11 w-11 items-center justify-center rounded-full border-2 font-mono text-sm font-semibold transition-all duration-500', i === active ? 'border-accent bg-accent text-on-accent' : 'border-ink/15 bg-surface text-soft')}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-soft">{s.body}</p>
            <p className={cn('mt-4 border-t pt-4 font-mono text-[0.72rem] leading-relaxed transition-colors hairline', i === active ? 'text-accent' : 'text-faint')}>{s.detail}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ---------- Product showcase ---------- */
export function Showcase() {
  const w = b.workspace
  const records = useMemo(() => makeRecords(w, b.slug, 24), [])
  const series = useMemo(() => makeSeries(w, b.slug, 12, 4), [])
  const tabs = ['Review queue', 'Trends', `${w.entity.singular} detail`]
  const [tab, setTab] = useState(0)
  const pending = records.filter((r) => r.finding.state === 'pending').slice(0, 5)
  const rec = records.find((r) => w.metrics.some((m) => isFlagged(m, r.metrics[m.key]!))) ?? records[0]!
  const vals = series.map((p) => p.actual ?? p.forecast ?? 0)
  const max = Math.max(...vals) * 1.1
  const min = Math.min(...vals) * 0.85
  const y = (v: number) => 150 - ((v - min) / (max - min)) * 140
  return (
    <Section id="product-tour" eyebrow="See it working" title={`A look inside the *${w.title.toLowerCase()}*.`} intro="Every screen below runs on demo data in your browser. Open the live workspace to click through it yourself.">
      <div className="reveal reveal-zoom panel overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 border-b p-2 hairline">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className={cn('rounded-ctl px-4 py-2 text-sm transition', tab === i ? 'bg-accent text-on-accent' : 'text-soft hover:bg-raised hover:text-ink')}>
              {t}
            </button>
          ))}
          <span className="ml-auto hidden pr-3 font-mono text-xs text-faint sm:block">{w.org}</span>
        </div>
        <div key={tab} className="animate-fade-in p-5 sm:p-8">
          {tab === 0 && (
            <div className="space-y-2">
              {pending.map((r, i) => (
                <div key={r.id} className="animate-fade-up grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-ctl border bg-raised/40 px-4 py-3 hairline sm:grid-cols-[110px_1fr_160px_90px_auto]" style={{ animationDelay: `${i * 70}ms` }}>
                  <span className="font-mono text-xs text-faint">{r.id}</span>
                  <span className="truncate text-sm text-ink">{r.name} <span className="text-faint">· {r.category}</span></span>
                  <span className="hidden text-sm text-soft sm:block">{r.finding.type}</span>
                  <span className="hidden font-mono text-xs text-accent sm:block">{Math.round(r.finding.confidence * 100)}%</span>
                  <span className="rounded-ctl bg-accent/12 px-2.5 py-1 text-xs font-medium text-accent">{w.findings.action}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 1 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="font-medium text-ink">{w.series.label}</p>
                <span className="flex gap-4 text-xs text-soft"><span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-accent2" /> Actual</span><span className="flex items-center gap-1.5"><span className="h-0.5 w-4 border-t-2 border-dashed border-accent" /> {w.series.forecastLabel}</span></span>
              </div>
              <svg viewBox="0 0 620 160" className="w-full">
                {series.map((p, i) => (p.band ? <rect key={i} x={i * 50 + 10} y={y(p.band[1])} width="30" height={Math.max(2, y(p.band[0]) - y(p.band[1]))} rx="4" fill="var(--color-accent)" opacity=".12" /> : null))}
                <polyline points={series.filter((p) => p.actual !== null).map((p, i) => `${i * 50 + 25},${y(p.actual!)}`).join(' ')} fill="none" stroke="var(--color-accent2)" strokeWidth="3" strokeLinejoin="round" />
                <polyline points={series.map((p, i) => (p.forecast !== null ? `${i * 50 + 25},${y(p.forecast)}` : '')).filter(Boolean).join(' ')} fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeDasharray="7 6" />
                {series.map((p, i) => <circle key={i} cx={i * 50 + 25} cy={y(p.actual ?? p.forecast!)} r="3.5" fill={p.actual !== null ? 'var(--color-accent2)' : 'var(--color-accent)'} />)}
              </svg>
            </div>
          )}
          {tab === 2 && (
            <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="font-mono text-xs text-faint">{rec.id} · {fmtDate(rec.date)}</p>
                <h3 className="display mt-1 text-2xl text-ink">{rec.name}</h3>
                <p className="mt-1 text-sm text-soft">{rec.category} · {rec.location} · {w.entity.ownerLabel}: {rec.owner}</p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {w.metrics.map((m) => (
                    <div key={m.key} className={cn('rounded-ctl border px-3 py-3 hairline', isFlagged(m, rec.metrics[m.key]!) && 'border-bad/40 bg-bad/5')}>
                      <p className="text-[0.7rem] text-faint">{m.label}</p>
                      <p className="display mt-1 text-xl text-ink">{rec.metrics[m.key]}{m.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-card border border-accent/25 bg-accent/6 p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-accent"><Sparkles className="h-4 w-4" /> {w.findings.label}</p>
                <p className="display mt-3 text-xl text-ink">{rec.finding.type}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-accent" style={{ width: `${rec.finding.confidence * 100}%` }} /></div>
                <p className="mt-1 font-mono text-xs text-soft">{Math.round(rec.finding.confidence * 100)}% confidence</p>
                <p className="mt-4 text-sm leading-relaxed text-soft">{rec.finding.evidence}</p>
                <p className="mt-4 text-xs text-faint">A person confirms, edits or rejects this before it is used.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="reveal mt-8 text-center">
        <ButtonLink to="/workspace" variant="secondary" arrow>Open the live workspace</ButtonLink>
      </div>
    </Section>
  )
}

/* ---------- AWS ---------- */
export function AwsFlow() {
  const active = useTicker(b.aws.flow.length, 1100)
  return (
    <div className="panel relative overflow-hidden p-6 sm:p-8">
      <Motif />
      <p className="relative mb-6 font-mono text-xs uppercase tracking-[0.2em] text-faint">Data flow</p>
      <div className="relative flex flex-wrap items-center gap-y-4">
        {b.aws.flow.map((f, i) => (
          <div key={f} className="flex items-center">
            <span className={cn('rounded-ctl border px-3.5 py-2 text-sm font-medium transition-all duration-500', i === active ? 'scale-105 border-accent bg-accent text-on-accent shadow-[0_12px_30px_-14px_var(--color-accent)]' : i < active ? 'border-accent/40 bg-accent/10 text-ink' : 'bg-raised text-soft hairline')}>
              {f}
            </span>
            {i < b.aws.flow.length - 1 && (
              <span className="relative mx-2 h-px w-8 overflow-hidden bg-ink/15 sm:w-10">
                <span className={cn('absolute inset-y-0 left-0 w-full origin-left bg-accent transition-transform duration-700', i < active ? 'scale-x-100' : 'scale-x-0')} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Aws({ compact }: { compact?: boolean }) {
  const [hover, setHover] = useState(0)
  return (
    <Section id="aws" eyebrow="How we use AWS" title={`Built on *AWS*, service by service.`} intro={b.aws.intro}>
      <div className="reveal mb-6">
        <AwsFlow />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-2">
          {b.aws.services.map((s, i) => (
            <button key={s.name} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onClick={() => setHover(i)} className={cn('reveal flex w-full items-center gap-4 rounded-card border p-4 text-left transition-all duration-300', hover === i ? 'border-accent/50 bg-accent/8' : 'bg-surface/50 hairline hover:bg-surface')} style={{ ['--d' as string]: `${i * 70}ms` }}>
              <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-ctl transition-colors', hover === i ? 'bg-accent text-on-accent' : 'bg-raised text-accent')}>
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block font-semibold text-ink">{s.name}</span>
                <span className="block text-sm text-soft">{s.role}</span>
              </span>
              <ArrowRight className={cn('h-4 w-4 transition-all', hover === i ? 'translate-x-0 text-accent opacity-100' : '-translate-x-2 opacity-0')} />
            </button>
          ))}
        </div>
        <div className="reveal reveal-right panel relative overflow-hidden p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
          <div key={hover} className="relative animate-fade-up">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-card bg-gradient-to-br from-accent to-accent2 text-on-accent">
              <Icon name={b.aws.services[hover]!.icon} className="h-7 w-7" />
            </span>
            <p className="eyebrow mt-8">{b.aws.services[hover]!.role}</p>
            <h3 className="display mt-2 text-3xl text-ink">{b.aws.services[hover]!.name}</h3>
            <p className="mt-5 text-lg leading-relaxed text-soft">{b.aws.services[hover]!.detail}</p>
          </div>
          {!compact && (
            <div className="relative mt-10 grid gap-4 border-t pt-6 hairline sm:grid-cols-3">
              {b.aws.principles.map((p) => (
                <div key={p.title}>
                  <p className="text-sm font-semibold text-ink">{p.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-soft">{p.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {compact && (
        <div className="reveal mt-8">
          <Link to="/technology" className="link inline-flex items-center gap-1.5 text-sm font-medium">See the full architecture <ArrowRight className="h-4 w-4" /></Link>
        </div>
      )}
    </Section>
  )
}

/* ---------- Customers ---------- */
export function Customers() {
  const [i, setI] = useState(0)
  const c = b.customers[i]!
  return (
    <Section id="customers" eyebrow="Who it’s for" title={`Made for the teams who *live with the problem*.`}>
      <div className="reveal flex flex-wrap gap-2">
        {b.customers.map((x, k) => (
          <button key={x.id} onClick={() => setI(k)} className={cn('flex items-center gap-2 rounded-ctl border px-4 py-2.5 text-sm font-medium transition-all', k === i ? 'border-accent bg-accent text-on-accent' : 'bg-surface/60 text-soft hairline hover:text-ink')}>
            <Icon name={x.icon} className="h-4 w-4" /> {x.title}
          </button>
        ))}
      </div>
      <div key={c.id} className="mt-6 grid animate-fade-up gap-5 lg:grid-cols-3">
        <div className="panel p-7">
          <p className="eyebrow mb-4 text-bad">The challenge</p>
          <p className="text-lg leading-relaxed text-ink">{c.pain}</p>
        </div>
        <div className="panel relative overflow-hidden p-7">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/12 to-transparent" />
          <p className="eyebrow mb-4">The outcome</p>
          <p className="text-lg leading-relaxed text-ink">{c.outcome}</p>
        </div>
        <div className="panel p-7">
          <p className="eyebrow mb-4 text-faint">What you get</p>
          <ul className="space-y-3">
            {c.bullets.map((x) => (
              <li key={x} className="flex gap-2.5 text-soft"><Check className="mt-1 h-4 w-4 shrink-0 text-accent" />{x}</li>
            ))}
          </ul>
          <Link to={`/use-cases#${c.id}`} className="link mt-6 inline-flex items-center gap-1 text-sm">More on {c.title.toLowerCase()} <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </Section>
  )
}

/* ---------- Safeguards ---------- */
export function Safeguards() {
  return (
    <Section id="safeguards" eyebrow="Responsible by design" title="AI that *supports people* — and shows its work." align="center">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {b.safeguards.map((s, i) => (
          <div key={s.title} className="reveal panel spot lift p-7 text-center" style={{ ['--d' as string]: `${i * 90}ms` }}>
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-good/10 text-good ring-8 ring-good/5">
              <Icon name={s.icon} className="h-6 w-6" />
            </span>
            <h3 className="font-semibold text-ink">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-soft">{s.body}</p>
          </div>
        ))}
      </div>
      {b.sectorNote && <p className="reveal mx-auto mt-10 max-w-3xl rounded-card border bg-surface/60 px-6 py-4 text-center text-sm text-soft hairline">{b.sectorNote}</p>}
    </Section>
  )
}

/* ---------- MVP ---------- */
export function Mvp() {
  const m = b.mvp
  return (
    <Section id="mvp" eyebrow="Where we start" title={m.heading} intro={m.body}>
      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div className="reveal panel p-8">
          <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-ink"><Badge tone="good" dot>MVP</Badge> Included in the pilot</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {m.includes.map((x) => (
              <li key={x} className="flex gap-2.5 text-soft"><Check className="mt-1 h-4 w-4 shrink-0 text-good" />{x}</li>
            ))}
          </ul>
        </div>
        <div className="reveal panel p-8" style={{ ['--d' as string]: '120ms' }}>
          <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-ink"><Badge tone="muted">Later</Badge> After the pilot</p>
          <ul className="space-y-3">
            {m.later.map((x) => (
              <li key={x} className="flex gap-2.5 text-faint"><ArrowRight className="mt-1 h-4 w-4 shrink-0" />{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

/* ---------- Pricing ---------- */
export function PricingTable() {
  const [annual, setAnnual] = useState(true)
  return (
    <div>
      <div className="reveal mb-10 flex flex-col items-center gap-3">
        <div className="inline-flex rounded-ctl border bg-surface p-1 hairline">
          {(['Monthly', 'Annual'] as const).map((k) => (
            <button key={k} onClick={() => setAnnual(k === 'Annual')} className={cn('rounded-ctl px-5 py-2 text-sm font-medium transition', (k === 'Annual') === annual ? 'bg-accent text-on-accent' : 'text-soft')}>
              {k}
            </button>
          ))}
        </div>
        <p className="text-xs text-faint">Annual billing includes two months free · {b.pricing.model}</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {b.pricing.tiers.map((t, i) => {
          const price = t.monthly === null ? null : annual ? Math.round((t.monthly * 10) / 12) : t.monthly
          return (
            <div key={t.name} className={cn('reveal panel relative flex flex-col p-8', t.highlight && 'border-accent/60 shadow-[0_30px_70px_-40px_var(--color-accent)] lg:-translate-y-3')} style={{ ['--d' as string]: `${i * 100}ms` }}>
              {t.highlight && <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-on-accent">Most popular</span>}
              <h3 className="text-lg font-semibold text-ink">{t.name}</h3>
              <p className="mt-1 text-sm text-soft">{t.blurb}</p>
              <p className="mt-7 flex items-baseline gap-1.5">
                {price === null ? <span className="display text-4xl text-ink">Custom</span> : (<><span className="display text-5xl text-ink">${price.toLocaleString()}</span><span className="text-sm text-faint">{b.pricing.unit}</span></>)}
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-soft"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{f}</li>
                ))}
              </ul>
              <ButtonLink to={`/contact?type=${t.monthly === null ? 'contact' : 'demo'}&plan=${encodeURIComponent(t.name)}`} variant={t.highlight ? 'primary' : 'secondary'} className="mt-8 w-full" arrow>
                {t.cta ?? 'Start a pilot'}
              </ButtonLink>
            </div>
          )
        })}
      </div>
      <p className="reveal mx-auto mt-8 max-w-2xl text-center text-sm text-faint">{b.pricing.note}</p>
    </div>
  )
}

export function Pricing() {
  return (
    <Section id="pricing" eyebrow="Pricing" title={`Simple ${b.pricing.model.toLowerCase().replace(/s$/, '')} pricing.`} align="center">
      <PricingTable />
    </Section>
  )
}

/* ---------- Team ---------- */
export function Team({ heading = true }: { heading?: boolean }) {
  const [lead, co, ...rest] = b.founders
  const Card = ({ p, big, i }: { p: (typeof b.founders)[number]; big?: boolean; i: number }) => (
    <article className={cn('reveal panel spot lift relative overflow-hidden', big ? 'p-8' : 'p-6')} style={{ ['--d' as string]: `${i * 110}ms` }}>
      {big && <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/12 blur-3xl" />}
      <div className="relative flex items-start gap-5">
        <Avatar name={p.name} className={big ? 'h-20 w-20 text-2xl ring-4 ring-accent/15' : 'h-14 w-14 text-lg'} />
        <div className="min-w-0">
          <p className="eyebrow">{p.role}</p>
          <h3 className={cn('display mt-1.5 text-ink', big ? 'text-2xl' : 'text-xl')}>{p.name}</h3>
          <p className="mt-1 text-xs text-faint">{p.location}, Nigeria</p>
        </div>
      </div>
      <p className="relative mt-5 text-sm leading-relaxed text-soft">{p.bio}</p>
      {p.quote && (
        <blockquote className="relative mt-5 flex gap-2.5 border-l-2 border-accent pl-4 text-sm italic text-ink">
          <Quote className="h-4 w-4 shrink-0 text-accent" />
          {p.quote}
        </blockquote>
      )}
      <div className="relative mt-5 flex flex-wrap gap-1.5">
        {p.focus.map((f) => (
          <span key={f} className="chip text-soft">{f}</span>
        ))}
      </div>
    </article>
  )
  const content = (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <Card p={lead!} big i={0} />
        <Card p={co!} big i={1} />
      </div>
      {rest.length > 0 && (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {rest.map((p, i) => (
            <Card key={p.name} p={p} i={i + 2} />
          ))}
        </div>
      )}
    </>
  )
  if (!heading) return content
  return (
    <Section id="team" eyebrow="The team" title="Founded in Nigeria by people who have *done the work*." intro={`${lead!.name} and ${co!.name} started ${b.name} after seeing the problem first-hand.`}>
      {content}
    </Section>
  )
}

/* ---------- Roadmap ---------- */
export function Roadmap() {
  return (
    <Section id="roadmap" eyebrow="Roadmap" title="Where we are, and *where we’re going*.">
      <div className="relative grid gap-5 md:grid-cols-3">
        {b.roadmap.map((r, i) => (
          <div key={r.phase} className="reveal relative panel p-7" style={{ ['--d' as string]: `${i * 120}ms` }}>
            <div className="mb-5 flex items-center gap-3">
              <span className={cn('h-3 w-3 rounded-full', i === 0 ? 'animate-pulse-ring bg-accent' : 'bg-ink/20')} />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-faint">{r.phase}</span>
            </div>
            <h3 className="display text-2xl text-ink">{r.title}</h3>
            <ul className="mt-5 space-y-2.5">
              {r.items.map((x) => (
                <li key={x} className="flex gap-2 text-sm text-soft"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />{x}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ---------- FAQ ---------- */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section id="faq" eyebrow="FAQ" title="Questions we *hear often*.">
      <div className="mx-auto max-w-3xl divide-y divide-hairline rounded-card border hairline">
        {b.faq.map((f, i) => (
          <div key={f.q} className="reveal">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open === i}>
              <span className="font-medium text-ink">{f.q}</span>
              <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 hairline', open === i && 'rotate-45 border-accent bg-accent text-on-accent')}>
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <div className={cn('grid transition-all duration-500', open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-soft">{f.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ---------- CTA ---------- */
export function Cta() {
  return (
    <Container className="py-20">
      <div className="reveal reveal-zoom relative overflow-hidden rounded-card bg-gradient-to-br from-accent via-accent to-accent2 px-8 py-16 text-center text-on-accent sm:px-16">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgb(255 255 255 / 0.35), transparent 40%), radial-gradient(circle at 80% 80%, rgb(255 255 255 / 0.2), transparent 40%)' }} />
        <div className="absolute -left-10 -top-10 h-40 w-40 animate-float rounded-full border border-white/25" />
        <div className="absolute -bottom-16 right-10 h-56 w-56 animate-float-slow rounded-full border border-white/20" />
        <div className="relative">
          <h2 className="display mx-auto max-w-3xl text-3xl sm:text-5xl">
            <Headline text={b.tagline.replace(/\*/g, '')} />
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg opacity-90">Start with a focused pilot. We’ll set it up with your team and your data.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/contact?type=demo" className="group inline-flex items-center gap-2 rounded-ctl bg-on-accent px-6 py-3.5 text-sm font-semibold text-accent transition hover:-translate-y-0.5">
              {b.hero.primary} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link to="/workspace" className="inline-flex items-center gap-2 rounded-ctl border border-white/40 px-6 py-3.5 text-sm font-semibold transition hover:bg-white/10">
              Try the live demo
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}

/* ---------- Page header for inner pages ---------- */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden pb-12 pt-36 sm:pt-44">
      <div className="glow absolute inset-0 -z-10" />
      <Motif className="-z-10" />
      <Container>
        <p className="eyebrow animate-fade-up mb-5">{eyebrow}</p>
        <h1 className="display animate-fade-up max-w-4xl text-4xl text-ink [animation-delay:80ms] sm:text-6xl">
          <Headline text={title} />
        </h1>
        {intro && <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-soft [animation-delay:160ms]">{intro}</p>}
      </Container>
    </section>
  )
}

