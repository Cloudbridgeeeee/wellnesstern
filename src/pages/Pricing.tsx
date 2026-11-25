import { business } from '../config/business'
import { Cta, Faq, PageHeader, PricingTable } from '../components/marketing/Sections'
import { Section } from '../components/ui/Section'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function Pricing() {
  useDocumentMeta('Pricing', `${business.name} pricing — ${business.pricing.model}.`)
  return (
    <>
      <PageHeader eyebrow="Pricing" title={`*${business.pricing.model}*, clearly priced.`} intro={business.pricing.note} />
      <Section tight>
        <PricingTable />
      </Section>
      <Faq />
      <Cta />
    </>
  )
}
