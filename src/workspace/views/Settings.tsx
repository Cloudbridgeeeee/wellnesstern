import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { business } from '../../config/business'
import { Button } from '../../components/ui/Button'
import { useWorkspace } from '../store'
import { Card, PageTitle } from '../ui'

const REGIONS = ['Africa (Cape Town) af-south-1', 'Europe (Ireland) eu-west-1', 'Europe (London) eu-west-2', 'US East (N. Virginia) us-east-1']

export default function Settings() {
  const { settings, updateSettings, reset, allowed } = useWorkspace()
  const [s, setS] = useState(settings)
  return (
    <>
      <PageTitle title="Settings" sub={allowed('manage') ? 'Changes are recorded in the audit log' : 'Your role can view settings but not change them'} />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="AI review">
          <label className="block text-sm text-soft">
            Highlight suggestions below this confidence: <span className="font-mono text-ink">{s.threshold}%</span>
            <input type="range" min={50} max={95} step={5} value={s.threshold} onChange={(e) => setS({ ...s, threshold: Number(e.target.value) })} className="mt-3 w-full accent-[var(--color-accent)]" />
          </label>
          <label className="mt-5 flex items-center gap-3 text-sm text-soft">
            <input type="checkbox" checked={s.notify} onChange={(e) => setS({ ...s, notify: e.target.checked })} className="h-4 w-4 accent-[var(--color-accent)]" />
            Email reviewers when new suggestions arrive
          </label>
          <p className="mt-5 rounded-ctl bg-raised/70 p-3 text-xs text-soft">Every suggestion always requires a person to confirm it. These settings only change what is highlighted.</p>
        </Card>
        <Card title="Data residency">
          <label className="block text-sm text-soft">
            AWS region
            <select className="input mt-1.5" value={s.region} onChange={(e) => setS({ ...s, region: e.target.value })}>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
          <p className="mt-3 text-xs text-faint">Uploads, results and backups for {business.workspace.org} stay in this region.</p>
        </Card>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={() => updateSettings(s)}>Save settings</Button>
        <Button variant="secondary" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset demo data</Button>
      </div>
    </>
  )
}
