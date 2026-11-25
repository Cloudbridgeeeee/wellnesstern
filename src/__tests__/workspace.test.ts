import { describe, expect, it } from 'vitest'
import { business } from '../config/business'
import { can } from '../lib/access'
import { answer } from '../lib/assistant'
import { isFlagged, makeRecords, makeSeries } from '../lib/data'

const W = business.workspace

describe('demo data', () => {
  it('is deterministic for the same day', () => {
    const now = Date.UTC(2026, 0, 15)
    expect(makeRecords(W, business.slug, 10, now)).toEqual(makeRecords(W, business.slug, 10, now))
  })

  it('includes pending reviews and flagged records', () => {
    const rs = makeRecords(W, business.slug)
    expect(rs.some((r) => r.finding.state === 'pending')).toBe(true)
    expect(rs.some((r) => W.metrics.some((m) => isFlagged(m, r.metrics[m.key]!)))).toBe(true)
  })

  it('builds a forecast with a widening band', () => {
    const s = makeSeries(W, business.slug)
    const f = s.filter((p) => p.actual === null)
    expect(f.length).toBe(6)
    const w = (p: (typeof f)[number]) => p.band![1] - p.band![0]
    expect(w(f[f.length - 1]!)).toBeGreaterThan(w(f[0]!))
  })
})

describe('permissions', () => {
  it('gives the first role every permission and the last role view only', () => {
    expect(can(W.roles[0], 'manage')).toBe(true)
    expect(can(W.roles[W.roles.length - 1], 'review')).toBe(false)
  })
})

describe('assistant', () => {
  const rs = makeRecords(W, business.slug)
  it('cites records when answering about review', () => {
    const a = answer('What needs review?', rs, W)
    expect(a.refused).toBeFalsy()
    expect(a.cites.length).toBeGreaterThan(0)
  })
  it('declines decisions reserved for qualified people', () => {
    const phrase = W.assistant.refuse[0]!.match[0]!
    expect(answer(`Can you ${phrase}?`, rs, W).refused).toBe(true)
  })
})
