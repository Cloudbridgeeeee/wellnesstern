import { Check, FileUp, Loader2, UploadCloud } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { business } from '../../config/business'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/cn'
import type { WorkRecord } from '../../lib/data'
import { useWorkspace } from '../store'
import { Card, Confidence, PageTitle } from '../ui'

const W = business.workspace
const S = W.importSample

export default function Import() {
  const { importSample, allowed } = useWorkspace()
  const [stage, setStage] = useState(-1)
  const [result, setResult] = useState<WorkRecord[] | null>(null)
  const [drag, setDrag] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const run = () => {
    if (!allowed('import')) {
      importSample()
      return
    }
    setResult(null)
    setStage(0)
    const step = (i: number) => {
      if (i >= S.pipeline.length) {
        setResult(importSample())
        setStage(S.pipeline.length)
        return
      }
      setStage(i)
      timer.current = window.setTimeout(() => step(i + 1), 900)
    }
    step(0)
  }
  const busy = stage >= 0 && stage < S.pipeline.length

  return (
    <>
      <PageTitle title="Import" sub={`Bring in ${S.sourceLabel.toLowerCase()} and watch them move through the pipeline`} />
      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Card title="Upload">
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); if (!busy) run() }}
            className={cn('flex flex-col items-center justify-center rounded-card border-2 border-dashed px-6 py-14 text-center transition', drag ? 'border-accent bg-accent/8' : 'hairline')}
          >
            <UploadCloud className={cn('h-12 w-12 transition', drag ? 'scale-110 text-accent' : 'text-faint')} />
            <p className="mt-4 font-medium text-ink">Drop {S.sourceLabel.toLowerCase()} here</p>
            <p className="mt-1 text-sm text-soft">In the demo, any drop — or the button below — imports a sample file.</p>
            <Button className="mt-6" onClick={run} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />} Import sample: {S.fileName}
            </Button>
            {!allowed('import') && <p className="mt-4 text-xs text-warn">Your current role can’t import. Switch role in the sidebar.</p>}
          </div>
        </Card>
        <Card title="Pipeline">
          <ol className="space-y-3">
            {S.pipeline.map((p, i) => {
              const state = stage > i || stage === S.pipeline.length ? 'done' : stage === i ? 'run' : 'wait'
              return (
                <li key={p.service} className={cn('flex items-center gap-4 rounded-card border p-4 transition-all duration-500 hairline', state === 'run' && 'border-accent/50 bg-accent/8', state === 'done' && 'border-good/30 bg-good/5')}>
                  <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition', state === 'done' ? 'border-good bg-good text-white' : state === 'run' ? 'border-accent text-accent' : 'border-ink/15 text-faint')}>
                    {state === 'done' ? <Check className="h-4 w-4" /> : state === 'run' ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="font-mono text-xs">{i + 1}</span>}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-ink">{p.service}</p>
                    <p className="text-sm text-soft">{p.label}</p>
                  </div>
                  {state === 'run' && <span className="shimmer h-1.5 w-20 rounded-full" />}
                </li>
              )
            })}
          </ol>
          <p className="mt-4 text-xs text-faint">In production these steps run on AWS. In this demo they are simulated in your browser.</p>
        </Card>
      </div>
      {result && (
        <Card title={`${result.length} new ${W.entity.plural.toLowerCase()} added — all waiting for review`} className="mt-4" action={<Link to="/workspace/review" className="link text-sm">Go to the review queue →</Link>}>
          <ul className="divide-y divide-hairline">
            {result.map((r, i) => (
              <li key={r.id} className="flex animate-fade-up items-center justify-between gap-4 py-3 text-sm" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="font-mono text-xs text-faint">{r.id}</span>
                <span className="flex-1 truncate text-ink">{r.name} · {r.category}</span>
                <span className="hidden text-soft sm:block">{r.finding.type}</span>
                <Confidence value={r.finding.confidence} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}
