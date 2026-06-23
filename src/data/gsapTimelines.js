/**
 * gsapTimelines.js
 *
 * Central place to define GSAP ScrollTrigger timelines for each section.
 * Call `initTimelines(containerEl)` once on mount.
 *
 * Timeline progress mapping:
 *   Section 1  →  0%  – 25%   (scrub range: 0    – 0.25 of total)
 *   Section 2  →  25% – 50%   (scrub range: 0.25 – 0.50 of total)
 *   Section 3  →  50% – 75%   (scrub range: 0.50 – 0.75 of total)
 *   Section 4  →  75% – 100%  (scrub range: 0.75 – 1.00 of total)
 *
 * Each timeline is returned so callers can kill them on unmount.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * @param {HTMLElement} container  — the #scroll-container element
 * @returns {ScrollTrigger[]}      — array of created triggers (for cleanup)
 */
export function initTimelines(container) {
  const triggers = []

  // ── Helper to get a section element by its 1-based index ─────────────────
  const getSection = (n) => container.querySelector(`#section-${n}`)

  // ── Section 1: 0% – 25% ──────────────────────────────────────────────────
  const tl1 = gsap.timeline({ paused: true })
  tl1
    // Placeholder: fade in the hero content
    .fromTo('#section-1 [class*="content"]',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    )

  const st1 = ScrollTrigger.create({
    trigger:    getSection(1),
    start:      'top top',
    end:        'bottom top',
    scrub:      1.5,
    animation:  tl1,
  })
  triggers.push(st1)

  // ── Section 2: 25% – 50% ─────────────────────────────────────────────────
  const tl2 = gsap.timeline({ paused: true })
  tl2
    .fromTo('#section-2 [class*="content"]',
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
    )

  const st2 = ScrollTrigger.create({
    trigger:    getSection(2),
    start:      'top top',
    end:        'bottom top',
    scrub:      1.5,
    animation:  tl2,
  })
  triggers.push(st2)

  // ── Section 3: 50% – 75% ─────────────────────────────────────────────────
  const tl3 = gsap.timeline({ paused: true })
  tl3
    .fromTo('#section-3 [class*="content"]',
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    )

  const st3 = ScrollTrigger.create({
    trigger:    getSection(3),
    start:      'top top',
    end:        'bottom top',
    scrub:      1.5,
    animation:  tl3,
  })
  triggers.push(st3)

  // ── Section 4: 75% – 100% ────────────────────────────────────────────────
  const tl4 = gsap.timeline({ paused: true })
  tl4
    .fromTo('#section-4 [class*="content"]',
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
    )

  const st4 = ScrollTrigger.create({
    trigger:    getSection(4),
    start:      'top top',
    end:        'bottom top',
    scrub:      1.5,
    animation:  tl4,
  })
  triggers.push(st4)

  return triggers
}
