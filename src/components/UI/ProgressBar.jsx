import { useSceneAnimation } from '../SceneManager/SceneAnimationController'
import styles from './ProgressBar.module.css'

/**
 * ProgressBar
 * Fixed luxury vertical scroll indicator.
 * Displays global scroll percentage, segmented tracks with local section fills, and markers.
 */
export default function ProgressBar() {
  const { progress } = useSceneAnimation()

  const sections = [
    { id: 1, label: 'HOME',      start: 0.00, end: 0.25 },
    { id: 2, label: 'VISION',    start: 0.25, end: 0.50 },
    { id: 3, label: 'LIFESTYLE', start: 0.50, end: 0.75 },
    { id: 4, label: 'SHOWCASE',  start: 0.75, end: 1.00 },
  ]

  const globalPct = Math.round(progress * 100).toString().padStart(2, '0')

  return (
    <div className={styles.wrapper} aria-label={`Scroll progress: ${globalPct}%`}>
      {/* Percentage Display */}
      <div className={styles.percentBox}>
        <span className={styles.percentText}>{globalPct}</span>
        <span className={styles.percentUnit}>%</span>
      </div>

      {/* Segmented tracks */}
      <div className={styles.segments}>
        {sections.map((s, idx) => {
          // Calculate local progress (0 to 1)
          const localP = Math.min(1, Math.max(0, (progress - s.start) / (s.end - s.start)))
          const active = progress >= s.start && progress < s.end || (idx === 3 && progress === 1.00)
          
          return (
            <div key={s.id} className={`${styles.segment} ${active ? styles.active : ''}`}>
              <span className={styles.label}>{s.label}</span>
              <div className={styles.track}>
                <div
                  className={styles.fill}
                  style={{ height: `${localP * 100}%` }}
                />
              </div>
              <span className={styles.number}>0{s.id}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
