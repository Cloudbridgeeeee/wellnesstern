import { Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { business } from '../config/business'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/cn'
import { isFlagged, type WorkRecord } from '../lib/data'
import { fmtDate, fmtDateTime } from '../lib/format'
import { useWorkspace } from './store'
import { Confidence, ReviewBadge, StatusBadge } from './ui'

const W = business.workspace

export function RecordDrawer({ record, onClose }: { record: WorkRecord | null; onClose: () => void }) {
  const { review, updateStatus, allowed } = useWorkspace()
  const [note, setNote] = useState('')
  const [type, setType] = useState('')
  useEffect(() => {
    setNote('')
    setType(record?.finding.type ?? '')
  }, [record?.id, record?.finding.type])
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  if (!record) return null
  const r = record
  const canReview = allowed('review')
  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={`${W.entity.singular} ${r.id}`}>
      <div className="absolute inset-0 animate-fade-in bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-xl animate-slide-in-right flex-col border-l bg-surface shadow-2xl hairline">
        <div className="flex items-start justify-between gap-4 border-b p-6 hairline">
          <div>
            <p className="font-mono text-xs text-faint">{r.id} · {W.entity.dateLabel} {fmtDate(r.date)}</p>
            <h2 className="display mt-1 text-2xl text-ink">{r.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-soft">
              <StatusBadge id={r.status} /> <span>{r.category}</span> · <span>{r.location}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-ctl p-1.5 text-soft hover:bg-raised hover:text-ink" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="scrollbar-thin flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-3">
            {W.metrics.map((m) => {
              const v = r.metrics[m.key]!
              const flag = isFlagged(m, v)
              return (
                <div key={m.key} className={cn('rounded-ctl border p-3 hairline', flag && 'border-bad/40 bg-bad/5')}>
                  <p className="text-[0.68rem] text-faint">{m.label}</p>
                  <p className={cn('display mt-1 text-xl', flag ? 'text-bad' : 'text-ink')}>{v}{m.unit}</p>
                  <p className="text-[0.62rem] text-faint">threshold {m.threshold}{m.unit}</p>
                </div>
              )
            })}
          </div>

          <div className="rounded-card border border-accent/25 bg-accent/5 p-5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-accent"><Sparkles className="h-4 w-4" /> {W.findings.label}</p>
              <ReviewBadge state={r.finding.state} />
            </div>
            <p className="display mt-3 text-xl text-ink">{r.finding.type}</p>
            <div className="mt-2"><Confidence value={r.finding.confidence} /></div>
            <p className="mt-4 text-sm leading-relaxed text-soft">{r.finding.evidence}</p>
            {r.finding.reviewer && (
              <p className="mt-4 text-xs text-faint">Reviewed by {r.finding.reviewer}{r.finding.reviewedAt ? ` · ${fmtDateTime(r.finding.reviewedAt)}` : ''}{r.finding.note ? ` — “${r.finding.note}”` : ''}</p>
            )}
          </div>

          <div className="rounded-card border p-5 hairline">
            <p className="text-sm font-semibold text-ink">{W.findings.action}</p>
            {!canReview && <p className="mt-2 rounded-ctl bg-warn/10 px-3 py-2 text-xs text-warn">Your current role can view but not review. Switch role in the sidebar to try it.</p>}
            <label className="mt-3 block text-xs text-soft">
              Classification
              <select className="input mt-1" value={type} onChange={(e) => setType(e.target.value)} disabled={!canReview}>
                {W.findings.types.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="mt-3 block text-xs text-soft">
              Reviewer note (optional)
              <input className="input mt-1" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why you confirmed, corrected or rejected it" disabled={!canReview} />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => review(r.id, type === r.finding.type ? 'accepted' : 'edited', note || undefined, type)}>{type === r.finding.type ? 'Confirm' : 'Save correction'}</Button>
              <Button size="sm" variant="secondary" onClick={() => review(r.id, 'rejected', note || undefined)}>Reject</Button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-ink">Status</p>
            <div className="flex flex-wrap gap-2">
              {W.entity.statuses.map((s) => (
                <button key={s.id} onClick={() => updateStatus(r.id, s.id)} className={cn('rounded-ctl border px-3 py-1.5 text-xs transition hairline', r.status === s.id ? 'border-accent bg-accent text-on-accent' : 'text-soft hover:text-ink')}>{s.label}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-ink">History</p>
            <ol className="relative space-y-3 border-l pl-5 hairline">
              {[...r.history].reverse().map((h, i) => (
                <li key={i} className="relative text-sm">
                  <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" />
                  <p className="text-ink">{h.text}</p>
                  <p className="text-xs text-faint">{fmtDateTime(h.at)}</p>
                </li>
              ))}
            </ol>
          </div>
          <p className="text-xs text-faint">{W.entity.ownerLabel}: {r.owner}</p>
        </div>
      </aside>
    </div>
  )
}
