import { ButtonLink } from '../components/ui/Button'
import { Motif } from '../components/marketing/Motif'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function NotFound() {
  useDocumentMeta('Page not found')
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 text-center">
      <Motif strong />
      <div className="relative">
        <p className="display text-[8rem] leading-none text-gradient">404</p>
        <h1 className="display mt-4 text-3xl text-ink">This page doesn’t exist.</h1>
        <p className="mt-3 text-soft">It may have moved, or the link may be wrong.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink to="/" arrow>Back home</ButtonLink>
          <ButtonLink to="/workspace" variant="secondary">Open the demo</ButtonLink>
        </div>
      </div>
    </section>
  )
}
