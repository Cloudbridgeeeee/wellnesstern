import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { business } from '../../config/business'
import { average, breakdown, isFlagged, makeSeries } from '../../lib/data'
import { relTime } from '../../lib/format'
import { AssistantPanel } from '../AssistantPanel'
import { RecordDrawer } from '../RecordDrawer'
import { useWorkspace } from '../store'
import { Card, chart, Confidence, Kpi, PageTitle } from '../ui'

const W = business.workspace

export default function Overview() {
  const { records, audit, me } = useWorkspace()
  const [open, setOpen] = useState<string | null>(null)
  const series = useMemo(() => makeSeries(W, business.slug), [])
  const pending = records.filter((r) => r.finding.state === 'pending')
  const flagged = records.filter((r) => W.metrics.some((m) => isFlagged(m, r.metrics[m.key]!)))
  const m0 = W.metrics[0]!
  const bd = breakdown(W, records)
  const reviewed = records.length - pending.length
  return (
    <>
      <PageTitle title={`Good day, ${me.split(' ')[0]}`} sub={`${W.org} · ${records.length} ${W.entity.plural.toLowerCase()} in the last 12 weeks`} actions={<Link to="/workspace/review" className="inline-flex items-center gap-1.5 rounded-ctl bg-accent px-4 py-2 text-sm font-medium text-on-accent">Review {pending.length} pending <ArrowRight className="h-4 w-4" /></Link>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label={W.entity.plural} value={records.length} hint="in this workspace" />
        <Kpi label="Awaiting review" value={pending.length} tone={pending.length > 10 ? 'warn' : undefined} hint="AI suggestions not yet confirmed" />
        <Kpi label={`Avg. ${m0.label.toLowerCase()}`} value={average(records, m0.key)} unit={m0.unit} decimals={m0.decimals} hint={`threshold ${m0.threshold}${m0.unit}`} />
        <Kpi label="Flagged" value={(flagged.length / Math.max(1, records.length)) * 100} unit="%" decimals={0} tone="bad" hint={`${flagged.length} past a threshold`} />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card title={W.series.label} action={<span className="text-xs text-faint">{W.series.forecastLabel} with uncertainty band</span>}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={series} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={chart.b} stopOpacity={0.35} /><stop offset="1" stopColor={chart.b} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke={chart.grid} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: chart.axis, fontSize: 11 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fill: chart.axis, fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip {...chart.tooltip} />
                <Area dataKey="band" stroke="none" fill={chart.a} fillOpacity={0.14} name="Range" />
                <Area dataKey="actual" stroke={chart.b} strokeWidth={2.5} fill="url(#ga)" name="Actual" />
                <Line dataKey="forecast" stroke={chart.a} strokeWidth={2.5} strokeDasharray="6 5" dot={false} name={W.series.forecastLabel} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={W.breakdownLabel}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bd} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid stroke={chart.grid} horizontal={false} />
                <XAxis type="number" tick={{ fill: chart.axis, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fill: chart.axis, fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip {...chart.tooltip} cursor={{ fill: 'color-mix(in oklab, var(--color-accent) 8%, transparent)' }} />
                <Bar dataKey="clear" stackId="a" fill={chart.b} name="Within threshold" radius={[4, 0, 0, 4]} />
                <Bar dataKey="flagged" stackId="a" fill={chart.a} name="Flagged" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <AssistantPanel onOpen={setOpen} />
        <div className="space-y-4">
          <Card title="Lowest-confidence suggestions" action={<Link to="/workspace/review" className="link text-xs">Open queue</Link>}>
            <ul className="divide-y divide-hairline">
              {[...pending].sort((a, b) => a.finding.confidence - b.finding.confidence).slice(0, 5).map((r) => (
                <li key={r.id}>
                  <button onClick={() => setOpen(r.id)} className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm hover:text-accent">
                    <span className="min-w-0"><span className="font-mono text-xs text-faint">{r.id}</span> <span className="truncate text-ink">{r.finding.type}</span></span>
                    <Confidence value={r.finding.confidence} />
                  </button>
                </li>
              ))}
              {pending.length === 0 && <li className="py-4 text-sm text-soft">Nothing waiting — every suggestion has been reviewed.</li>}
            </ul>
          </Card>
          <Card title="Review progress">
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series.filter((p) => p.actual !== null).map((p, i) => ({ ...p, v: Math.round((reviewed / records.length) * 100 * (0.6 + (i / 30))) }))} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                  <Area dataKey="v" stroke={chart.good} fill={chart.good} fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-sm text-soft"><span className="font-semibold text-ink">{Math.round((reviewed / Math.max(1, records.length)) * 100)}%</span> of suggestions reviewed by a person.</p>
          </Card>
          <Card title="Recent activity" action={<Link to="/workspace/audit" className="link text-xs">Audit log</Link>}>
            <ul className="space-y-2.5">
              {audit.slice(0, 4).map((a) => (
                <li key={a.id} className="flex justify-between gap-3 text-sm">
                  <span className="truncate text-soft"><span className="text-ink">{a.actor}</span> {a.action.toLowerCase()} {a.target && <span className="font-mono text-xs text-faint">{a.target}</span>}</span>
                  <span className="shrink-0 text-xs text-faint">{relTime(a.at)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <RecordDrawer record={records.find((r) => r.id === open) ?? null} onClose={() => setOpen(null)} />
    </>
  )
}
