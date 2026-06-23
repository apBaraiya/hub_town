import styles from './SectionLabel.module.css'

/**
 * SectionLabel
 * Small floating label shown in the bottom-right corner of each scroll section,
 * indicating which section and its progress range.
 *
 * @param {{ number: number, title: string, range: string, active: boolean }} props
 */
export default function SectionLabel({ number, title, range, active }) {
  return (
    <div className={`${styles.label} ${active ? styles.active : ''}`}>
      <span className={styles.number}>0{number}</span>
      <div className={styles.info}>
        <span className={styles.title}>{title}</span>
        <span className={styles.range}>{range}</span>
      </div>
    </div>
  )
}
