/**
 * Section data — mirrors the Hubtown homepage STRUCTURE / flow:
 *   1. Hero          → headline + primary CTA
 *   2. Our Projects  → region cards (counts per area)
 *   3-7. Value blocks → Innovation · Collaboration · Excellence · Purpose · Legacy
 *
 * NOTE: All copy below is PLACEHOLDER text — replace it with your own.
 */

// Virtual scroll distance (px) for the pinned 3D experience.
// Scales with the number of sections so pacing stays consistent.
export const SCROLL_LENGTH = 6000

export const storyData = [
  {
    id: 1,
    anchor: 'section-1',
    type: 'hero',
    label: 'Future',
    heading: ['We Build The Future', 'Of Real Estate'],
    description: 'Crafting landmark homes and workspaces that shape how the city lives, works and grows. (Replace with your own copy.)',
    ctaText: 'Explore Our Projects',
  },
  {
    id: 2,
    anchor: 'section-2',
    type: 'projects',
    label: 'Our Projects',
    heading: ['Our', 'Projects'],
    description: 'Replace this with a short intro about your portfolio across regions.',
    ctaText: 'View Projects',
  },
  {
    id: 3,
    anchor: 'section-3',
    type: 'value',
    label: '01 — Innovation',
    heading: ['Innovation'],
    description: 'Replace this with your Innovation section copy.',
    ctaText: 'Learn More',
  },
  {
    id: 4,
    anchor: 'section-4',
    type: 'value',
    label: '02 — Collaboration',
    heading: ['Collaboration'],
    description: 'Replace this with your Collaboration section copy.',
    ctaText: 'Learn More',
  },
  {
    id: 5,
    anchor: 'section-5',
    type: 'value',
    label: '03 — Excellence',
    heading: ['Excellence'],
    description: 'Replace this with your Excellence section copy.',
    ctaText: 'Learn More',
  },
  {
    id: 6,
    anchor: 'section-6',
    type: 'value',
    label: '04 — Purpose',
    heading: ['Purpose'],
    description: 'Replace this with your Purpose section copy.',
    ctaText: 'Learn More',
  },
  {
    id: 7,
    anchor: 'section-7',
    type: 'value',
    label: '05 — Legacy',
    heading: ['Legacy'],
    description: 'Replace this with your Legacy section copy.',
    ctaText: 'Get In Touch',
  },
]

/**
 * Project counts by region — shown as cards on the Projects section.
 * Counts are placeholders; update with your real numbers.
 */
export const projectRegions = [
  { count: '09', region: 'Central Suburbs' },
  { count: '12', region: 'South Mumbai' },
  { count: '18', region: 'Western Suburbs' },
  { count: '06', region: 'Thane' },
  { count: '—', region: 'Future Projects' },
]
