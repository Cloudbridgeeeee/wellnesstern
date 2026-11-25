import { Check } from 'lucide-react'
import { business } from '../config/business'
import { Cta, Features, PageHeader, Showcase } from '../components/marketing/Sections'
import { Badge } from '../components/ui/Badge'
import { Section } from '../components/ui/Section'
import { Icon } from '../lib/icons'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function Product() {
  useDocumentMeta('Product', `${business.name} features: ${business.features.map((f) => f.title).join(', ')}.`)
  return (
    <>
      <PageHeader eyebrow="Product" title={`The *${business.name}* platform.`} intro={business.description} />
      <Section tight>
        <div className="space-y-5">
          {business.features.map((f, i) => (
            <div key={f.title} id={f.title.toLowerCase().replace(/[^a-z]+/g, '-')} className="reveal panel spot grid gap-8 p-8 md:grid-cols-[auto_1fr_1fr] md:items-start" style={{ ['--d' as string]: `${i * 60}ms` }}>
              <span className="flex h-14 w-14 items-center justify-center rounded-card bg-gradient-to-br from-accent to-accent2 text-on-accent">
                <Icon name={f.icon} className="h-6 w-6" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="display text-2xl text-ink">{f.title}</h2>
                  <Badge tone={f.status === 'In the demo' ? 'good' : f.status === 'Pilot' ? 'info' : 'muted'}>{f.status}</Badge>
                </div>
                <p className="mt-3 leading-relaxed text-soft">{f.body}</p>
              </div>
              <ul className="space-y-2.5">
                {f.bullets.map((x) => (
                  <li key={x} className="flex gap-2.5 text-sm text-ink"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="reveal mt-6 text-sm text-faint">“In the demo” features can be tried in the live workspace. “Pilot” features are delivered with pilot customers; “Roadmap” items are planned.</p>
      </Section>
      <Showcase />
      <Features full />
      <Cta />
    </>
  )
}
