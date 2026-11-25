import { Check } from 'lucide-react'
import { business } from '../config/business'
import { Cta, PageHeader, Safeguards } from '../components/marketing/Sections'
import { Section } from '../components/ui/Section'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const PRACTICES = [
  { title: 'Encryption', items: ['TLS 1.2+ for every connection', 'Encryption at rest with AWS-managed keys', 'Per-customer data separation'] },
  { title: 'Access', items: ['Role-based permissions in the workspace', 'Every change written to an audit log', 'Least-privilege IAM for every AWS service'] },
  { title: 'AI use', items: ['AI output is a suggestion until a person confirms it', 'Customer data is not used to train shared models', 'Confidence and evidence shown with every suggestion'] },
  { title: 'Data lifecycle', items: ['Data stays in the AWS region agreed with you', 'Export and deletion on request', 'Retention rules configured per customer'] },
]

export default function Security() {
  useDocumentMeta('Security', `How ${business.name} protects your data and keeps people in control of AI decisions.`)
  return (
    <>
      <PageHeader eyebrow="Security & safeguards" title="Your data, *protected*. Your people, *in control*." intro={`${business.name} is designed so that sensitive data is encrypted and separated, and every AI suggestion is reviewed by a person before it is used.`} />
      <Section tight>
        <div className="grid gap-5 md:grid-cols-2">
          {PRACTICES.map((p, i) => (
            <div key={p.title} className="reveal panel p-7" style={{ ['--d' as string]: `${i * 80}ms` }}>
              <h2 className="display text-2xl text-ink">{p.title}</h2>
              <ul className="mt-5 space-y-3">
                {p.items.map((x) => <li key={x} className="flex gap-2.5 text-soft"><Check className="mt-1 h-4 w-4 shrink-0 text-good" />{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="reveal mt-6 text-sm text-faint">This page describes the security design for pilots. Independent certification is on our roadmap; ask us for our current security questionnaire.</p>
      </Section>
      <Safeguards />
      <Cta />
    </>
  )
}
