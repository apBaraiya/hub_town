import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { isMobile } from '../../utils/device'
import { getPrefersReducedMotion } from '../../utils/accessibility'
import styles from './CustomCursor.module.css'

/**
 * CustomCursor
 * Premium smooth mouse follower using GSAP.
 * Bypassed automatically on touch/mobile devices or if reduced motion is preferred.
 */
export default function CustomCursor() {
  const dotRef = useRef()
  const ringRef = useRef()
  const [cursorState, setCursorState] = useState('default') // default, hover, explore, drag

  useEffect(() => {
    if (isMobile() || getPrefersReducedMotion()) return

    const onMouseMove = (e) => {
      const { clientX, clientY } = e
      
      // Position small center dot quickly
      gsap.to(dotRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.08,
        ease: 'power2.out',
      })
      
      // Position surrounding ring with elastic lag
      gsap.to(ringRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.32,
        ease: 'power2.out',
      })
    }

    // Dynamic hover bindings using custom data attributes
    const onMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (target) {
        const state = target.getAttribute('data-cursor')
        setCursorState(state)
      }
    }

    const onMouseOut = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (target) {
        setCursorState('default')
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    window.addEventListener('mouseout', onMouseOut)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  if (isMobile() || getPrefersReducedMotion()) return null

  // Class selection based on cursor states
  const activeClass = cursorState === 'hover' 
    ? styles.ringHover 
    : cursorState === 'explore' 
      ? styles.ringExplore 
      : cursorState === 'drag' 
        ? styles.ringDrag 
        : ''

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={`${styles.ring} ${activeClass}`}>
        {cursorState === 'explore' && <span className={styles.cursorText}>Explore</span>}
        {cursorState === 'drag' && <span className={styles.cursorText}>Drag</span>}
      </div>
    </>
  )
}
