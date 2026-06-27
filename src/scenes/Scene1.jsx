import { useEffect, useRef, useMemo } from 'react'
import { useGLTF, MeshReflectorMaterial, useKTX2 } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneAnimation } from '../components/SceneManager/SceneAnimationController'
import { getLocalProgress, easeInOutCubic } from '../utils/progress'
import HolographicCube from '../components/HolographicCube'

// KTX2 loader transcoder path is passed directly into the useKTX2 hook call below.

/**
 * Scene1
 * Rebuilt Hero 3D scene implementing a continuous scroll-driven cube reveal sequence.
 * - The cube remains visible across all sections (0% to 100% scroll progress).
 * - The surrounding mountains and reflective water fade out smoothly after 25% progress
 *   to allow the background designs of Section 2, 3, and 4 to render cleanly.
 */
export default function Scene1({ scale = 1 }) {
  const { nodes } = useGLTF('/models/scene_1.glb')
  
  const groupRef = useRef()
  const cubeRef = useRef()
  const waterRef = useRef()
  const terrainRef = useRef()
  const pointLightRef = useRef()

  const { progress: globalProgress } = useSceneAnimation()
  const start = 0.00
  const end = 1.00 // Stay active across the entire scroll sequence to keep the cube visible

  const initialActive = globalProgress >= start && globalProgress < end
  const opacityRef = useRef(initialActive ? 1 : 0)
  const visibleRef = useRef(initialActive)

  // Background specific opacities for Section 1 (water & mountains)
  const initialBgActive = globalProgress >= 0.00 && globalProgress < 0.25
  const bgOpacityRef = useRef(initialBgActive ? 1 : 0)
  const bgVisibleRef = useRef(initialBgActive)

  // Load KTX2 Normal Maps
  const [waterNormalTex, terrainNormalTex] = useKTX2([
    "/water-normal.ktx2",
    "/terrain_normal.ktx2"
  ], "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r154/examples/jsm/libs/basis/")

  // Setup Texture Wrapping
  useMemo(() => {
    if (waterNormalTex) {
      waterNormalTex.wrapS = THREE.RepeatWrapping
      waterNormalTex.wrapT = THREE.RepeatWrapping
      waterNormalTex.repeat.set(4, 4)
    }
    if (terrainNormalTex) {
      terrainNormalTex.wrapS = THREE.RepeatWrapping
      terrainNormalTex.wrapT = THREE.RepeatWrapping
      terrainNormalTex.repeat.set(10, 10)
    }
  }, [waterNormalTex, terrainNormalTex])

  // Clean up geometries on unmount
  useEffect(() => {
    return () => {
      const refs = [cubeRef, waterRef, terrainRef]
      refs.forEach((ref) => {
        if (ref.current) {
          ref.current.geometry?.dispose()
          if (Array.isArray(ref.current.material)) {
            ref.current.material.forEach((m) => m.dispose())
          } else {
            ref.current.material?.dispose()
          }
        }
      })
    }
  }, [])

  useFrame((state, delta) => {
    const isActive = globalProgress >= start && globalProgress < end

    // 1. Calculate opacity for the cube (stays visible throughout)
    const targetOpacity = isActive ? 1 : 0
    if (opacityRef.current !== targetOpacity) {
      const step = delta / 0.4
      if (opacityRef.current < targetOpacity) {
        opacityRef.current = Math.min(targetOpacity, opacityRef.current + step)
      } else {
        opacityRef.current = Math.max(targetOpacity, opacityRef.current - step)
      }

      // (Cube is the self-glowing holographic shader — no material opacity to set.)
      const nextVisible = opacityRef.current > 0
      if (visibleRef.current !== nextVisible) {
        visibleRef.current = nextVisible
        if (groupRef.current) {
          groupRef.current.visible = nextVisible
        }
      }
    }

    // 2. Calculate background elements opacity (fades out after 25% progress)
    const isBgActive = globalProgress >= 0.00 && globalProgress < 0.25
    const targetBgOpacity = isBgActive ? 1 : 0
    if (bgOpacityRef.current !== targetBgOpacity) {
      const step = delta / 0.4
      if (bgOpacityRef.current < targetBgOpacity) {
        bgOpacityRef.current = Math.min(targetBgOpacity, bgOpacityRef.current + step)
      } else {
        bgOpacityRef.current = Math.max(targetBgOpacity, bgOpacityRef.current - step)
      }

      const bgMats = [
        waterRef.current?.material,
        terrainRef.current?.material,
      ].filter(Boolean)

      bgMats.forEach((mat) => {
        mat.opacity = bgOpacityRef.current
        mat.transparent = true
      })

      const nextBgVisible = bgOpacityRef.current > 0
      if (bgVisibleRef.current !== nextBgVisible) {
        bgVisibleRef.current = nextBgVisible
      }
    }

    if (!visibleRef.current) return

    // 3. Continuous waves animation
    const elapsed = state.clock.getElapsedTime()
    if (waterNormalTex) {
      waterNormalTex.offset.set(elapsed * 0.012, elapsed * 0.009)
    }

    // 4. Progress-based cube reveal sequence
    const localP = Math.min(1.0, Math.max(0.0, globalProgress))

    let scaleVal = 1.0
    let rotX = 0.0
    let rotY = 0.0
    let posY = 1.4
    let emissiveInt = 0.6
    let lightInt = 25

    // Gentle, continuous reveal — the camera does the travelling, so the cube
    // only grows subtly and keeps rotating to feel alive (never fills the frame).
    if (localP < 0.25) {
      // SECTION 1 (progress 0 → 25%)
      const t = localP / 0.25
      const easedT = easeInOutCubic(t)
      scaleVal = 0.60 + easedT * 0.1 // 0.95 -> 1.05
      rotY = easedT * (Math.PI / 4) // 0 -> 45deg
      rotX = easedT * (8 * Math.PI / 180)
      posY = 1.4
      emissiveInt = 0.8 + easedT * 0.4
      lightInt = 28 + easedT * 12
    } else if (localP < 0.50) {
      // SECTION 2 (progress 25 → 50%)
      const t = (localP - 0.25) / 0.25
      const easedT = easeInOutCubic(t)
      scaleVal = 1.05 + easedT * 0.15 // 1.05 -> 1.2
      rotY = (Math.PI / 4) + easedT * (Math.PI / 4) // 45 -> 90deg
      rotX = (8 + easedT * 4) * Math.PI / 180
      posY = 1.4 + easedT * 0.2 // 1.4 -> 1.6
      emissiveInt = 1.2 + easedT * 0.6
      lightInt = 40 + easedT * 15
    } else if (localP < 0.75) {
      // SECTION 3 (progress 50 → 75%)
      const t = (localP - 0.50) / 0.25
      const easedT = easeInOutCubic(t)
      scaleVal = 1.2 + easedT * 0.15 // 1.2 -> 1.35
      rotY = (Math.PI / 2) + easedT * (Math.PI / 2) // 90 -> 180deg
      rotX = 12 * Math.PI / 180
      posY = 1.6
      emissiveInt = 1.8 + easedT * 0.7
      lightInt = 55 + easedT * 15
    } else {
      // SECTION 4 (progress 75 → 100%)
      const t = (localP - 0.75) / 0.25
      const easedT = easeInOutCubic(t)
      scaleVal = 1.35 + easedT * 0.1 // 1.35 -> 1.45
      rotY = Math.PI + easedT * (Math.PI / 2) // 180 -> 270deg
      rotX = (12 - easedT * 6) * Math.PI / 180
      posY = 1.6 - easedT * 0.15 // 1.6 -> 1.45
      emissiveInt = 2.5 + easedT * 0.8
      lightInt = 70 + easedT * 15
    }

    // 5. Subtle idle floating motion
    const idleRot = Math.sin(elapsed) * 0.015 * opacityRef.current
    const idleY = Math.sin(elapsed * 0.8) * 0.02 * opacityRef.current

    if (cubeRef.current) {
      // Scroll-driven transform. The shader spins the cube on its own (uTime),
      // so it keeps moving even when the page is idle / not being scrolled.
      cubeRef.current.scale.setScalar(scaleVal)
      cubeRef.current.position.y = posY + idleY
      cubeRef.current.rotation.y = rotY + idleRot + Math.PI / 4
      cubeRef.current.rotation.x = rotX
    }

    // Update inner light intensity dynamically
    if (pointLightRef.current) {
      pointLightRef.current.intensity = lightInt
      pointLightRef.current.position.y = posY + idleY
    }
  })

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          Cube group — UNCHANGED orientation (the cube look the user approved)
      ════════════════════════════════════════════════════════════════ */}
      <group ref={groupRef} scale={scale} rotation={[0, Math.PI, 0]}>
        {/* ── Scene Specific Lights ── */}
        {visibleRef.current && (
          <>
            {/* Subtle blue light emitted from the cube (stays active) */}
            <pointLight
              ref={pointLightRef}
              position={[0, 1.4, 0]}
              color="#38bdf8"
              intensity={25}
              distance={20}
              decay={1.5}
            />
          </>
        )}

        {/* ── Holographic Grid Cube (Always Visible) ── */}
        {nodes["hero-cube"] && (
          <group
            ref={cubeRef}
            position={[0, 1.4, 0]}
            rotation={[0, Math.PI / 4, 0]}
          >
            <HolographicCube />
          </group>
        )}
      </group>

      {/* ════════════════════════════════════════════════════════════════
          Landscape group — model's ORIGINAL designed layout (no ad-hoc
          offsets / rotation). Combined terrain mesh placed at its baked
          transform forms the full mountain valley; water is a flat lake.
      ════════════════════════════════════════════════════════════════ */}
      {bgVisibleRef.current && (
        <group scale={scale}>
          {/* ── Reflective Water Lake (flat, fades out after 25%) ── */}
          {nodes.water && (
            <mesh ref={waterRef} geometry={nodes.water.geometry}>
              <MeshReflectorMaterial
                blur={[300, 90]}
                resolution={1024}
                mixBlur={0.5}
                mixStrength={4.5}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#0a1f4c"
                roughness={0.18}
                metalness={0.85}
                normalMap={waterNormalTex}
                normalScale={new THREE.Vector2(0.18, 0.18)}
                transparent={true}
                opacity={bgOpacityRef.current}
              />
            </mesh>
          )}

          {/* ── Full Mountain Valley (combined terrain at baked position) ── */}
          {nodes.terrain && (
            <mesh
              ref={terrainRef}
              geometry={nodes.terrain.geometry}
              position={[-29.378, 2.231, -4.334]}
            >
              <meshStandardMaterial
                color="#26467f"
                emissive="#143a73"
                emissiveIntensity={0.75}
                roughness={0.9}
                metalness={0.1}
                transparent={true}
                opacity={bgOpacityRef.current}
                normalMap={terrainNormalTex}
                normalScale={new THREE.Vector2(0.22, 0.22)}
              />
            </mesh>
          )}
        </group>
      )}
    </>
  )
}

useGLTF.preload('/models/scene_1.glb')
