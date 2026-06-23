/**
 * Detects whether the user's OS prefers reduced motion for animations.
 *
 * @returns {boolean} True if reduced motion is requested
 */
export function getPrefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
