import { Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { business } from '../../config/business'
import { Container } from '../ui/Section'
import { Logo } from '../ui/Logo'

const cols = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', to: '/product' },
      { label: 'How it works', to: '/how-it-works' },
      { label: 'Live workspace demo', to: '/workspace' },
      { label: 'Pricing', to: '/pricing' },
    ],
  },
  {
    heading: 'Who it’s for',
    links: business.customers.map((c) => ({ label: c.title, to: `/use-cases#${c.id}` })),
  },
  {
    heading: 'Company',
    links: [
      { label: 'About & team', to: '/about' },
      { label: 'Technology & AWS', to: '/technology' },
      { label: 'Security', to: '/security' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy notice', to: '/privacy' },
      { label: 'Terms of use', to: '/terms' },
    ],
  },
]

export function Footer() {
  const [f, c] = business.founders
  return (
    <footer className="relative mt-10 border-t hairline">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link to="/" className="group inline-block">
              <Logo />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-soft">{business.description}</p>
            <div className="mt-6 space-y-2 text-sm text-soft">
              <a href={`mailto:${business.email}`} className="flex items-center gap-2 hover:text-ink">
                <Mail className="h-4 w-4 text-accent" /> {business.email}
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" /> {f!.location}, Nigeria
              </p>
            </div>
            <p className="mt-6 text-xs text-faint">
              Founded by {f!.name} and {c!.name}.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((col) => (
              <div key={col.heading}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-faint">{col.heading}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-sm text-soft transition hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {business.sectorNote && <p className="mt-12 max-w-3xl text-xs leading-relaxed text-faint">{business.sectorNote}</p>}
        <div className="mt-12 flex flex-col justify-between gap-4 border-t pt-8 text-xs text-faint hairline sm:flex-row">
          <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          <p>{business.industries.join(' · ')} · Built on AWS</p>
        </div>
      </Container>
    </footer>
  )
}
