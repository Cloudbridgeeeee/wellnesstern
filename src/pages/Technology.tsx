import { business } from '../config/business'
import { Aws, Cta, PageHeader, Workflow } from '../components/marketing/Sections'
import { Section } from '../components/ui/Section'
import { Icon } from '../lib/icons'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function Technology() {
  useDocumentMeta('Technology & AWS', `How ${business.name} uses ${business.aws.services.map((s) => s.name).join(', ')}.`)
  const svc = business.aws.services
  return (
    <>
      <PageHeader eyebrow="Technology" title={`How ${business.name} uses *AWS*.`} intro={business.aws.intro} />
      <Section tight>
        <div className="reveal reveal-zoom panel relative overflow-hidden p-6 sm:p-10">
          <p className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-faint">Reference architecture</p>
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1.4fr_auto_1fr]">
            <div className="rounded-card border border-dashed p-5 text-center hairline">
              <Icon name="users" className="mx-auto h-7 w-7 text-accent" />
              <p className="mt-2 font-semibold text-ink">Your team</p>
              <p className="text-xs text-soft">{business.customers[0]!.title}</p>
            </div>
            <div className="hidden h-px w-12 bg-gradient-to-r from-accent to-accent2 lg:block" />
            <div className="rounded-card border-2 border-accent/30 bg-accent/5 p-5">
              <p className="mb-4 text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">AWS · your region</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {svc.map((s, i) => (
                  <div key={s.name} className="reveal rounded-ctl border bg-surface p-3 text-center hairline" style={{ ['--d' as string]: `${i * 120}ms` }}>
                    <Icon name={s.icon} className="mx-auto h-6 w-6 text-accent" />
                    <p className="mt-2 text-xs font-semibold leading-tight text-ink">{s.name.replace(/^(Amazon|AWS) /, '')}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden h-px w-12 bg-gradient-to-r from-accent2 to-accent3 lg:block" />
            <div className="rounded-card border border-dashed p-5 text-center hairline">
              <Icon name="check" className="mx-auto h-7 w-7 text-good" />
              <p className="mt-2 font-semibold text-ink">Reviewed output</p>
              <p className="text-xs text-soft">{business.workspace.report.title}</p>
            </div>
          </div>
        </div>
      </Section>
      <Aws />
      <Section eyebrow="Service by service" title="What each service *does for you*." tight>
        <div className="grid gap-5 md:grid-cols-2">
          {svc.map((s, i) => (
            <div key={s.name} className="reveal panel spot lift p-7" style={{ ['--d' as string]: `${i * 70}ms` }}>
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-ctl bg-accent/12 text-accent"><Icon name={s.icon} className="h-6 w-6" /></span>
                <div>
                  <h3 className="font-semibold text-ink">{s.name}</h3>
                  <p className="text-sm text-accent">{s.role}</p>
                </div>
              </div>
              <p className="mt-5 leading-relaxed text-soft">{s.detail}</p>
            </div>
          ))}
        </div>
      </Section>
      <Workflow />
      <Cta />
    </>
  )
}
