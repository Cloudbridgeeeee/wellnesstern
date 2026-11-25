import { useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { fmtDateTime } from '../../lib/format'
import { useWorkspace } from '../store'
import { Empty, PageTitle } from '../ui'

export default function Audit() {
  const { audit } = useWorkspace()
  const [only, setOnly] = useState(false)
  const rows = only ? audit.filter((a) => !a.allowed) : audit
  return (
    <>
      <PageTitle title="Audit log" sub="Every change and every blocked attempt, with who did it and when" actions={
        <label className="flex items-center gap-2 text-sm text-soft"><input type="checkbox" checked={only} onChange={(e) => setOnly(e.target.checked)} className="accent-[var(--color-accent)]" /> Blocked only</label>
      } />
      {rows.length === 0 ? <Empty>No events yet.</Empty> : (
        <div className="panel scrollbar-thin overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b text-xs text-faint hairline"><tr><th className="px-4 py-3 font-medium">When</th><th className="px-3 font-medium">Who</th><th className="px-3 font-medium">Role</th><th className="px-3 font-medium">Action</th><th className="px-3 font-medium">Record</th><th className="px-3 font-medium">Result</th></tr></thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((a) => (
                <tr key={a.id} className="animate-fade-in">
                  <td className="px-4 py-3 text-soft">{fmtDateTime(a.at)}</td>
                  <td className="px-3 text-ink">{a.actor}</td>
                  <td className="px-3 text-soft">{a.role}</td>
                  <td className="px-3 text-ink">{a.action}</td>
                  <td className="px-3 font-mono text-xs text-faint">{a.target ?? '—'}</td>
                  <td className="px-3">{a.allowed ? <Badge tone="good">Allowed</Badge> : <Badge tone="bad">Blocked</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
