import { Check, Play } from 'lucide-react'
import { business } from '../../config/business'
import { cn } from '../../lib/cn'
import { useTicker } from '../../lib/motion'
import { ButtonLink } from '../ui/Button'
import { Headline } from '../ui/Headline'
import { Container } from '../ui/Section'
import { HeroVisual } from '../visuals/HeroVisual'
import { Motif } from './Motif'

const h = business.hero

function Eyebrow({ center }: { center?: boolean }) {
  const i = useTicker(business.industries.length, 2600)
  return (
    <div className={cn('animate-fade-up mb-7 inline-flex items-center gap-2 rounded-full border bg-surface/60 py-1 pl-1 pr-4 text-xs backdrop-blur hairline', center && 'mx-auto')}>
      <span className="rounded-full bg-accent px-2.5 py-1 font-medium text-on-accent">{h.eyebrow}</span>
      <span key={i} className="animate-fade-in text-soft">{business.industries[i]}</span>
    </div>
  )
}

function Ctas({ center }: { center?: boolean }) {
  return (
    <div className={cn('animate-fade-up mt-9 flex flex-wrap gap-3 [animation-delay:240ms]', center && 'justify-center')}>
      <ButtonLink to="/contact?type=demo" size="lg" arrow>
        {h.primary}
      </ButtonLink>
      <ButtonLink to="/workspace" size="lg" variant="secondary">
        <Play className="h-4 w-4 text-accent" /> {h.secondary}
      </ButtonLink>
    </div>
  )
}

function Chips({ center }: { center?: boolean }) {
  return (
    <ul className={cn('animate-fade-up mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-soft [animation-delay:360ms]', center && 'justify-center')}>
      {h.chips.map((c) => (
        <li key={c} className="flex items-center gap-2">
          <Check className="h-4 w-4 text-accent" /> {c}
        </li>
      ))}
    </ul>
  )
}

export function Hero() {
  const v = business.theme.hero
  const title = (
    <h1 className={cn('display animate-fade-up text-ink [animation-delay:80ms]', v === 'editorial' ? 'text-5xl sm:text-7xl lg:text-[5.6rem]' : 'text-[2.6rem] sm:text-6xl lg:text-[4.1rem]')}>
      <Headline text={h.headline} />
    </h1>
  )
  const sub = <p className={cn('animate-fade-up mt-6 text-lg leading-relaxed text-soft [animation-delay:160ms]', v === 'centered' ? 'mx-auto max-w-2xl' : 'max-w-xl')}>{h.sub}</p>

  return (
    <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
      <div className="glow absolute inset-0 -z-10" />
      <Motif className="-z-10" strong />
      <div className="absolute left-[8%] top-40 -z-10 h-72 w-72 animate-float-slow rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-[6%] top-72 -z-10 h-80 w-80 animate-float rounded-full bg-accent2/10 blur-3xl [animation-delay:2s]" />
      <Container>
        {v === 'split' && (
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <Eyebrow />
              {title}
              {sub}
              <Ctas />
              <Chips />
            </div>
            <HeroVisual className="animate-scale-in [animation-delay:300ms]" />
          </div>
        )}
        {v === 'centered' && (
          <div className="text-center">
            <Eyebrow center />
            <div className="mx-auto max-w-4xl">{title}</div>
            {sub}
            <Ctas center />
            <Chips center />
            <div className="mx-auto mt-16 max-w-3xl">
              <HeroVisual className="animate-scale-in [animation-delay:300ms]" />
            </div>
          </div>
        )}
        {v === 'editorial' && (
          <div>
            <Eyebrow />
            <div className="max-w-5xl">{title}</div>
            <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1fr_1.15fr]">
              <div>
                {sub}
                <Ctas />
                <Chips />
              </div>
              <HeroVisual className="animate-scale-in [animation-delay:300ms]" />
            </div>
          </div>
        )}
        {v === 'bento' && (
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="panel spot relative flex flex-col justify-center p-8 sm:p-12 lg:col-span-7 lg:row-span-2">
              <Eyebrow />
              {title}
              {sub}
              <Ctas />
            </div>
            <HeroVisual className="animate-scale-in lg:col-span-5 [animation-delay:250ms]" />
            <div className="panel animate-fade-up p-6 lg:col-span-5 [animation-delay:400ms]">
              <p className="eyebrow mb-3">Built for</p>
              <div className="flex flex-wrap gap-2">
                {business.customers.map((c) => (
                  <span key={c.id} className="chip">{c.title}</span>
                ))}
              </div>
              <Chips />
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
