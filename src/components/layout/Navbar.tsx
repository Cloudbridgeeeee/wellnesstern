import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { business } from '../../config/business'
import { cn } from '../../lib/cn'
import { useScrollProgress } from '../../lib/motion'
import { ButtonLink } from '../ui/Button'
import { Logo } from '../ui/Logo'

export const NAV = [
  { label: 'Product', to: '/product' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Use cases', to: '/use-cases' },
  { label: 'AWS', to: '/technology' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Team', to: '/about' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progress = useScrollProgress()
  const { pathname } = useLocation()
  const style = business.theme.nav

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const links = (
    <>
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          className={({ isActive }) =>
            cn('relative rounded-ctl px-3 py-2 text-sm transition-colors', isActive ? 'text-ink' : 'text-soft hover:text-ink')
          }
        >
          {({ isActive }) => (
            <>
              {n.label}
              <span className={cn('absolute inset-x-3 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300', isActive ? 'scale-x-100' : 'scale-x-0')} />
            </>
          )}
        </NavLink>
      ))}
    </>
  )

  const shell =
    style === 'pill'
      ? cn('mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 rounded-full border px-3 py-2 pl-5 transition-all duration-500 hairline', scrolled ? 'bg-surface/85 shadow-[0_20px_50px_-25px_rgb(0_0_0/0.4)] backdrop-blur-xl' : 'bg-surface/50 backdrop-blur-md')
      : style === 'bar'
        ? cn('mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8')
        : cn('mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8')

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 px-3 transition-all duration-500',
        style === 'bar' && cn('border-b px-0', scrolled ? 'hairline bg-canvas/85 backdrop-blur-xl' : 'border-transparent'),
        style === 'minimal' && cn('px-0', scrolled && 'bg-canvas/80 backdrop-blur-xl'),
      )}
    >
      <div className={shell}>
        <Link to="/" className="group" aria-label={`${business.name} home`}>
          <Logo />
        </Link>
        <nav className={cn('hidden items-center lg:flex', style === 'minimal' && 'gap-2')} aria-label="Main">
          {links}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink to="/workspace" variant="ghost" size="sm" className="text-sm">
            Live demo
          </ButtonLink>
          <ButtonLink to="/contact?type=demo" size="sm" className={cn('px-4 py-2 text-sm', style === 'pill' && 'rounded-full')} arrow>
            Book a demo
          </ButtonLink>
        </div>
        <button className="rounded-ctl p-2 text-ink lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-accent via-accent2 to-accent3" style={{ transform: `scaleX(${progress})`, opacity: scrolled ? 1 : 0 }} />
      {open && (
        <div className="mx-3 mt-2 animate-scale-in rounded-card border bg-surface p-4 shadow-2xl hairline lg:hidden">
          <nav className="grid gap-1" aria-label="Mobile">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="rounded-ctl px-3 py-2.5 text-soft hover:bg-raised hover:text-ink">
                {n.label}
              </Link>
            ))}
            <Link to="/security" className="rounded-ctl px-3 py-2.5 text-soft hover:bg-raised hover:text-ink">Security</Link>
          </nav>
          <div className="mt-3 grid gap-2">
            <ButtonLink to="/workspace" variant="secondary">Open the live demo</ButtonLink>
            <ButtonLink to="/contact?type=demo" arrow>Book a demo</ButtonLink>
          </div>
        </div>
      )}
    </header>
  )
}
