import { Bot, Send, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { business } from '../config/business'
import { answer, type Answer } from '../lib/assistant'
import { cn } from '../lib/cn'
import { useWorkspace } from './store'
import { Card } from './ui'

const W = business.workspace

export function AssistantPanel({ onOpen }: { onOpen: (id: string) => void }) {
  const { records } = useWorkspace()
  const [q, setQ] = useState('')
  const [thread, setThread] = useState<{ q: string; a: Answer }[]>([])
  const [thinking, setThinking] = useState(false)
  const ask = (text: string) => {
    if (!text.trim()) return
    setThinking(true)
    setQ('')
    window.setTimeout(() => {
      setThread((t) => [...t, { q: text, a: answer(text, records, W) }].slice(-4))
      setThinking(false)
    }, 550)
  }
  return (
    <Card title={<span className="flex items-center gap-2"><Bot className="h-4 w-4 text-accent" /> {W.assistant.name}</span>} action={<span className="text-[0.68rem] text-faint">Answers from workspace records only</span>}>
      <div className="scrollbar-thin max-h-80 space-y-4 overflow-y-auto">
        {thread.length === 0 && <p className="text-sm text-soft">Ask a question about the {W.entity.plural.toLowerCase()} in this workspace. Every answer cites the records it used.</p>}
        {thread.map((t, i) => (
          <div key={i} className="animate-fade-up space-y-2">
            <p className="ml-auto w-fit max-w-[85%] rounded-card rounded-br-sm bg-accent px-3.5 py-2 text-sm text-on-accent">{t.q}</p>
            <div className={cn('max-w-[92%] rounded-card rounded-bl-sm border px-3.5 py-2.5 text-sm hairline', t.a.refused ? 'border-warn/30 bg-warn/5' : 'bg-raised/60')}>
              {t.a.refused && <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-warn"><ShieldAlert className="h-3.5 w-3.5" /> Needs a qualified person</p>}
              <p className="leading-relaxed text-ink">{t.a.text}</p>
              {t.a.cites.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.a.cites.map((c) => <button key={c} onClick={() => onOpen(c)} className="rounded border border-accent/30 px-1.5 py-0.5 font-mono text-[0.65rem] text-accent hover:bg-accent/10">{c}</button>)}
                </div>
              )}
            </div>
          </div>
        ))}
        {thinking && <div className="flex gap-1 px-1">{[0, 1, 2].map((d) => <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-accent/60" style={{ animationDelay: `${d * 120}ms` }} />)}</div>}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {W.assistant.suggestions.map((s) => <button key={s} onClick={() => ask(s)} className="chip text-soft transition hover:border-accent/40 hover:text-ink">{s}</button>)}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(q) }}>
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Ask about ${W.entity.plural.toLowerCase()}…`} aria-label="Question" />
        <button className="rounded-ctl bg-accent px-3 text-on-accent" aria-label="Ask"><Send className="h-4 w-4" /></button>
      </form>
    </Card>
  )
}
