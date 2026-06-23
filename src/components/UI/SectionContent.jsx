import { useState, useEffect } from 'react'
import { storyData, projectRegions } from '../../data/storyData'
import { useSceneAnimation } from '../SceneManager/SceneAnimationController'
import { isMobile } from '../../utils/device'
import { getPrefersReducedMotion } from '../../utils/accessibility'
import styles from './SectionContent.module.css'

// Advanced UI Interaction Wrappers
import Magnetic from './Magnetic'
import Reveal from './Reveal'
import Hero from '../Hero/Hero'

/**
 * SectionContent
 * Renders every story section's HTML content layer. Section-count driven —
 * works for any number of sections in `storyData`. Features mouse parallax,
 * elastic magnetic CTA buttons, and entrance reveals.
 */
export default function SectionContent({ activeSection }) {
  const { progress } = useSceneAnimation()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const N = storyData.length
  const stepSpan = N > 1 ? 1 / (N - 1) : 1 // progress distance between section centres

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
        const center = idx * stepSpan          // progress at which this section is centred
        const delta = progress - center        // signed distance from centre
        const isActive = activeSection === s.id

        // Scroll-driven parallax (0 at centre, grows as you scroll away)
        const headingY = Math.max(-60, Math.min(60, delta * -260))
        const ctaY = isActive ? 0 : 24

        // Mouse parallax for content boxes (desktop only)
        const parallaxStyle = (isMobile() || getPrefersReducedMotion())
          ? {}
          : { transform: `translate3d(${mousePos.x * 16}px, ${mousePos.y * 16}px, 0)` }

        // Custom Hero section overlay (data-driven)
        if (s.type === 'hero') {
          return <Hero key={s.id} data={s} active={isActive} />
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
                <p className={styles.description}>{s.description}</p>
              </Reveal>

              {/* CTA Button wrapped in Magnetic wrapper */}
              <Reveal active={isActive} delay={0.25}>
                <Magnetic>
                  <button
                    className={styles.ctaButton}
                    style={{ transform: `translateY(${ctaY}px)` }}
                    data-cursor="explore"
                  >
                    <span className="magnetic-text">
                      {s.ctaText} <span className={styles.ctaArrow}>→</span>
                    </span>
                  </button>
                </Magnetic>
              </Reveal>

              {/* Project region cards — only on the Projects section */}
              {s.type === 'projects' && (
                <Reveal active={isActive} delay={0.35}>
                  <div className={styles.statsRow}>
                    {projectRegions.map((r) => (
                      <div key={r.region} className={styles.statItem}>
                        <span className={styles.statCount}>{r.count}</span>
                        <span className={styles.statLabel}>{r.region}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
