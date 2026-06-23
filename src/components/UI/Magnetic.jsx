import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { isMobile } from '../../utils/device'
import { getPrefersReducedMotion } from '../../utils/accessibility'

/**
 * Magnetic
 * Spring-based mouse-magnetic effect for luxury desktop buttons.
 * Translates the button by up to 35% of offset, and nested `.magnetic-text` elements by 15% for parallax depth.
 */
export default function Magnetic({ children }) {
  const ref = useRef()

  useEffect(() => {
    // Disable on mobile/touch screens or if user prefers reduced motion
    if (isMobile() || getPrefersReducedMotion()) return

    const element = ref.current
    if (!element) return

    // GSAP quickTo sets up high-performance property animators with smooth spring elasticity
    const xTo = gsap.quickTo(element, 'x', { duration: 1, ease: 'elastic.out(1, 0.35)' })
    const yTo = gsap.quickTo(element, 'y', { duration: 1, ease: 'elastic.out(1, 0.35)' })

    const text = element.querySelector('.magnetic-text')
    const textXTo = text ? gsap.quickTo(text, 'x', { duration: 1, ease: 'elastic.out(1, 0.35)' }) : null
    const textYTo = text ? gsap.quickTo(text, 'y', { duration: 1, ease: 'elastic.out(1, 0.35)' }) : null

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { left, top, width, height } = element.getBoundingClientRect()
      
      const centerX = left + width / 2
      const centerY = top + height / 2
      
      const distanceX = clientX - centerX
      const distanceY = clientY - centerY

      // Move container slightly, text inside even less for depth
      xTo(distanceX * 0.3)
      yTo(distanceY * 0.3)

      if (textXTo) textXTo(distanceX * 0.12)
      if (textYTo) textYTo(distanceY * 0.12)
    }

    const handleMouseLeave = () => {
      // Snap back to origin
      xTo(0)
      yTo(0)
      if (textXTo) textXTo(0)
      if (textYTo) textYTo(0)
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div ref={ref} style={{ display: 'inline-block' }}>
      {children}
    </div>
  )
}
