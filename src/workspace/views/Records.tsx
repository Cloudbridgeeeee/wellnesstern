import { Download, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { business } from '../../config/business'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/cn'
import { isFlagged } from '../../lib/data'
import { fmtDate } from '../../lib/format'
import { RecordDrawer } from '../RecordDrawer'
import { useWorkspace } from '../store'
import { Confidence, Empty, PageTitle, ReviewBadge, StatusBadge } from '../ui'

const W = business.workspace
const E = W.entity

export default function Records() {
  const { records, logExport } = useWorkspace()
  const { id } = useParams()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [loc, setLoc] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 }>({ key: 'date', dir: -1 })

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase()
    const list = records.filter((r) =>
      (cat === 'all' || r.category === cat) &&
      (loc === 'all' || r.location === loc) &&
      (status === 'all' || r.status === status) &&
      (!t || [r.id, r.name, r.owner, r.finding.type].some((x) => x.toLowerCase().includes(t))),
    )
    return [...list].sort((a, b) => {
      const va = sort.key === 'date' ? a.date : sort.key === 'conf' ? a.finding.confidence : a.metrics[sort.key] ?? 0
      const vb = sort.key === 'date' ? b.date : sort.key === 'conf' ? b.finding.confidence : b.metrics[sort.key] ?? 0
      return (va < vb ? -1 : va > vb ? 1 : 0) * sort.dir
    })
  }, [records, q, cat, loc, status, sort])

  const exportCsv = () => {
    if (!logExport(`${rows.length} ${E.plural.toLowerCase()} (CSV)`)) return
    const head = ['id', 'name', E.categoryLabel, E.locationLabel, 'status', 'date', ...W.metrics.map((m) => m.label), W.findings.label, 'confidence', 'review']
    const lines = rows.map((r) => [r.id, r.name, r.category, r.location, r.status, r.date.slice(0, 10), ...W.metrics.map((m) => r.metrics[m.key]), r.finding.type, r.finding.confidence, r.finding.state].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    const blob = new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${business.slug}-${E.plural.toLowerCase()}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const th = (key: string, label: string) => (
    <th className="cursor-pointer select-none px-3 py-3 font-medium hover:text-ink" onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : -1 }))}>
      {label} {sort.key === key ? (sort.dir === 1 ? '↑' : '↓') : ''}
    </th>
  )

  return (
    <>
      <PageTitle title={E.plural} sub={`${rows.length} of ${records.length} shown`} actions={<Button size="sm" variant="secondary" onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</Button>} />
      <div className="panel mb-4 grid gap-3 p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input className="input pl-9" placeholder={`Search ${E.plural.toLowerCase()}, people, suggestions…`} value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)} aria-label={E.categoryLabel}>
          <option value="all">All {E.categoryLabel.toLowerCase()}s</option>
          {E.categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={loc} onChange={(e) => setLoc(e.target.value)} aria-label={E.locationLabel}>
          <option value="all">All {E.locationLabel.toLowerCase()}s</option>
          {E.locations.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="all">All statuses</option>
          {E.statuses.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
      {rows.length === 0 ? (
        <Empty>No {E.plural.toLowerCase()} match these filters.</Empty>
      ) : (
        <div className="panel scrollbar-thin overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b text-xs text-faint hairline">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-3 py-3 font-medium">{E.singular}</th>
                <th className="px-3 py-3 font-medium">{E.locationLabel}</th>
                {th('date', E.dateLabel)}
                {W.metrics.slice(0, 2).map((m) => <th key={m.key} className="px-0">{th(m.key, m.label)}</th>)}
                <th className="px-3 py-3 font-medium">{W.findings.label}</th>
                {th('conf', 'Confidence')}
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((r, i) => (
                <tr key={r.id} onClick={() => nav(`/workspace/records/${r.id}`)} className="animate-fade-in cursor-pointer transition hover:bg-raised/60" style={{ animationDelay: `${Math.min(i, 20) * 18}ms` }}>
                  <td className="px-4 py-3 font-mono text-xs text-faint">{r.id}</td>
                  <td className="px-3 py-3"><p className="text-ink">{r.name}</p><p className="text-xs text-faint">{r.category}</p></td>
                  <td className="px-3 py-3 text-soft">{r.location}</td>
                  <td className="px-3 py-3 text-soft">{fmtDate(r.date)}</td>
                  {W.metrics.slice(0, 2).map((m) => <td key={m.key} className={cn('px-3 py-3 font-mono text-xs', isFlagged(m, r.metrics[m.key]!) ? 'text-bad' : 'text-ink')}>{r.metrics[m.key]}{m.unit}</td>)}
                  <td className="px-3 py-3"><p className="text-ink">{r.finding.type}</p><ReviewBadge state={r.finding.state} /></td>
                  <td className="px-3 py-3"><Confidence value={r.finding.confidence} /></td>
                  <td className="px-3 py-3"><StatusBadge id={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <RecordDrawer record={records.find((r) => r.id === id) ?? null} onClose={() => nav('/workspace/records')} />
    </>
  )
}
