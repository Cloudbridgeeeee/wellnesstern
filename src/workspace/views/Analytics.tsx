import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ComposedChart, Area, Line, Pie, PieChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'
import { business } from '../../config/business'
import { cn } from '../../lib/cn'
import { average, findingTypeCounts, isFlagged, makeSeries } from '../../lib/data'
import { fmtNumber } from '../../lib/format'
import { useWorkspace } from '../store'
import { Card, chart, PageTitle } from '../ui'

const W = business.workspace
const COLORS = [chart.a, chart.b, chart.c, chart.good, chart.bad, 'var(--color-soft)']

export default function Analytics() {
  const { records } = useWorkspace()
  const [metric, setMetric] = useState(W.metrics[0]!.key)
  const m = W.metrics.find((x) => x.key === metric)!
  const series = useMemo(() => makeSeries(W, business.slug), [])
  const types = findingTypeCounts(W, records)
  const byLoc = W.entity.locations.map((l) => {
    const rs = records.filter((r) => r.location === l)
    return { name: l, avg: Number(average(rs, metric).toFixed(m.decimals)), count: rs.length }
  })
  const scatter = records.map((r) => ({ x: r.metrics[W.metrics[0]!.key], y: r.metrics[(W.metrics[1] ?? W.metrics[0])!.key], z: r.finding.confidence * 100, id: r.id }))
  const accuracy = (() => {
    const done = records.filter((r) => r.finding.state !== 'pending')
    const ok = done.filter((r) => r.finding.state === 'accepted').length
    return done.length ? (ok / done.length) * 100 : 0
  })()

  return (
    <>
      <PageTitle title="Analytics" sub="Trends, breakdowns and how well the AI suggestions hold up under review" actions={
        <div className="inline-flex flex-wrap rounded-ctl border p-1 hairline">
          {W.metrics.map((x) => (
            <button key={x.key} onClick={() => setMetric(x.key)} className={cn('rounded-ctl px-3 py-1.5 text-xs transition', metric === x.key ? 'bg-accent text-on-accent' : 'text-soft')}>{x.label}</button>
          ))}
        </div>
      } />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title={`${W.series.label} and ${W.series.forecastLabel.toLowerCase()}`} className="xl:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={series} margin={{ left: -10, right: 10, top: 10 }}>
                <CartesianGrid stroke={chart.grid} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: chart.axis, fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: chart.axis, fontSize: 11 }} tickLine={false} axisLine={false} unit={W.series.unit.length < 3 ? W.series.unit : ''} />
                <Tooltip {...chart.tooltip} />
                <Area dataKey="band" stroke="none" fill={chart.a} fillOpacity={0.15} name="Range" />
                <Bar dataKey="actual" fill={chart.b} radius={[5, 5, 0, 0]} name="Actual" barSize={22} />
                <Line dataKey="forecast" stroke={chart.a} strokeWidth={3} strokeDasharray="6 5" dot={{ r: 3 }} name={W.series.forecastLabel} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={`Average ${m.label.toLowerCase()} by ${W.entity.locationLabel.toLowerCase()}`}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byLoc} margin={{ left: -10, right: 10 }}>
                <CartesianGrid stroke={chart.grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: chart.axis, fontSize: 10 }} tickLine={false} axisLine={false} interval={0} />
                <YAxis tick={{ fill: chart.axis, fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip {...chart.tooltip} cursor={{ fill: 'color-mix(in oklab, var(--color-accent) 8%, transparent)' }} />
                <Bar dataKey="avg" name={m.label} radius={[6, 6, 0, 0]}>
                  {byLoc.map((d, i) => <Cell key={i} fill={isFlagged(m, d.avg) ? chart.a : chart.b} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-faint">Highlighted bars are past the {m.threshold}{m.unit} threshold on average.</p>
        </Card>
        <Card title={`${W.findings.label} mix`}>
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_1fr]">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={types} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke="none">
                    {types.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...chart.tooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2">
              {types.map((t, i) => (
                <li key={t.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-soft"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />{t.name}</span>
                  <span className="font-mono text-xs text-ink">{t.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
        <Card title={`${W.metrics[0]!.label} vs ${(W.metrics[1] ?? W.metrics[0])!.label.toLowerCase()}`}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: -10, right: 10, top: 10 }}>
                <CartesianGrid stroke={chart.grid} />
                <XAxis type="number" dataKey="x" name={W.metrics[0]!.label} tick={{ fill: chart.axis, fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="number" dataKey="y" name={(W.metrics[1] ?? W.metrics[0])!.label} tick={{ fill: chart.axis, fontSize: 11 }} tickLine={false} axisLine={false} />
                <ZAxis type="number" dataKey="z" range={[30, 160]} name="Confidence" />
                <Tooltip {...chart.tooltip} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={scatter} fill={chart.a} fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="How suggestions hold up under review">
          <p className="display text-5xl text-ink">{fmtNumber(accuracy, 0)}<span className="text-2xl text-soft">%</span></p>
          <p className="mt-1 text-sm text-soft">of reviewed suggestions were confirmed without changes. The rest were corrected or rejected — and those corrections are what the next model version learns from.</p>
          <div className="mt-6 space-y-3">
            {(['accepted', 'edited', 'rejected', 'pending'] as const).map((s) => {
              const n = records.filter((r) => r.finding.state === s).length
              return (
                <div key={s}>
                  <div className="mb-1 flex justify-between text-xs"><span className="capitalize text-soft">{s === 'edited' ? 'corrected' : s === 'accepted' ? 'confirmed' : s}</span><span className="font-mono text-ink">{n}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${(n / records.length) * 100}%`, background: s === 'accepted' ? chart.good : s === 'edited' ? chart.b : s === 'rejected' ? chart.bad : 'var(--color-warn)' }} /></div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </>
  )
}
