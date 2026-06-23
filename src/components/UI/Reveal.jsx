import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { getPrefersReducedMotion } from '../../utils/accessibility'

/**
 * Reveal
 * Reusable slide-up animation container.
 * Automatically switches to instant reveals when prefers-reduced-motion is active.
 *
 * @param {{ children: React.ReactNode, active: boolean, delay: number, duration: number }} props
 */
export default function Reveal({ children, active = true, delay = 0, duration = 1.0 }) {
  const ref = useRef()

  useEffect(() => {
    // If reduced motion is requested, immediately align layout and skip offsets
    if (getPrefersReducedMotion()) {
      gsap.set(ref.current, { opacity: active ? 1 : 0, y: 0 })
      return
    }

    if (active) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: duration, delay: delay, ease: 'power3.out' }
      )
    } else {
      gsap.to(ref.current, { opacity: 0, y: -15, duration: 0.4, ease: 'power3.in' })
    }
  }, [active, delay, duration])

  return (
    <div ref={ref} style={{ opacity: active ? 1 : 0 }}>
      {children}
    </div>
  )
}
