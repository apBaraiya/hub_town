import { useState, useEffect } from 'react'
import { storyData } from '../../data/storyData'
import { useSceneAnimation } from '../SceneManager/SceneAnimationController'
import { getLocalProgress, easeInOutCubic } from '../../utils/progress'
import { isMobile } from '../../utils/device'
import { getPrefersReducedMotion } from '../../utils/accessibility'
import styles from './SectionContent.module.css'

// Advanced UI Interaction Wrappers
import Magnetic from './Magnetic'
import Reveal from './Reveal'
import Hero from '../Hero/Hero'

/**
 * SectionContent
 * Renders all 4 story sections' HTML content layers.
 * Features mouse parallax, elastic magnetic CTA buttons, and entrance reveals.
 */
export default function SectionContent({ activeSection }) {
  const { progress } = useSceneAnimation()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const ranges = [
    { start: 0.00, end: 0.25 },
    { start: 0.25, end: 0.50 },
    { start: 0.50, end: 0.75 },
    { start: 0.75, end: 1.00 },
  ]

  // Track cursor position normalized from -0.5 to 0.5 for subtle parallax
  useEffect(() => {
    if (isMobile() || getPrefersReducedMotion()) return

    const onMouseMove = (e) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth) - 0.5
      const y = (clientY / window.innerHeight) - 0.5
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div className={styles.sectionsWrapper}>
      {storyData.map((s, idx) => {
        const range = ranges[idx]
        const localP = getLocalProgress(progress, range.start, range.end)
        const easedP = easeInOutCubic(localP)
        const isActive = activeSection === s.id

        // Calculate scroll-driven properties
        const headingY = easedP * -50
        const bodyOpacity = Math.max(0, 1 - easedP * 1.5)
        const ctaY = (1 - easedP) * 35
        const ctaOpacity = Math.max(0, Math.min(1, easedP * 2.0))

        // Parallax style for content boxes (desktop only)
        const parallaxStyle = (isMobile() || getPrefersReducedMotion())
          ? {}
          : {
              transform: `translate3d(${mousePos.x * 16}px, ${mousePos.y * 16}px, 0)`,
            }

        // Custom Hero section overlay override
        if (s.id === 1) {
          return (
            <Hero
              key={s.id}
              active={isActive}
              opacity={bodyOpacity}
            />
          )
        }

        return (
          <section
            key={s.id}
            id={s.anchor}
            className={`scroll-section ${styles.section}`}
          >
            <div
              className={`${styles.content} ${isActive ? styles.active : ''}`}
              style={{
                opacity: isActive ? 1 : 0,
                visibility: isActive ? 'visible' : 'hidden',
                ...parallaxStyle,
              }}
            >
              {/* Small Label with Reveal */}
              <Reveal active={isActive} delay={0.05}>
                <p className={styles.label}>
                  <span className={styles.labelLine} />
                  {s.label}
                </p>
              </Reveal>

              {/* Large Heading (line-by-line reveal) */}
              <h2
                className={styles.heading}
                style={{ transform: `translateY(${headingY}px)` }}
              >
                {s.heading.map((line, i) => (
                  <span key={i} className={styles.headingLineWrapper}>
                    <span
                      className={`${styles.headingLine} ${isActive ? styles.revealed : ''}`}
                      style={{ transitionDelay: `${i * 120}ms` }}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h2>

              {/* Description with Reveal */}
              <Reveal active={isActive} delay={0.15}>
                <p
                  className={styles.description}
                  style={{ opacity: isActive ? bodyOpacity : 0 }}
                >
                  {s.description}
                </p>
              </Reveal>

              {/* CTA Button wrapped in Magnetic wrapper */}
              <Reveal active={isActive} delay={0.25}>
                <Magnetic>
                  <button
                    className={styles.ctaButton}
                    style={{
                      transform: `translateY(${ctaY}px)`,
                      opacity: isActive ? ctaOpacity : 0,
                    }}
                    data-cursor="explore"
                  >
                    <span className="magnetic-text">
                      {s.ctaText} <span className={styles.ctaArrow}>→</span>
                    </span>
                  </button>
                </Magnetic>
              </Reveal>
            </div>
          </section>
        )
      })}
    </div>
  )
}
