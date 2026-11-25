import { ArrowLeft, BarChart3, ClipboardCheck, FileText, Inbox, LayoutDashboard, Menu, ScrollText, Settings, Upload, Users } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { business } from '../config/business'
import { Logo } from '../components/ui/Logo'
import { PageLoader } from '../components/ui/States'
import { cn } from '../lib/cn'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { WorkspaceProvider, useWorkspace } from './store'
import { Toasts } from './ui'

const Overview = lazy(() => import('./views/Overview'))
const Records = lazy(() => import('./views/Records'))
const Review = lazy(() => import('./views/Review'))
const Analytics = lazy(() => import('./views/Analytics'))
const Import = lazy(() => import('./views/Import'))
const Reports = lazy(() => import('./views/Reports'))
const Team = lazy(() => import('./views/Team'))
const Audit = lazy(() => import('./views/Audit'))
const SettingsView = lazy(() => import('./views/Settings'))

const W = business.workspace

function Shell() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const { records, role, setRole, me } = useWorkspace()
  const pending = records.filter((r) => r.finding.state === 'pending').length
  useDocumentMeta(W.title)
  useEffect(() => setOpen(false), [pathname])

  const nav = [
    { to: '/workspace', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/workspace/records', label: W.entity.plural, icon: Inbox },
    { to: '/workspace/review', label: 'Review queue', icon: ClipboardCheck, badge: pending },
    { to: '/workspace/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/workspace/import', label: 'Import', icon: Upload },
    { to: '/workspace/reports', label: 'Reports', icon: FileText },
    { to: '/workspace/team', label: 'Team & roles', icon: Users },
    { to: '/workspace/audit', label: 'Audit log', icon: ScrollText },
    { to: '/workspace/settings', label: 'Settings', icon: Settings },
  ]

  const side = (
    <div className="flex h-full flex-col">
      <Link to="/" className="group flex items-center gap-2 px-5 py-5">
        <Logo />
      </Link>
      <div className="mx-4 mb-4 rounded-ctl border bg-raised/60 px-3 py-2.5 hairline">
        <p className="truncate text-xs font-medium text-ink">{W.org}</p>
        <p className="truncate text-[0.68rem] text-faint">{W.orgPlace}</p>
      </div>
      <nav className="flex-1 space-y-0.5 px-3" aria-label="Workspace">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cn('flex items-center gap-3 rounded-ctl px-3 py-2 text-sm transition', isActive ? 'bg-accent text-on-accent' : 'text-soft hover:bg-raised hover:text-ink')}>
            <n.icon className="h-4 w-4" />
            <span className="flex-1">{n.label}</span>
            {!!n.badge && <span className="rounded-full bg-warn/20 px-1.5 text-[0.65rem] font-semibold text-warn">{n.badge}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-4 hairline">
        <label className="block text-[0.68rem] uppercase tracking-wider text-faint">
          Demo as
          <select value={role.id} onChange={(e) => setRole(e.target.value)} className="input mt-1.5 py-1.5 text-xs normal-case tracking-normal">
            {W.roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </label>
        <p className="mt-2 truncate text-xs text-soft">Signed in as {me}</p>
        <Link to="/" className="mt-3 flex items-center gap-1.5 text-xs text-faint hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" /> Back to website</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-surface/60 backdrop-blur-xl hairline lg:block">{side}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 animate-slide-in-right border-r bg-surface hairline">{side}</aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b bg-canvas/80 px-5 py-3 backdrop-blur-xl hairline sm:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-ctl p-1.5 text-ink lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
            <span className="text-sm font-medium text-ink">{W.title}</span>
            <span className="hidden rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[0.68rem] font-medium text-accent sm:inline">Demo data</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-soft">
            <span className="hidden sm:inline">Role: <span className="text-ink">{role.label}</span></span>
            <Link to="/contact?type=demo" className="rounded-ctl bg-accent px-3 py-1.5 font-medium text-on-accent">Book a demo</Link>
          </div>
        </header>
        <main className="px-5 py-8 sm:px-8">
          <Suspense fallback={<PageLoader />}>
            <div key={pathname} className="animate-fade-in">
              <Routes>
                <Route index element={<Overview />} />
                <Route path="records" element={<Records />} />
                <Route path="records/:id" element={<Records />} />
                <Route path="review" element={<Review />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="import" element={<Import />} />
                <Route path="reports" element={<Reports />} />
                <Route path="team" element={<Team />} />
                <Route path="audit" element={<Audit />} />
                <Route path="settings" element={<SettingsView />} />
                <Route path="*" element={<div className="py-20 text-center text-soft">Not found. <Link className="link" to="/workspace">Back to overview</Link></div>} />
              </Routes>
            </div>
          </Suspense>
        </main>
      </div>
      <Toasts />
    </div>
  )
}

export default function WorkspaceApp() {
  return (
    <WorkspaceProvider>
      <Shell />
    </WorkspaceProvider>
  )
}

