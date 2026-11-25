import { business } from '../config/business'
import { PageHeader } from '../components/marketing/Sections'
import { Section } from '../components/ui/Section'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const PRIVACY = [
  ['Who we are', `${business.name} (“we”) provides ${business.description.charAt(0).toLowerCase() + business.description.slice(1)} Contact: ${business.email}.`],
  ['What we collect', 'Contact details you send through our forms, and the data you or your organisation upload into the product during a pilot or subscription.'],
  ['How we use it', 'To reply to you, to provide the service your organisation has asked for, and to keep it secure. We do not sell personal data and we do not use customer data to train shared models.'],
  ['Where it is stored', 'Customer data is stored on Amazon Web Services in the region agreed with your organisation, encrypted in transit and at rest.'],
  ['How long we keep it', 'Enquiries for up to 24 months. Customer data for the length of the agreement plus any retention period your organisation sets, then it is deleted.'],
  ['Your rights', 'You can ask to access, correct or delete your personal data, or object to its use, by emailing us. You may also complain to the Nigeria Data Protection Commission or your local regulator.'],
  ['This demo', 'The interactive workspace on this site uses fictional data stored only in your browser. You can reset it at any time from its settings.'],
]

const TERMS = [
  ['Using this site', 'This website describes our product and offers an interactive demonstration. Content is provided for information and may change.'],
  ['Demo data', 'The workspace demo uses fictional organisations, people and records. It is not connected to any real system.'],
  ['AI output', `${business.name} produces suggestions to support qualified people. Decisions remain the responsibility of the customer and its staff.`],
  ['Pricing', 'Prices shown are illustrative. Your agreement sets the final price and terms.'],
  ['Intellectual property', `The ${business.name} name, logo and software belong to us. Customer data belongs to the customer.`],
  ['Contact', `Questions about these terms: ${business.email}.`],
]

export default function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const isP = kind === 'privacy'
  useDocumentMeta(isP ? 'Privacy notice' : 'Terms of use')
  const rows = isP ? PRIVACY : TERMS
  return (
    <>
      <PageHeader eyebrow="Legal" title={isP ? 'Privacy notice' : 'Terms of use'} intro={`Draft — last updated ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}.`} />
      <Section tight>
        <div className="mx-auto max-w-3xl space-y-8">
          {rows.map(([h, p], i) => (
            <div key={h} className="reveal" style={{ ['--d' as string]: `${i * 40}ms` }}>
              <h2 className="display text-2xl text-ink">{h}</h2>
              <p className="mt-2 leading-relaxed text-soft">{p}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
