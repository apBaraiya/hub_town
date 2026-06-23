import { useState, useEffect } from 'react'
import { storyData, SCROLL_LENGTH } from '../../data/storyData'
import styles from './Navbar.module.css'

const LAST = storyData.length - 1

const NAV_LINKS = [
  { label: 'ABOUT US',   href: '#section-1', sectionIdx: 0 },
  { label: 'PROJECTS',   href: '#section-2', sectionIdx: 1 },
  { label: 'CAREERS',    href: '#section-3', sectionIdx: 2 },
  { label: 'CONTACT US', href: `#section-${storyData.length}`, sectionIdx: LAST },
  { label: 'NEWS',       href: `#section-${storyData.length}`, sectionIdx: LAST },
]

/**
 * Navbar
 * Luxury top navigation. Handles scrolled blur backgrounds, active highlights,
 * and a fullscreen overlay menu with entry transitions on mobile.
 *
 * @param {{ activeSection: number }} props
 */
export default function Navbar({ activeSection }) {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLinkClick = (e, sectionIdx) => {
    e.preventDefault()
    // Scroll target = section centre as a fraction of the virtual scroll distance
    const last = storyData.length - 1
    const fraction = last > 0 ? sectionIdx / last : 0
    window.scrollTo({
      top: fraction * SCROLL_LENGTH,
      behavior: 'smooth',
    })
  }

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} navbar-logo`}>
        {/* Brand */}
        <a
          href="#section-1"
          className={styles.brand}
          onClick={(e) => handleLinkClick(e, 0)}
          data-cursor="hover"
        >
          <span className={styles.brandAccent}>H</span>UBTOWN
        </a>

        {/* Desktop Links + Login */}
        <div className={`${styles.navRight} fade-in-ui`}>
          <ul className={styles.links}>
            {NAV_LINKS.map(({ label, href, sectionIdx }) => (
              <li key={label}>
                <a
                  href={href}
                  className={`${styles.link} ${activeSection === sectionIdx + 1 ? styles.active : ''}`}
                  onClick={(e) => handleLinkClick(e, sectionIdx)}
                  data-cursor="hover"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Login CTA */}
          <a
            href="#login"
            className={styles.cta}
            onClick={(e) => e.preventDefault()}
            data-cursor="hover"
          >
            Login
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          data-cursor="hover"
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </nav>

      {/* Mobile Fullscreen Overlay Menu */}
      <div className={`${styles.menuOverlay} ${isMenuOpen ? styles.overlayActive : ''}`}>
        <ul className={styles.overlayLinks}>
          {NAV_LINKS.map(({ label, href, sectionIdx }, i) => (
            <li
              key={label}
              className={styles.overlayLinkItem}
              style={{
                transform: isMenuOpen ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.9)',
                opacity: isMenuOpen ? 1 : 0,
                transitionDelay: isMenuOpen ? `${i * 120}ms` : '0ms',
              }}
            >
              <a
                href={href}
                className={`${styles.overlayLink} ${activeSection === sectionIdx + 1 ? styles.overlayActiveLink : ''}`}
                onClick={(e) => {
                  setIsMenuOpen(false)
                  handleLinkClick(e, sectionIdx)
                }}
              >
                {label}
              </a>
            </li>
          ))}
          <li
            className={styles.overlayLinkItem}
            style={{
              transform: isMenuOpen ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.9)',
              opacity: isMenuOpen ? 1 : 0,
              transitionDelay: isMenuOpen ? `${NAV_LINKS.length * 120}ms` : '0ms',
            }}
          >
            <a
              href="#login"
              className={styles.overlayLink}
              onClick={(e) => { e.preventDefault(); setIsMenuOpen(false) }}
            >
              LOGIN
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}
