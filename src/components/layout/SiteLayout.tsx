import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useReveal } from '../../lib/motion'
import { PageLoader } from '../ui/States'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    let tries = 0
    let t = 0
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) el.scrollIntoView()
      else if (tries++ < 40) t = window.setTimeout(find, 50)
    }
    find()
    return () => window.clearTimeout(t)
  }, [pathname, hash])
  return null
}

export function SiteLayout() {
  const { pathname } = useLocation()
  useReveal(pathname)
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-ctl focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent">
        Skip to content
      </a>
      <ScrollManager />
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <div key={pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
