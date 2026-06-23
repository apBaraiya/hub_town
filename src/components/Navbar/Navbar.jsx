import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'ABOUT',     href: '#section-1', sectionIdx: 0 },
  { label: 'PROJECTS',  href: '#section-2', sectionIdx: 1 },
  { label: 'CAREERS',   href: '#section-3', sectionIdx: 2 },
  { label: 'CONTACT',   href: '#section-4', sectionIdx: 3 },
  { label: 'NEWS',      href: '#section-4', sectionIdx: 3 },
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
    // Calculate scroll target based on 5000px total virtual distance
    const targetScrollY = sectionIdx * 1250
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
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

        {/* Desktop Links */}
        <ul className={`${styles.links} fade-in-ui`}>
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
        </ul>
      </div>
    </>
  )
}
