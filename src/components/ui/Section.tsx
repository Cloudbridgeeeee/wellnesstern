import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Headline } from './Headline'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8', className)}>{children}</div>
}

interface SectionProps {
  id?: string
  eyebrow?: string
  title?: string
  intro?: ReactNode
  children?: ReactNode
  className?: string
  align?: 'left' | 'center'
  tight?: boolean
}

export function Section({ id, eyebrow, title, intro, children, className, align = 'left', tight }: SectionProps) {
  return (
    <section id={id} className={cn('relative scroll-mt-24', tight ? 'py-14 sm:py-16' : 'py-20 sm:py-28', className)}>
      <Container>
        {(eyebrow || title) && (
          <div className={cn('reveal mb-12 max-w-3xl', align === 'center' && 'mx-auto text-center')}>
            {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
            {title && (
              <h2 className="display text-3xl text-ink sm:text-[2.6rem]">
                <Headline text={title} />
              </h2>
            )}
            {intro && <div className="mt-5 text-lg leading-relaxed text-soft">{intro}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}
