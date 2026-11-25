import { business } from '../config/business'
import { AwsFlow, Cta, Mvp, PageHeader, Safeguards } from '../components/marketing/Sections'
import { Section } from '../components/ui/Section'
import { cn } from '../lib/cn'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function HowItWorks() {
  useDocumentMeta('How it works', `How ${business.name} works, step by step.`)
  return (
    <>
      <PageHeader eyebrow="How it works" title={`${business.steps.length} steps, with a *person in the loop*.`} intro={business.solution.body} />
      <Section tight>
        <div className="relative">
          <div className="absolute bottom-0 left-[1.6rem] top-0 w-px bg-gradient-to-b from-accent via-accent2 to-transparent md:left-1/2" />
          <div className="space-y-10">
            {business.steps.map((s, i) => (
              <div key={s.title} className={cn('relative grid gap-6 md:grid-cols-2', i % 2 === 1 && 'md:[&>*:first-child]:order-2')}>
                <div className={cn('reveal pl-16 md:pl-0', i % 2 ? 'reveal-right md:pl-14' : 'reveal-left md:pr-14 md:text-right')}>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Step {i + 1}</p>
                  <h2 className="display mt-2 text-3xl text-ink">{s.title}</h2>
                  <p className="mt-3 text-lg leading-relaxed text-soft">{s.body}</p>
                </div>
                <div className={cn('reveal pl-16 md:pl-0', i % 2 ? 'md:pr-14' : 'md:pl-14')} style={{ ['--d' as string]: '150ms' }}>
                  <div className="panel p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">Under the hood</p>
                    <p className="mt-2 leading-relaxed text-ink">{s.detail}</p>
                  </div>
                </div>
                <span className="absolute left-[1.6rem] top-1 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-4 border-canvas bg-accent font-mono text-xs font-bold text-on-accent md:left-1/2">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section tight>
        <div className="reveal"><AwsFlow /></div>
      </Section>
      <Mvp />
      <Safeguards />
      <Cta />
    </>
  )
}
