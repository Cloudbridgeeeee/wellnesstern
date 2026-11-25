import { business } from '../config/business'
import type { HomeSection } from '../config/types'
import { Hero } from '../components/marketing/Hero'
import { Aws, Cta, Customers, Faq, Features, Marquee, Mvp, Pricing, Problem, Roadmap, Safeguards, Showcase, Solution, Stats, Team, Workflow } from '../components/marketing/Sections'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const SECTIONS: Record<HomeSection, () => React.ReactNode> = {
  problem: Problem,
  solution: Solution,
  features: () => <Features />,
  workflow: Workflow,
  visual: Showcase,
  aws: () => <Aws compact />,
  safeguards: Safeguards,
  customers: Customers,
  mvp: Mvp,
  pricing: Pricing,
  roadmap: Roadmap,
  team: () => <Team />,
  faq: Faq,
}

export default function Home() {
  useDocumentMeta('', business.description)
  return (
    <>
      <Hero />
      <Marquee />
      <div className="pt-12">
        <Stats />
      </div>
      {business.theme.order.map((k) => {
        const S = SECTIONS[k]
        return <S key={k} />
      })}
      <Cta />
    </>
  )
}
