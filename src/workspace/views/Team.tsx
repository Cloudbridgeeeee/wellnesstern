import { Check, Minus } from 'lucide-react'
import { business } from '../../config/business'
import type { Permission } from '../../config/types'
import { Avatar } from '../../components/ui/Avatar'
import { PERMISSION_LABELS } from '../../lib/access'
import { cn } from '../../lib/cn'
import { useWorkspace } from '../store'
import { Card, PageTitle } from '../ui'

const W = business.workspace
const PERMS = Object.keys(PERMISSION_LABELS) as Permission[]

export default function Team() {
  const { role, setRole, records } = useWorkspace()
  return (
    <>
      <PageTitle title="Team & roles" sub="Switch role to see how permissions change what you can do" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {W.roles.map((r) => (
          <button key={r.id} onClick={() => setRole(r.id)} className={cn('panel lift p-5 text-left', role.id === r.id && 'border-accent ring-2 ring-accent/20')}>
            <p className="font-semibold text-ink">{r.label}</p>
            <p className="mt-1 text-sm text-soft">{r.description}</p>
            <p className="mt-4 text-xs text-accent">{role.id === r.id ? 'Current role' : 'Demo as this role →'}</p>
          </button>
        ))}
      </div>
      <Card title="Permissions" className="mt-4">
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b text-left text-xs text-faint hairline">
              <tr><th className="py-2.5">Permission</th>{W.roles.map((r) => <th key={r.id} className="text-center">{r.label}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {PERMS.map((p) => (
                <tr key={p}>
                  <td className="py-2.5 text-soft">{PERMISSION_LABELS[p]}</td>
                  {W.roles.map((r) => <td key={r.id} className="text-center">{r.can.includes(p) ? <Check className="mx-auto h-4 w-4 text-good" /> : <Minus className="mx-auto h-4 w-4 text-faint" />}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title="People" className="mt-4">
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {W.people.map((p, i) => {
            const r = W.roles[i % W.roles.length]!
            const n = records.filter((x) => x.owner === p).length
            return (
              <li key={p} className="flex items-center gap-3 rounded-ctl border p-3 hairline">
                <Avatar name={p} className="h-10 w-10 text-sm" />
                <div className="min-w-0"><p className="truncate font-medium text-ink">{p}</p><p className="text-xs text-soft">{r.label} · {n} {W.entity.plural.toLowerCase()}</p></div>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-xs text-faint">Fictional people for demonstration.</p>
      </Card>
    </>
  )
}
