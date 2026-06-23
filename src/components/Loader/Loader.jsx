import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import styles from './Loader.module.css'

/**
 * Loader
 * Premium minimal luxury loading screen.
 * Tracks actual R3F asset progress using `useProgress()`.
 */
export default function Loader({ onLoaded }) {
  const { progress } = useProgress()
  const [smoothProgress, setSmoothProgress] = useState(0)
  const [shouldHide, setShouldHide] = useState(false)

  // Smoothly count up the percentage to avoid visual jumps
  useEffect(() => {
    let animationFrameId
    const updateProgress = () => {
      setSmoothProgress((prev) => {
        if (prev < progress) {
          const diff = progress - prev
          // Adjust increment speed based on distance
          const next = prev + Math.max(0.1, diff * 0.08)
          if (next >= 99.9) {
            return 100
          }
          return next
        }
        return prev
      })
      animationFrameId = requestAnimationFrame(updateProgress)
    }
    updateProgress()
    return () => cancelAnimationFrame(animationFrameId)
  }, [progress])

  // Fade out screen after a luxury pause once 100% loaded
  useEffect(() => {
    if (smoothProgress >= 100) {
      const timer = setTimeout(() => {
        setShouldHide(true)
        if (onLoaded) onLoaded() // Signal that loading is finished
      }, 1000) // 1 second total hold time for luxury feel
      return () => clearTimeout(timer)
    }
  }, [smoothProgress, onLoaded])

  if (shouldHide) return null

  // Ensure double digit format (00, 05, etc.)
  const displayPercent = Math.floor(smoothProgress).toString().padStart(2, '0')

  return (
    <div className={`${styles.overlay} ${smoothProgress >= 100 ? styles.hidden : ''}`}>
      <div className={styles.container}>
        <span className={styles.brand}>HUBTOWN</span>
        <div className={styles.progressContainer}>
          <div className={styles.percent}>{displayPercent}%</div>
          <div className={styles.bar}>
            <div className={styles.fill} style={{ width: `${smoothProgress}%` }} />
          </div>
        </div>
        <span className={styles.status}>Loading Assets</span>
      </div>
    </div>
  )
}
