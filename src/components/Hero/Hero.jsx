import styles from './Hero.module.css'
import Reveal from '../UI/Reveal'
import Magnetic from '../UI/Magnetic'

/**
 * Hero
 * The HTML content layer for Section 1.
 * Centered layout, luxury bold typography, glassmorphism CTA, and animated scroll prompt.
 */
export default function Hero({ active, opacity }) {
  return (
    <section
      id="section-1"
      className={`scroll-section ${styles.hero}`}
      style={{
        opacity: active ? opacity : 0,
        visibility: active ? 'visible' : 'hidden',
        transition: 'opacity 500ms ease, visibility 500ms ease'
      }}
    >
      <div className={styles.content}>
        {/* Main headline */}
        <Reveal active={active} delay={0.1}>
          <h1 className={styles.headline}>
            WE BUILD THE FUTURE
            <br />
            <span className={styles.headlineAccent}>OF REAL ESTATE</span>
          </h1>
        </Reveal>

        {/* Description */}
        <Reveal active={active} delay={0.25}>
          <p className={styles.description}>
            Experience the new standard of architectural excellence. Our projects combine
            organic geometry, transmissive materials, and cinematic design to redefine
            modern luxury living in Mumbai's skyline.
          </p>
        </Reveal>

        {/* CTA Button */}
        <Reveal active={active} delay={0.4}>
          <Magnetic>
            <button className={styles.ctaButton} data-cursor="explore">
              <span className="magnetic-text">EXPLORE OUR PROJECTS</span>
            </button>
          </Magnetic>
        </Reveal>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <span className={styles.scrollLabel}>SCROLL TO EXPLORE</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
