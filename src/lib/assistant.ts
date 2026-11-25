import type { WorkspaceConfig } from '../config/types'
import { average, isFlagged, type WorkRecord } from './data'
import { fmtNumber } from './format'

export interface Answer {
  text: string
  cites: string[]
  refused?: boolean
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ')

/**
 * Answers questions from the records in the workspace only. It cites the records it used,
 * and declines anything that needs a qualified person's judgement.
 */
export function answer(question: string, records: WorkRecord[], cfg: WorkspaceConfig): Answer {
  const q = norm(question)
  if (q.trim().length < 3) return { text: 'Ask me about the records in this workspace — for example, what needs review this week.', cites: [] }

  for (const rule of cfg.assistant.refuse) {
    if (rule.match.some((m) => q.includes(m.toLowerCase()))) {
      return { text: rule.reason, cites: [], refused: true }
    }
  }

  const e = cfg.entity
  let pool = records
  const scope: string[] = []
  for (const c of e.categories) if (q.includes(norm(c).trim())) { pool = pool.filter((r) => r.category === c); scope.push(c) }
  for (const l of e.locations) if (q.includes(norm(l).trim())) { pool = pool.filter((r) => r.location === l); scope.push(l) }
  for (const t of cfg.findings.types) if (q.includes(norm(t).trim())) { pool = pool.filter((r) => r.finding.type === t); scope.push(t) }
  const where = scope.length ? ` for ${scope.join(', ')}` : ''

  if (!pool.length) return { text: `I couldn't find any ${e.plural.toLowerCase()}${where} in this workspace.`, cites: [] }

  if (/(pending|review|waiting|queue|unreviewed|approve)/.test(q)) {
    const p = pool.filter((r) => r.finding.state === 'pending').sort((a, b) => a.finding.confidence - b.finding.confidence)
    if (!p.length) return { text: `Nothing is waiting for review${where}. Every suggestion has been checked by a person.`, cites: [] }
    const low = p.filter((r) => r.finding.confidence < 0.75)
    return {
      text: `${p.length} ${p.length === 1 ? e.singular.toLowerCase() : e.plural.toLowerCase()}${where} ${p.length === 1 ? 'is' : 'are'} waiting for review. ${low.length ? `${low.length} ${low.length === 1 ? 'has' : 'have'} confidence below 75%, so I'd start with ${low.slice(0, 3).map((r) => r.id).join(', ')}.` : 'All have confidence of 75% or more.'}`,
      cites: p.slice(0, 5).map((r) => r.id),
    }
  }

  for (const m of cfg.metrics) {
    const words = norm(m.label).split(/\s+/).filter((w) => w.length > 3)
    if (words.some((w) => q.includes(w))) {
      const avg = average(pool, m.key)
      const flagged = pool.filter((r) => isFlagged(m, r.metrics[m.key]!))
      const sorted = [...pool].sort((a, b) => (m.higherIsBetter ? a.metrics[m.key]! - b.metrics[m.key]! : b.metrics[m.key]! - a.metrics[m.key]!))
      return {
        text: `Average ${m.label.toLowerCase()}${where} is ${fmtNumber(avg, m.decimals)}${m.unit} across ${pool.length} ${e.plural.toLowerCase()}. ${flagged.length} ${flagged.length === 1 ? 'is' : 'are'} past the ${m.threshold}${m.unit} threshold; the furthest out ${sorted.length > 1 ? 'are' : 'is'} ${sorted.slice(0, 3).map((r) => `${r.id} (${r.metrics[m.key]}${m.unit})`).join(', ')}.`,
        cites: sorted.slice(0, 3).map((r) => r.id),
      }
    }
  }

  if (/(flag|risk|issue|problem|worst|concern|attention|alert)/.test(q)) {
    const f = pool.filter((r) => cfg.metrics.some((m) => isFlagged(m, r.metrics[m.key]!)))
    const top = [...f].sort((a, b) => b.finding.confidence - a.finding.confidence).slice(0, 4)
    return {
      text: `${f.length} of ${pool.length} ${e.plural.toLowerCase()}${where} have at least one measure past its threshold. The most common suggestion among them is "${mode(f.map((r) => r.finding.type)) ?? '—'}". Start with ${top.map((r) => r.id).join(', ') || 'none'}.`,
      cites: top.map((r) => r.id),
    }
  }

  if (/(trend|common|most|frequent|top|recurring|pattern)/.test(q)) {
    const t = mode(pool.map((r) => r.finding.type))
    const c = mode(pool.map((r) => r.category))
    const l = mode(pool.map((r) => r.location))
    const ex = pool.filter((r) => r.finding.type === t).slice(0, 3)
    return {
      text: `Across ${pool.length} ${e.plural.toLowerCase()}${where}, the most frequent ${cfg.findings.label.toLowerCase()} is "${t}". It appears most in ${c} and at ${l}. Examples: ${ex.map((r) => r.id).join(', ')}.`,
      cites: ex.map((r) => r.id),
    }
  }

  const accepted = pool.filter((r) => r.finding.state === 'accepted' || r.finding.state === 'edited').length
  const pending = pool.filter((r) => r.finding.state === 'pending').length
  return {
    text: `There are ${pool.length} ${e.plural.toLowerCase()}${where}. ${accepted} suggestions have been confirmed by a reviewer and ${pending} are still pending. Try asking about ${cfg.metrics[0]!.label.toLowerCase()}, recurring patterns or what needs review.`,
    cites: pool.slice(0, 3).map((r) => r.id),
  }
}

function mode(xs: string[]) {
  const m = new Map<string, number>()
  for (const x of xs) m.set(x, (m.get(x) ?? 0) + 1)
  let best: string | undefined
  let n = 0
  for (const [k, v] of m) if (v > n) { best = k; n = v }
  return best
}
