import { business } from '../config/business'
import { Cta, PageHeader, Roadmap, Team } from '../components/marketing/Sections'
import { Section } from '../components/ui/Section'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function About() {
  const s = business.story
  const [f, c] = business.founders
  useDocumentMeta('About', `${business.name} was founded by ${f!.name} and ${c!.name}.`)
  return (
    <>
      <PageHeader eyebrow="About us" title={s.heading} intro={`Founded by ${f!.name} (${f!.role}) and ${c!.name} (${c!.role}).`} />
      <Section tight>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            {s.paragraphs.map((p, i) => (
              <p key={i} className="reveal text-xl leading-relaxed text-ink" style={{ ['--d' as string]: `${i * 100}ms` }}>{p}</p>
            ))}
          </div>
          <div className="space-y-4">
            {s.principles.map((p, i) => (
              <div key={p.title} className="reveal reveal-right panel p-6" style={{ ['--d' as string]: `${i * 100}ms` }}>
                <p className="font-mono text-xs text-accent">0{i + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-soft">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section id="team" eyebrow="Founders & team" title="The people *behind* the product.">
        <Team heading={false} />
      </Section>
      <Roadmap />
      <Cta />
    </>
  )
}
