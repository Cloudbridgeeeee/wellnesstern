import { Check, Pencil, Sparkles, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { business } from '../../config/business'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/cn'
import { isFlagged } from '../../lib/data'
import { fmtDate } from '../../lib/format'
import { RecordDrawer } from '../RecordDrawer'
import { useWorkspace } from '../store'
import { Card, Confidence, Empty, PageTitle, StatusBadge } from '../ui'

const W = business.workspace

export default function Review() {
  const { records, review, allowed, settings } = useWorkspace()
  const [mode, setMode] = useState<'low' | 'new'>('low')
  const [open, setOpen] = useState<string | null>(null)
  const [idx, setIdx] = useState(0)
  const queue = useMemo(() => {
    const p = records.filter((r) => r.finding.state === 'pending')
    return mode === 'low' ? [...p].sort((a, b) => a.finding.confidence - b.finding.confidence) : [...p].sort((a, b) => b.date.localeCompare(a.date))
  }, [records, mode])
  const cur = queue[Math.min(idx, queue.length - 1)]

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (!cur || open || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'SELECT') return
      if (e.key === 'a') review(cur.id, 'accepted')
      if (e.key === 'r') review(cur.id, 'rejected')
      if (e.key === 'j') setIdx((i) => Math.min(i + 1, queue.length - 1))
      if (e.key === 'k') setIdx((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [cur, open, review, queue.length])

  return (
    <>
      <PageTitle title="Review queue" sub={`${queue.length} suggestions waiting · nothing is final until a person confirms it`} actions={
        <div className="inline-flex rounded-ctl border p-1 hairline">
          {([['low', 'Lowest confidence first'], ['new', 'Newest first']] as const).map(([k, l]) => (
            <button key={k} onClick={() => { setMode(k); setIdx(0) }} className={cn('rounded-ctl px-3 py-1.5 text-xs transition', mode === k ? 'bg-accent text-on-accent' : 'text-soft')}>{l}</button>
          ))}
        </div>
      } />
      {!allowed('review') && <p className="mb-4 rounded-ctl bg-warn/10 px-4 py-3 text-sm text-warn">Your role can view the queue but not review. Switch to a reviewing role in the sidebar to try it — blocked attempts are recorded in the audit log.</p>}
      {!cur ? (
        <Empty>The queue is empty. Import new data from the Import page to see the pipeline in action.</Empty>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <Card key={cur.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-faint">{cur.id} · {idx + 1} of {queue.length}</p>
                <h2 className="display mt-1 text-2xl text-ink">{cur.name}</h2>
                <p className="mt-1 text-sm text-soft">{cur.category} · {cur.location} · {fmtDate(cur.date)}</p>
              </div>
              <StatusBadge id={cur.status} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {W.metrics.map((m) => (
                <div key={m.key} className={cn('rounded-ctl border p-3 hairline', isFlagged(m, cur.metrics[m.key]!) && 'border-bad/40 bg-bad/5')}>
                  <p className="text-[0.68rem] text-faint">{m.label}</p>
                  <p className="display mt-1 text-xl text-ink">{cur.metrics[m.key]}{m.unit}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-card border border-accent/25 bg-accent/5 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-accent"><Sparkles className="h-4 w-4" /> Suggested {W.findings.label.toLowerCase()}</p>
              <p className="display mt-2 text-2xl text-ink">{cur.finding.type}</p>
              <div className="mt-2 flex items-center gap-3"><Confidence value={cur.finding.confidence} />{cur.finding.confidence * 100 < settings.threshold && <span className="text-xs text-warn">Below your {settings.threshold}% review threshold</span>}</div>
              <p className="mt-4 text-sm leading-relaxed text-soft">{cur.finding.evidence}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => review(cur.id, 'accepted')}><Check className="h-4 w-4" /> Confirm <kbd className="ml-1 rounded bg-black/15 px-1 font-mono text-[0.6rem]">A</kbd></Button>
              <Button variant="secondary" onClick={() => setOpen(cur.id)}><Pencil className="h-4 w-4" /> Correct…</Button>
              <Button variant="secondary" onClick={() => review(cur.id, 'rejected')}><X className="h-4 w-4" /> Reject <kbd className="ml-1 rounded bg-ink/10 px-1 font-mono text-[0.6rem]">R</kbd></Button>
              <span className="ml-auto self-center text-xs text-faint">J / K to move</span>
            </div>
          </Card>
          <Card title={`Up next (${queue.length})`}>
            <ul className="scrollbar-thin max-h-[32rem] divide-y overflow-y-auto divide-hairline">
              {queue.map((r, i) => (
                <li key={r.id}>
                  <button onClick={() => setIdx(i)} className={cn('flex w-full items-center justify-between gap-3 rounded-ctl px-2 py-2.5 text-left text-sm transition', i === idx ? 'bg-accent/10' : 'hover:bg-raised/60')}>
                    <span className="min-w-0">
                      <span className="block font-mono text-[0.68rem] text-faint">{r.id}</span>
                      <span className="block truncate text-ink">{r.finding.type} <span className="text-faint">· {r.category}</span></span>
                    </span>
                    <Confidence value={r.finding.confidence} />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
      <RecordDrawer record={records.find((r) => r.id === open) ?? null} onClose={() => setOpen(null)} />
    </>
  )
}
