import styles from './Hero.module.css'
import Reveal from '../UI/Reveal'
import Magnetic from '../UI/Magnetic'

/**
 * Hero
 * The HTML content layer for the first (hero) section.
 * Data-driven: heading / description / CTA come from storyData.
 * Centered layout, bold typography, glass CTA, animated scroll prompt.
 */
export default function Hero({ data, active }) {
  const heading = data?.heading ?? []
  const description = data?.description ?? ''
  const ctaText = data?.ctaText ?? 'Explore'

  return (
    <section
      id={data?.anchor ?? 'section-1'}
      className={`scroll-section ${styles.hero}`}
      style={{
        opacity: active ? 1 : 0,
        visibility: active ? 'visible' : 'hidden',
        transition: 'opacity 500ms ease, visibility 500ms ease',
      }}
    >
      <div className={styles.content}>
        {/* Main headline */}
        <Reveal active={active} delay={0.1}>
          <h1 className={styles.headline}>
            {heading.map((line, i) => (
              <span key={i}>
                {i === heading.length - 1 ? (
                  <span className={styles.headlineAccent}>{line}</span>
                ) : (
                  line
                )}
                {i < heading.length - 1 && <br />}
              </span>
            ))}
          </h1>
        </Reveal>

        {/* Description */}
        <Reveal active={active} delay={0.25}>
          <p className={styles.description}>{description}</p>
        </Reveal>

        {/* CTA Button */}
        <Reveal active={active} delay={0.4}>
          <Magnetic>
            <button className={styles.ctaButton} data-cursor="explore">
              <span className="magnetic-text">{ctaText}</span>
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
