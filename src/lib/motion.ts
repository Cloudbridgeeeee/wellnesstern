import { useEffect, useRef, useState } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Marks (data-in) every `.reveal` / `.draw` element as it enters the viewport, including
 * elements mounted later, and feeds the pointer position to `.spot` cards.
 */
export function useReveal(key: string) {
  useEffect(() => {
    const show = (el: Element) => el.setAttribute('data-in', '')
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal, .draw').forEach(show)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show(e.target)
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    const scan = () => document.querySelectorAll('.reveal:not([data-in]), .draw:not([data-in])').forEach((el) => io.observe(el))
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    // Fast scrolls and anchor jumps can skip an intersection; reveal anything already above the fold.
    let raf = 0
    const sweep = () => {
      raf = 0
      const limit = window.innerHeight
      document.querySelectorAll('.reveal:not([data-in]), .draw:not([data-in])').forEach((el) => {
        if (el.getBoundingClientRect().top < limit) {
          show(el)
          io.unobserve(el)
        }
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sweep)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const late = window.setTimeout(sweep, 350)
    return () => {
      io.disconnect()
      mo.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(late)
      cancelAnimationFrame(raf)
    }
  }, [key])

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.('.spot') as HTMLElement | null
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
}

/** Counts up to `to` the first time the element scrolls into view. */
export function useCountUp<T extends HTMLElement>(to: number, ms = 1600) {
  const ref = useRef<T>(null)
  const [value, setValue] = useState(() => (prefersReducedMotion() ? to : 0))
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) {
      setValue(to)
      return
    }
    let raf = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / ms)
          setValue(to * (1 - Math.pow(1 - p, 3)))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, ms])
  return [ref, value] as const
}

/** Advances an index every `ms` (paused for reduced motion). */
export function useTicker(length: number, ms = 2400) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion() || length < 2) return
    const t = window.setInterval(() => setI((n) => (n + 1) % length), ms)
    return () => window.clearInterval(t)
  }, [length, ms])
  return i
}

/** A value that increments every `ms`, for continuously animated visuals. */
export function useClock(ms = 900) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const t = window.setInterval(() => setN((x) => x + 1), ms)
    return () => window.clearInterval(t)
  }, [ms])
  return n
}

/** Tracks scroll progress (0–1) of the page, used by the header progress bar. */
export function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setP(max > 0 ? h.scrollTop / max : 0)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return p
}
