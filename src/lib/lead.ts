import { business } from '../config/business'

export interface Lead {
  kind: 'demo' | 'contact' | 'pilot'
  name: string
  email: string
  company: string
  role?: string
  size?: string
  message: string
}

export interface LeadResult {
  ok: boolean
  error?: string
  mailto: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateLead(lead: Lead): string | null {
  if (lead.name.trim().length < 2) return 'Please add your name.'
  if (!EMAIL.test(lead.email.trim())) return 'Please use a valid work email address.'
  if (lead.company.trim().length < 2) return 'Please add your organisation.'
  if (lead.message.trim().length < 10) return 'Tell us a little more (at least 10 characters).'
  return null
}

export function mailtoFor(lead: Lead) {
  const subject = `${business.name} ${lead.kind === 'demo' ? 'demo request' : lead.kind === 'pilot' ? 'pilot enquiry' : 'enquiry'} — ${lead.company}`
  const body = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Organisation: ${lead.company}`,
    lead.role ? `Role: ${lead.role}` : '',
    lead.size ? `Size: ${lead.size}` : '',
    '',
    lead.message,
  ]
    .filter((l) => l !== '')
    .join('\n')
  return `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/**
 * Stores the request locally (no backend is required for the demo) and returns a
 * pre-filled email the visitor can send. Swap this for an API call when one exists.
 */
export function submitLead(lead: Lead, storage: Pick<Storage, 'getItem' | 'setItem'> | null = typeof localStorage !== 'undefined' ? localStorage : null): LeadResult {
  const mailto = mailtoFor(lead)
  const error = validateLead(lead)
  if (error) return { ok: false, error, mailto }
  try {
    const key = `${business.slug}:leads`
    const list = JSON.parse(storage?.getItem(key) ?? '[]') as unknown[]
    list.push({ ...lead, at: new Date().toISOString() })
    storage?.setItem(key, JSON.stringify(list.slice(-50)))
  } catch {
    /* storage unavailable — the mailto link still works */
  }
  return { ok: true, mailto }
}
