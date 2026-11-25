import { describe, expect, it } from 'vitest'
import { submitLead, validateLead, type Lead } from '../lib/lead'

const ok: Lead = { kind: 'demo', name: 'Ada Obi', email: 'ada@example.com', company: 'Example Ltd', message: 'We would like a demo please.' }

describe('lead form', () => {
  it('accepts a complete request', () => {
    expect(validateLead(ok)).toBeNull()
  })
  it('rejects a bad email', () => {
    expect(validateLead({ ...ok, email: 'nope' })).toMatch(/email/i)
  })
  it('stores the request and returns a mailto link', () => {
    const mem = new Map<string, string>()
    const r = submitLead(ok, { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v) })
    expect(r.ok).toBe(true)
    expect(r.mailto.startsWith('mailto:')).toBe(true)
    expect(mem.size).toBe(1)
  })
})
