import styles from './DebugUI.module.css'

/**
 * DebugUI
 * Glassmorphic diagnostic panel fixed to the top left showing engine parameters.
 *
 * @param {{ progress: number, zone: string, sectionIndex: number }} props
 */
export default function DebugUI({ progress, zone, sectionIndex }) {
  return (
    <div className={styles.container} aria-label="Animation debug parameters">
      <div className={styles.header}>Animation Engine</div>
      <div className={styles.row}>
        <span className={styles.label}>Progress:</span>
        <span className={styles.value}>{(progress * 100).toFixed(1)}%</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Zone:</span>
        <span className={styles.value}>{zone}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Section Index:</span>
        <span className={styles.value}>{sectionIndex}</span>
      </div>
    </div>
  )
}
