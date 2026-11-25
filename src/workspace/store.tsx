import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { business } from '../config/business'
import type { Permission, Role } from '../config/types'
import { can } from '../lib/access'
import { makeRecord, makeRecords, type ReviewState, type WorkRecord } from '../lib/data'
import { hash } from '../lib/random'

const W = business.workspace
const KEY = `${business.slug}:workspace:v1`

export interface AuditEvent {
  id: string
  at: string
  actor: string
  role: string
  action: string
  target?: string
  allowed: boolean
}

export interface Toast {
  id: number
  text: string
  tone: 'good' | 'bad' | 'info'
}

interface Persisted {
  records: WorkRecord[]
  audit: AuditEvent[]
  roleId: string
  imports: number
  settings: { threshold: number; notify: boolean; region: string }
}

function initial(): Persisted {
  const records = makeRecords(W, business.slug)
  const now = Date.now()
  return {
    records,
    roleId: W.roles[0]!.id,
    imports: 0,
    settings: { threshold: 75, notify: true, region: 'Africa (Cape Town) af-south-1' },
    audit: records
      .filter((r) => r.finding.reviewer)
      .slice(0, 8)
      .map((r, i) => ({
        id: `seed-${i}`,
        at: r.finding.reviewedAt ?? new Date(now - i * 3_600_000).toISOString(),
        actor: r.finding.reviewer!,
        role: W.roles[1]?.label ?? W.roles[0]!.label,
        action: `${r.finding.state === 'rejected' ? 'Rejected' : r.finding.state === 'edited' ? 'Edited' : 'Accepted'} ${W.findings.label.toLowerCase()}`,
        target: r.id,
        allowed: true,
      })),
  }
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Persisted
  } catch {
    /* fall through */
  }
  return initial()
}

interface Store extends Persisted {
  role: Role
  me: string
  toasts: Toast[]
  setRole: (id: string) => void
  allowed: (p: Permission) => boolean
  review: (id: string, state: Exclude<ReviewState, 'pending'>, note?: string, newType?: string) => boolean
  updateStatus: (id: string, status: string) => boolean
  importSample: () => WorkRecord[] | null
  logExport: (what: string) => boolean
  updateSettings: (s: Partial<Persisted['settings']>) => boolean
  reset: () => void
  toast: (text: string, tone?: Toast['tone']) => void
}

const Ctx = createContext<Store | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(load)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
  }, [state])

  const role = W.roles.find((r) => r.id === state.roleId) ?? W.roles[0]!
  const me = W.people[W.roles.indexOf(role) % W.people.length]!

  const toast = useCallback((text: string, tone: Toast['tone'] = 'good') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, text, tone }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600)
  }, [])

  const audit = useCallback(
    (action: string, target: string | undefined, allowed: boolean) =>
      ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: new Date().toISOString(), actor: me, role: role.label, action, target, allowed }) satisfies AuditEvent,
    [me, role.label],
  )

  /** Runs `fn` only if the current role has `perm`; logs the attempt either way. */
  const guarded = useCallback(
    (perm: Permission, action: string, target: string | undefined, fn: (s: Persisted) => Persisted) => {
      const ok = can(role, perm)
      setState((s) => ({ ...(ok ? fn(s) : s), audit: [audit(ok ? action : `Blocked: ${action}`, target, ok), ...s.audit].slice(0, 200) }))
      if (!ok) toast(`${role.label} can’t do that — it needs “${perm}” permission.`, 'bad')
      return ok
    },
    [audit, role, toast],
  )

  const value = useMemo<Store>(
    () => ({
      ...state,
      role,
      me,
      toasts,
      toast,
      setRole: (id) => setState((s) => ({ ...s, roleId: id })),
      allowed: (p) => can(role, p),
      review: (id, decision, note, newType) => {
        const verb = decision === 'accepted' ? 'Accepted' : decision === 'edited' ? 'Edited' : 'Rejected'
        const ok = guarded('review', `${verb} ${W.findings.label.toLowerCase()}`, id, (s) => ({
          ...s,
          records: s.records.map((r) =>
            r.id !== id
              ? r
              : {
                  ...r,
                  finding: { ...r.finding, type: newType ?? r.finding.type, state: decision, reviewer: me, note, reviewedAt: new Date().toISOString() },
                  history: [...r.history, { at: new Date().toISOString(), text: `${verb} by ${me}${note ? ` — “${note}”` : ''}` }],
                },
          ),
        }))
        if (ok) toast(`${id}: ${verb.toLowerCase()}`)
        return ok
      },
      updateStatus: (id, status) => {
        const label = W.entity.statuses.find((x) => x.id === status)?.label ?? status
        const ok = guarded('edit', `Set status to ${label}`, id, (s) => ({
          ...s,
          records: s.records.map((r) => (r.id === id ? { ...r, status, history: [...r.history, { at: new Date().toISOString(), text: `Status set to ${label} by ${me}` }] } : r)),
        }))
        if (ok) toast(`${id} → ${label}`)
        return ok
      },
      importSample: () => {
        if (!can(role, 'import')) {
          guarded('import', `Import ${W.importSample.fileName}`, undefined, (s) => s)
          return null
        }
        const n = W.importSample.rows
        const seed = hash(business.slug + 'import' + state.imports)
        const fresh = Array.from({ length: n }, (_, i) => {
          const r = makeRecord(W, i, seed, Date.now(), state.records.length + 100 + state.imports * 10)
          return { ...r, date: new Date(Date.now() - i * 60_000).toISOString(), owner: me, finding: { ...r.finding, state: 'pending' as const, reviewer: undefined, reviewedAt: undefined } }
        })
        guarded('import', `Imported ${n} ${W.entity.plural.toLowerCase()} from ${W.importSample.fileName}`, undefined, (s) => ({ ...s, imports: s.imports + 1, records: [...fresh, ...s.records] }))
        return fresh
      },
      logExport: (what) => {
        const ok = guarded('export', `Exported ${what}`, undefined, (s) => s)
        if (ok) toast(`${what} exported`)
        return ok
      },
      updateSettings: (patch) => {
        const ok = guarded('manage', 'Updated workspace settings', undefined, (s) => ({ ...s, settings: { ...s.settings, ...patch } }))
        if (ok) toast('Settings saved')
        return ok
      },
      reset: () => {
        setState(initial())
        toast('Demo data reset', 'info')
      },
    }),
    [state, role, me, toasts, toast, guarded],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWorkspace() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return s
}
