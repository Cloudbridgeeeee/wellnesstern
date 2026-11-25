import { CheckCircle2, Mail, MapPin, Send } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { business } from '../config/business'
import { PageHeader } from '../components/marketing/Sections'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Section } from '../components/ui/Section'
import { cn } from '../lib/cn'
import { submitLead, type Lead } from '../lib/lead'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function Contact() {
  const [params] = useSearchParams()
  const initial = (params.get('type') as Lead['kind']) || 'demo'
  const plan = params.get('plan')
  const team = params.get('team')
  useDocumentMeta('Contact', `Contact ${business.name} or book a demo.`)
  const [form, setForm] = useState<Lead>({
    kind: ['demo', 'contact', 'pilot'].includes(initial) ? initial : 'demo',
    name: '',
    email: '',
    company: '',
    role: team ?? '',
    size: '',
    message: plan ? `I'm interested in the ${plan} plan.` : '',
  })
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const set = (k: keyof Lead) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const r = submitLead(form)
    if (!r.ok) {
      setError(r.error ?? 'Please check the form.')
      return
    }
    setError(null)
    setDone(r.mailto)
  }

  const [f, c] = business.founders
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let’s talk about *your* team." intro="Book a demo, ask about a pilot, or send us a question. We reply within two working days." />
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="reveal panel p-7 sm:p-9">
            {done ? (
              <div className="animate-scale-in py-10 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-good" />
                <h2 className="display mt-5 text-3xl text-ink">Thank you, {form.name.split(' ')[0]}.</h2>
                <p className="mx-auto mt-3 max-w-md text-soft">Your request is saved on this device. To make sure it reaches us right away, send it as an email too.</p>
                <a href={done} className="mt-7 inline-flex items-center gap-2 rounded-ctl bg-accent px-5 py-3 text-sm font-medium text-on-accent"><Mail className="h-4 w-4" /> Send by email</a>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {([['demo', 'Book a demo'], ['pilot', 'Start a pilot'], ['contact', 'General question']] as const).map(([k, l]) => (
                    <button type="button" key={k} onClick={() => setForm({ ...form, kind: k })} className={cn('rounded-ctl border px-4 py-2 text-sm transition', form.kind === k ? 'border-accent bg-accent text-on-accent' : 'text-soft hairline hover:text-ink')}>{l}</button>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm"><span className="mb-1.5 block text-soft">Full name</span><input className="input" value={form.name} onChange={set('name')} autoComplete="name" /></label>
                  <label className="block text-sm"><span className="mb-1.5 block text-soft">Work email</span><input className="input" type="email" value={form.email} onChange={set('email')} autoComplete="email" /></label>
                  <label className="block text-sm"><span className="mb-1.5 block text-soft">Organisation</span><input className="input" value={form.company} onChange={set('company')} autoComplete="organization" /></label>
                  <label className="block text-sm"><span className="mb-1.5 block text-soft">Your role</span><input className="input" value={form.role} onChange={set('role')} /></label>
                </div>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-soft">Organisation type</span>
                  <select className="input" value={form.size} onChange={set('size')}>
                    <option value="">Select…</option>
                    {business.customers.map((x) => <option key={x.id}>{x.title}</option>)}
                    <option>Other</option>
                  </select>
                </label>
                <label className="block text-sm"><span className="mb-1.5 block text-soft">How can we help?</span><textarea className="input min-h-32" value={form.message} onChange={set('message')} /></label>
                {error && <p className="animate-fade-in rounded-ctl bg-bad/10 px-4 py-2.5 text-sm text-bad" role="alert">{error}</p>}
                <Button type="submit" size="lg" className="w-full sm:w-auto"><Send className="h-4 w-4" /> Send request</Button>
                <p className="text-xs text-faint">We use your details only to reply to you. See our <a href="/privacy" className="link">privacy notice</a>.</p>
              </form>
            )}
          </div>
          <div className="space-y-5">
            <div className="reveal reveal-right panel p-7">
              <p className="eyebrow mb-4">Talk to the founders</p>
              {[f!, c!].map((p) => (
                <div key={p.name} className="flex items-center gap-4 border-b py-3 last:border-0 hairline">
                  <Avatar name={p.name} className="h-11 w-11 text-sm" />
                  <div><p className="font-medium text-ink">{p.name}</p><p className="text-sm text-soft">{p.role}</p></div>
                </div>
              ))}
            </div>
            <div className="reveal reveal-right panel space-y-3 p-7 text-sm" style={{ ['--d' as string]: '120ms' }}>
              <a href={`mailto:${business.email}`} className="flex items-center gap-3 text-ink hover:text-accent"><Mail className="h-4 w-4 text-accent" /> {business.email}</a>
              <p className="flex items-center gap-3 text-ink"><MapPin className="h-4 w-4 text-accent" /> {f!.location}, Nigeria · working with teams worldwide</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
