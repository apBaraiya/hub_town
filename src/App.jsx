import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas }        from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { isMobile }     from './utils/device'
import { getPrefersReducedMotion } from './utils/accessibility'

// Components
import Loader           from './components/Loader/Loader'
import Navbar           from './components/Navbar/Navbar'
import SceneManager     from './components/SceneManager/SceneManager'
import SectionContent   from './components/UI/SectionContent'
import ProgressBar      from './components/UI/ProgressBar'
import SectionLabel     from './components/UI/SectionLabel'
import DebugUI          from './components/UI/DebugUI'
import CustomCursor     from './components/UI/CustomCursor'

// Hooks
import { useLenis }         from './hooks/useLenis'
import { useScrollProgress } from './hooks/useScrollProgress'

// Scene Animation Context
import { SceneAnimationController } from './components/SceneManager/SceneAnimationController'

/**
 * App
 * Root component. Mounts:
 *   1. Fixed 3D canvas (z-index: 0, transparent background)
 *   2. HTML content layer (z-index: 10)
 *      ├─ Navbar
 *      ├─ Scroll container (4 × 100vh sections)
 *      └─ UI overlays (ProgressBar, SectionLabel, DebugUI)
 *   3. Loading screen (z-index: 100)
 *   4. Custom Cursor overlay (z-index: 9999)
 */
export default function App() {
  const scrollContainerRef = useRef(null)
  const mobile = isMobile()
  const [introStarted, setIntroStarted] = useState(false)

  // ── Smooth scroll ───────────────────────────────────────────────────────
  useLenis()

  // ── Scroll progress tracking (pins the scroll-container) ────────────────
  const { progress, activeSection } = useScrollProgress(scrollContainerRef)

  // ── Calculate Active Zone and Section Index ──
  let zone = 'ZONE_1'
  let sectionIndex = 0

  if (progress < 0.25) {
    zone = 'ZONE_1'
    sectionIndex = 0
  } else if (progress < 0.50) {
    zone = 'ZONE_2'
    sectionIndex = 1
  } else if (progress < 0.75) {
    zone = 'ZONE_3'
    sectionIndex = 2
  } else {
    zone = 'ZONE_4'
    sectionIndex = 3
  }

  // ── Page Intro Sequence Timeline ──
  useEffect(() => {
    if (!introStarted) return

    // Immediately show everything if user prefers reduced motion
    if (getPrefersReducedMotion()) {
      gsap.set('.navbar-logo', { opacity: 1, y: 0 })
      gsap.set('.fade-in-ui', { opacity: 1 })
      gsap.set('#scroll-container', { opacity: 1 })
      return
    }

    const tl = gsap.timeline()

    // 1. Logo / Navbar Brand Reveal
    tl.fromTo('.navbar-logo', 
      { opacity: 0, y: -24 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }
    )

    // 2. Section 1 Heading Slides In (triggered via CSS transition on active section mount,
    // so we reveal the scroll container next)
    tl.fromTo('#scroll-container',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
      '-=0.6'
    )

    // 3. UI Overlays (ProgressBar, indicators) fade in
    tl.fromTo('.fade-in-ui',
      { opacity: 0 },
      { opacity: 1, duration: 1.0, ease: 'power2.out' },
      '-=0.7'
    )
  }, [introStarted])

  return (
    <SceneAnimationController progress={progress}>
      {/* Custom Cursor follower */}
      <CustomCursor />

      {/* ════════════════════════════════════════════════════════════════
          Layer 1: Fixed 3D Canvas
      ════════════════════════════════════════════════════════════════ */}
      <div id="canvas-container">
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, 2]}
          gl={{
            antialias:       true,
            alpha:           true,
            powerPreference: mobile ? 'low-power' : 'high-performance',
            preserveDrawingBuffer: false,
            toneMapping:     THREE.NoToneMapping,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            fov={35}
            near={0.1}
            far={1000}
            position={[0, 0, 8]}
          />

          {/* Scene content — loaded lazily via Suspense */}
          <Suspense fallback={null}>
            <SceneManager
              isMobileDevice={mobile}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          Layer 2: HTML Content Layer
      ════════════════════════════════════════════════════════════════ */}
      <div id="content-layer">
        {/* Fixed navigation */}
        <Navbar activeSection={activeSection} />

        {/* Vertical progress indicator */}
        <ProgressBar />

        {/* Diagnostic Debug HUD */}
        <DebugUI progress={progress} zone={zone} sectionIndex={sectionIndex} />

        {/* Section Label Overlay */}
        <div className="fade-in-ui" style={{ position: 'fixed', bottom: '48px', right: '48px', zIndex: 20 }}>
          {[
            { number: 1, title: 'Overview', range: '0% – 25%' },
            { number: 2, title: 'Exterior', range: '25% – 50%' },
            { number: 3, title: 'Interiors', range: '50% – 75%' },
            { number: 4, title: 'Location', range: '75% – 100%' },
          ].map((sec) => (
            <SectionLabel
              key={sec.number}
              number={sec.number}
              title={sec.title}
              range={sec.range}
              active={activeSection === sec.number}
            />
          ))}
        </div>

        {/* Scrollable container — 4 × 100vh */}
        <div id="scroll-container" ref={scrollContainerRef} style={{ opacity: 0 }}>
          <SectionContent activeSection={activeSection} />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          Layer 3: Loading Screen
      ════════════════════════════════════════════════════════════════ */}
      <Loader onLoaded={() => setIntroStarted(true)} />
    </SceneAnimationController>
  )
}