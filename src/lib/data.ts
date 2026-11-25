import type { Metric, WorkspaceConfig } from '../config/types'
import { hash, pick, rng } from './random'

export type ReviewState = 'pending' | 'accepted' | 'edited' | 'rejected'

export interface Finding {
  type: string
  confidence: number
  evidence: string
  state: ReviewState
  reviewer?: string
  note?: string
  reviewedAt?: string
}

export interface WorkRecord {
  id: string
  name: string
  category: string
  location: string
  owner: string
  status: string
  date: string
  metrics: Record<string, number>
  finding: Finding
  history: { at: string; text: string }[]
}

export interface SeriesPoint {
  label: string
  actual: number | null
  forecast: number | null
  band: [number, number] | null
}

const DAY = 86_400_000

export function round(n: number, d: number) {
  const f = 10 ** d
  return Math.round(n * f) / f
}

/** Whether a metric value is past its threshold in the "bad" direction. */
export function isFlagged(m: Metric, v: number) {
  return m.higherIsBetter ? v < m.threshold : v > m.threshold
}

function fill(t: string, vars: Record<string, string>) {
  return t.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '')
}

export function makeRecord(cfg: WorkspaceConfig, i: number, seed: number, now: number, idOffset = 0): WorkRecord {
  const r = rng(seed + i * 7919)
  const e = cfg.entity
  const name = `${pick(r, e.names)}${r() > 0.55 ? ` ${String.fromCharCode(65 + Math.floor(r() * 8))}${Math.floor(r() * 90 + 10)}` : ''}`
  const category = pick(r, e.categories)
  const location = pick(r, e.locations)
  const owner = pick(r, cfg.people)
  const metrics: Record<string, number> = {}
  for (const m of cfg.metrics) {
    // Most values sit on the safe side of the threshold; about one in eight crosses it.
    const bad = r() < 0.13
    const t = m.threshold
    const safe = m.higherIsBetter ? [t, m.max] : [m.min, t]
    const risky = m.higherIsBetter ? [m.min, t] : [t, m.max]
    const [lo, hi] = bad ? risky : safe
    metrics[m.key] = round(lo! + (hi! - lo!) * (0.08 + r() * 0.84), m.decimals)
  }
  const flagged = cfg.metrics.filter((m) => isFlagged(m, metrics[m.key]!))
  const lead = flagged[0] ?? cfg.metrics[0]!
  const type = pick(r, cfg.findings.types)
  const confidence = round(0.58 + r() * 0.4, 2)
  const evidence = fill(pick(r, cfg.findings.evidence), {
    name,
    category,
    location,
    type,
    metric: lead.label.toLowerCase(),
    value: `${metrics[lead.key]}${lead.unit}`,
  })
  const ageDays = Math.floor(r() * 84)
  const date = new Date(now - ageDays * DAY - Math.floor(r() * DAY)).toISOString()
  const stateRoll = r()
  const state: ReviewState = ageDays < 12 || stateRoll < 0.3 ? 'pending' : stateRoll < 0.8 ? 'accepted' : stateRoll < 0.92 ? 'edited' : 'rejected'
  const statuses = e.statuses
  const status = flagged.length > 1 ? (statuses.find((s) => s.tone === 'bad') ?? statuses[0]!).id : state === 'pending' ? (statuses.find((s) => s.tone === 'warn') ?? statuses[0]!).id : pick(r, statuses).id
  const reviewer = state === 'pending' ? undefined : pick(r, cfg.people)
  return {
    id: `${e.idPrefix}-${String(1040 + i + idOffset).padStart(4, '0')}`,
    name,
    category,
    location,
    owner,
    status,
    date,
    metrics,
    finding: {
      type,
      confidence,
      evidence,
      state,
      reviewer,
      reviewedAt: reviewer ? new Date(new Date(date).getTime() + DAY * (1 + r() * 2)).toISOString() : undefined,
    },
    history: [
      { at: date, text: `${e.singular} recorded by ${owner}` },
      { at: new Date(new Date(date).getTime() + 3_600_000).toISOString(), text: `${cfg.findings.label} suggested: ${type} (${Math.round(confidence * 100)}%)` },
      ...(reviewer ? [{ at: new Date(new Date(date).getTime() + DAY).toISOString(), text: `Reviewed by ${reviewer}` }] : []),
    ],
  }
}

export function makeRecords(cfg: WorkspaceConfig, slug: string, count = 42, now = Date.now()) {
  const seed = hash(slug)
  return Array.from({ length: count }, (_, i) => makeRecord(cfg, i, seed, now)).sort((a, b) => b.date.localeCompare(a.date))
}

/** History plus a forecast with an uncertainty band that widens with the horizon. */
export function makeSeries(cfg: WorkspaceConfig, slug: string, past = 16, ahead = 6): SeriesPoint[] {
  const s = cfg.series
  const r = rng(hash(slug + 'series'))
  const out: SeriesPoint[] = []
  const value = (t: number) => s.base + s.trend * t + s.season * Math.sin((t / 6) * Math.PI)
  for (let t = 0; t < past; t++) {
    out.push({ label: `${s.period} ${t + 1}`, actual: round(value(t) + (r() - 0.5) * 2 * s.noise, 1), forecast: null, band: null })
  }
  const last = out[out.length - 1]!
  last.forecast = last.actual
  last.band = [last.actual!, last.actual!]
  for (let k = 1; k <= ahead; k++) {
    const t = past - 1 + k
    const f = round(value(t), 1)
    const w = s.noise * (0.8 + k * 0.45)
    out.push({ label: `${s.period} ${t + 1}`, actual: null, forecast: f, band: [round(f - w, 1), round(f + w, 1)] })
  }
  return out
}

export function breakdown(cfg: WorkspaceConfig, records: WorkRecord[]) {
  return cfg.entity.categories.map((c) => {
    const rs = records.filter((r) => r.category === c)
    const flagged = rs.filter((r) => cfg.metrics.some((m) => isFlagged(m, r.metrics[m.key]!))).length
    return { name: c, total: rs.length, flagged, clear: rs.length - flagged }
  })
}

export function average(records: WorkRecord[], key: string) {
  if (!records.length) return 0
  return records.reduce((a, r) => a + (r.metrics[key] ?? 0), 0) / records.length
}

export function findingTypeCounts(cfg: WorkspaceConfig, records: WorkRecord[]) {
  return cfg.findings.types
    .map((t) => ({ name: t, value: records.filter((r) => r.finding.type === t).length }))
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value)
}
