import { ArrowRight, Check } from 'lucide-react'
import { business } from '../config/business'
import { Cta, PageHeader } from '../components/marketing/Sections'
import { ButtonLink } from '../components/ui/Button'
import { Section } from '../components/ui/Section'
import { Icon } from '../lib/icons'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function UseCases() {
  useDocumentMeta('Use cases', `${business.name} for ${business.customers.map((c) => c.title.toLowerCase()).join(', ')}.`)
  return (
    <>
      <PageHeader eyebrow="Use cases" title={`Built for *${business.customers.map((c) => c.title.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' and $1')}*.`} intro={business.problem.intro} />
      <Section tight>
        <div className="space-y-6">
          {business.customers.map((c, i) => (
            <article key={c.id} id={c.id} className="reveal panel scroll-mt-28 overflow-hidden" style={{ ['--d' as string]: `${i * 80}ms` }}>
              <div className="grid lg:grid-cols-[1fr_1.4fr]">
                <div className="relative overflow-hidden bg-gradient-to-br from-accent/15 via-accent2/8 to-transparent p-8 sm:p-10">
                  <span className="flex h-14 w-14 items-center justify-center rounded-card bg-accent text-on-accent"><Icon name={c.icon} className="h-7 w-7" /></span>
                  <h2 className="display mt-8 text-3xl text-ink">{c.title}</h2>
                  <p className="mt-4 text-soft">{c.pain}</p>
                </div>
                <div className="p-8 sm:p-10">
                  <p className="eyebrow">Outcome</p>
                  <p className="display mt-3 text-2xl text-ink">{c.outcome}</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {c.bullets.map((x) => (
                      <li key={x} className="flex gap-2.5 rounded-ctl bg-raised/60 px-4 py-3 text-sm text-ink"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{x}</li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink to={`/contact?type=demo&team=${encodeURIComponent(c.title)}`} arrow>Talk to us</ButtonLink>
                    <ButtonLink to="/workspace" variant="secondary">Try the demo <ArrowRight className="h-4 w-4" /></ButtonLink>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Cta />
    </>
  )
}
