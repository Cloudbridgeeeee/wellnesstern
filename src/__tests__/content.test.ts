import { describe, expect, it } from 'vitest'
import { business } from '../config/business'

describe('site content', () => {
  it('names the founder and co-founder', () => {
    expect(business.founders.length).toBeGreaterThanOrEqual(2)
    expect(business.founders[0]!.role.toLowerCase()).toContain('founder')
    expect(business.founders[1]!.role.toLowerCase()).toContain('co-founder')
  })

  it('describes every core feature and AWS service', () => {
    expect(business.features.length).toBe(5)
    expect(business.aws.services.length).toBeGreaterThanOrEqual(5)
    for (const s of business.aws.services) expect(s.detail.length).toBeGreaterThan(40)
  })

  it('has a home section order without duplicates', () => {
    expect(new Set(business.theme.order).size).toBe(business.theme.order.length)
  })

  it('has one pricing tier highlighted', () => {
    expect(business.pricing.tiers.filter((t) => t.highlight).length).toBe(1)
  })
})
