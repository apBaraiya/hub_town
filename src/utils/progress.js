/**
 * Maps global scroll progress [0, 1] to a localized sub-range.
 * Returns a value between 0 and 1.
 *
 * @param {number} globalProgress - Current global scroll progress (0 to 1)
 * @param {number} start - Local progress start boundary (e.g. 0.25)
 * @param {number} end - Local progress end boundary (e.g. 0.50)
 * @returns {number} Local progress (0 to 1)
 */
export function getLocalProgress(globalProgress, start, end) {
  return Math.min(1, Math.max(0, (globalProgress - start) / (end - start)));
}

/**
 * Standard cubic ease-in-out transition curve.
 *
 * @param {number} t - Input factor (0 to 1)
 * @returns {number} Eased factor (0 to 1)
 */
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
