import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { PageLoader } from './components/ui/States'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// The home page ships in the main bundle; every other page and the workspace load on demand.
const Product = lazy(() => import('./pages/Product'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const UseCases = lazy(() => import('./pages/UseCases'))
const Technology = lazy(() => import('./pages/Technology'))
const Security = lazy(() => import('./pages/Security'))
const Pricing = lazy(() => import('./pages/Pricing'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Legal = lazy(() => import('./pages/Legal'))
const WorkspaceApp = lazy(() => import('./workspace/WorkspaceApp'))

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="product" element={<Product />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="use-cases" element={<UseCases />} />
        <Route path="technology" element={<Technology />} />
        <Route path="security" element={<Security />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="about" element={<About />} />
        <Route path="team" element={<Navigate to="/about#team" replace />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Legal kind="privacy" />} />
        <Route path="terms" element={<Legal kind="terms" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route
        path="workspace/*"
        element={
          <Suspense fallback={<PageLoader label="Opening the workspace" />}>
            <WorkspaceApp />
          </Suspense>
        }
      />
    </Routes>
  )
}
