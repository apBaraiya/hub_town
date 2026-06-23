import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { storyData, SCROLL_LENGTH } from '../data/storyData'

gsap.registerPlugin(ScrollTrigger)

/**
 * useScrollProgress
 * Sets up a master timeline ScrollTrigger that pins the scroll container
 * and drives a global progress value from 0 to 1 over a virtual distance.
 *
 * Section-count driven: works for any number of sections in `storyData`.
 *
 * @param {React.RefObject} containerRef - ref to the #scroll-container element
 * @returns {{ progress: number, activeSection: number }}
 */
export function useScrollProgress(containerRef) {
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState(1)

  useEffect(() => {
    if (!containerRef?.current) return

    const N = storyData.length
    // Section i (0-based) is centred at progress = i / (N - 1)
    const stepSpan = N > 1 ? 1 / (N - 1) : 1

    // 1. Create the pinning Master ScrollTrigger
    const masterTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${SCROLL_LENGTH}`,
      scrub: 1.2,
      pin: true,
      onUpdate: (self) => {
        const p = self.progress
        setProgress(p)

        // Active section (1-based) = nearest section centre
        const idx = Math.min(N - 1, Math.max(0, Math.round(p / stepSpan)))
        setActiveSection(idx + 1)
      },
    })

    // 2. Translate the sections wrapper so every section scrolls into view.
    //    Wrapper is N×100vh tall; move it up by (N-1)/N of its height.
    const wrapper = containerRef.current.firstElementChild
    let translateAnimation = null
    if (wrapper) {
      translateAnimation = gsap.to(wrapper, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${SCROLL_LENGTH}`,
          scrub: 1.2,
        },
        yPercent: -((N - 1) / N) * 100,
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
