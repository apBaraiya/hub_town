import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useScrollProgress
 * Sets up a master timeline ScrollTrigger that pins the scroll container
 * and drives a global progress value from 0 to 1 over a virtual distance of 5000px.
 *
 * @param {React.RefObject} containerRef - ref to the #scroll-container element
 * @returns {{ progress: number, activeSection: number }}
 */
export function useScrollProgress(containerRef) {
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState(1)

  useEffect(() => {
    if (!containerRef?.current) return

    // 1. Create the pinning Master ScrollTrigger
    const masterTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=5000', // virtual 5000px scroll length
      scrub: 1.2,    // smooth scroll updates
      pin: true,     // pin container in place
      onUpdate: (self) => {
        const p = self.progress
        setProgress(p)

        // Derives active section (1-4)
        if      (p < 0.25) setActiveSection(1)
        else if (p < 0.50) setActiveSection(2)
        else if (p < 0.75) setActiveSection(3)
        else               setActiveSection(4)
      },
    })

    // 2. Animate the sections wrapper vertically
    const wrapper = containerRef.current.firstElementChild
    let translateAnimation = null
    if (wrapper) {
      translateAnimation = gsap.to(wrapper, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=5000',
          scrub: 1.2,
        },
        yPercent: -75, // translate from 0 to -75% to bring all 4 sections in view
        ease: 'none',
      })
    }

    return () => {
      masterTrigger.kill()
      if (translateAnimation) {
        translateAnimation.scrollTrigger?.kill()
        translateAnimation.kill()
      }
    }
  }, [containerRef])

  return { progress, activeSection }
}
