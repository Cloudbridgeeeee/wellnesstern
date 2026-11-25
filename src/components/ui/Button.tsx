import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

const base = 'group inline-flex items-center justify-center gap-2 rounded-btn text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50'
const sizes = { md: 'px-5 py-2.5', lg: 'px-6 py-3.5 text-[0.95rem]', sm: 'px-3 py-1.5 text-xs' }
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent shadow-[0_10px_30px_-12px_var(--color-accent)] hover:brightness-110 hover:shadow-[0_16px_40px_-14px_var(--color-accent)] hover:-translate-y-0.5',
  secondary: 'border border-ink/15 bg-surface/70 text-ink backdrop-blur hover:border-accent/60 hover:-translate-y-0.5',
  ghost: 'text-soft hover:text-ink',
}

interface Props {
  children: ReactNode
  variant?: Variant
  size?: keyof typeof sizes
  className?: string
  arrow?: boolean
}

export function ButtonLink({ to, children, variant = 'primary', size = 'md', className, arrow }: Props & { to: string }) {
  const ext = to.startsWith('mailto:') || to.startsWith('http')
  const cls = cn(base, sizes[size], variants[variant], className)
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </>
  )
  return ext ? <a href={to} className={cls}>{inner}</a> : <Link to={to} className={cls}>{inner}</Link>
}

export function Button({ children, variant = 'primary', size = 'md', className, arrow, ...rest }: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </button>
  )
}
