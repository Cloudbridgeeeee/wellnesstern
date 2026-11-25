import { Printer, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { business } from '../../config/business'
import { Button } from '../../components/ui/Button'
import { average, breakdown, findingTypeCounts, isFlagged } from '../../lib/data'
import { fmtNumber } from '../../lib/format'
import { useWorkspace } from '../store'
import { Card, PageTitle } from '../ui'

const W = business.workspace

export default function Reports() {
  const { records, logExport, me } = useWorkspace()
  const [loc, setLoc] = useState('all')
  const [draft, setDraft] = useState(false)
  const pool = useMemo(() => (loc === 'all' ? records : records.filter((r) => r.location === loc)), [records, loc])
  const confirmed = pool.filter((r) => r.finding.state === 'accepted' || r.finding.state === 'edited')
  const pending = pool.filter((r) => r.finding.state === 'pending')
  const types = findingTypeCounts(W, confirmed)
  const bd = breakdown(W, pool).filter((x) => x.total)
  const m0 = W.metrics[0]!
  const worst = [...bd].sort((a, b) => b.flagged / Math.max(1, b.total) - a.flagged / Math.max(1, a.total))[0]

  const summary = `Across ${pool.length} ${W.entity.plural.toLowerCase()}${loc === 'all' ? '' : ` at ${loc}`}, average ${m0.label.toLowerCase()} was ${fmtNumber(average(pool, m0.key), m0.decimals)}${m0.unit}. ${confirmed.length} AI suggestions have been confirmed or corrected by reviewers; the most frequent confirmed ${W.findings.label.toLowerCase()} was “${types[0]?.name ?? '—'}”. ${worst ? `${worst.name} had the highest share of flagged ${W.entity.plural.toLowerCase()} (${worst.flagged} of ${worst.total}).` : ''} ${pending.length} suggestions are still waiting for review and are not included in these figures.`

  return (
    <>
      <PageTitle title="Reports" sub="Generated from reviewed records only" actions={
        <>
          <select className="input w-auto py-1.5 text-sm" value={loc} onChange={(e) => setLoc(e.target.value)} aria-label="Scope">
            <option value="all">All {W.entity.locationLabel.toLowerCase()}s</option>
            {W.entity.locations.map((l) => <option key={l}>{l}</option>)}
          </select>
          <Button size="sm" variant="secondary" onClick={() => { if (logExport(W.report.title)) window.print() }}><Printer className="h-4 w-4" /> Print / PDF</Button>
        </>
      } />
      <Card>
        <div className="mx-auto max-w-3xl py-4">
          <p className="eyebrow">{W.org}</p>
          <h2 className="display mt-2 text-3xl text-ink">{W.report.title}</h2>
          <p className="mt-1 text-sm text-faint">Prepared {new Date().toLocaleDateString('en-GB', { dateStyle: 'long' })} · {me}</p>

          <h3 className="mt-8 font-semibold text-ink">{W.report.sections[0]}</h3>
          {!draft ? (
            <div className="mt-3 rounded-card border border-dashed p-5 text-center hairline">
              <Button size="sm" onClick={() => setDraft(true)}><Sparkles className="h-4 w-4" /> Draft summary</Button>
              <p className="mt-2 text-xs text-faint">In production the draft is written with Amazon Bedrock from confirmed data. Here it’s assembled in your browser.</p>
            </div>
          ) : (
            <div className="mt-3 animate-fade-up">
              <p className="rounded-card border border-accent/25 bg-accent/5 p-5 leading-relaxed text-ink" contentEditable suppressContentEditableWarning>{summary}</p>
              <p className="mt-1.5 text-xs text-faint">Draft — click the text to edit before sharing.</p>
            </div>
          )}

          <h3 className="mt-8 font-semibold text-ink">{W.report.sections[1]}</h3>
          <table className="mt-3 w-full text-sm">
            <thead className="border-b text-left text-xs text-faint hairline"><tr><th className="py-2">{W.entity.categoryLabel}</th><th>Total</th><th>Flagged</th><th>Share</th></tr></thead>
            <tbody className="divide-y divide-hairline">
              {bd.map((r) => (
                <tr key={r.name}><td className="py-2 text-ink">{r.name}</td><td className="font-mono text-soft">{r.total}</td><td className="font-mono text-soft">{r.flagged}</td><td><span className="inline-block h-1.5 rounded-full bg-accent align-middle" style={{ width: `${(r.flagged / r.total) * 80}px` }} /> <span className="font-mono text-xs text-soft">{Math.round((r.flagged / r.total) * 100)}%</span></td></tr>
              ))}
            </tbody>
          </table>

          <h3 className="mt-8 font-semibold text-ink">{W.report.sections[2]}</h3>
          <ul className="mt-3 space-y-2">
            {types.slice(0, 4).map((t) => <li key={t.name} className="flex justify-between text-sm"><span className="text-soft">{t.name}</span><span className="font-mono text-ink">{t.value}</span></li>)}
          </ul>

          <h3 className="mt-8 font-semibold text-ink">{W.report.sections[3]}</h3>
          <p className="mt-2 text-sm text-soft">{pending.length} suggestions awaiting review{pending.length ? `, including ${pending.slice(0, 4).map((r) => r.id).join(', ')}` : ''}. {pool.filter((r) => W.metrics.some((m) => isFlagged(m, r.metrics[m.key]!))).length} records have at least one measure past its threshold.</p>
        </div>
      </Card>
    </>
  )
}
