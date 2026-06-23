/**
 * Device detection utilities
 */

/**
 * Returns true if the current device is likely a mobile/tablet.
 * Uses a combination of screen width and user-agent checks.
 *
 * @returns {boolean}
 */
export function isMobile() {
  if (typeof window === 'undefined') return false
  return (
    window.innerWidth < 768 ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  )
}
