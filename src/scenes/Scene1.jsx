import { useEffect, useRef, useMemo } from 'react'
import { useGLTF, MeshReflectorMaterial, useKTX2 } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneAnimation } from '../components/SceneManager/SceneAnimationController'
import { getLocalProgress, easeInOutCubic } from '../utils/progress'

// Set CDN path for KTX2 loader transcoder
useKTX2.setTranscoderPath("https://cdn.jsdelivr.net/gh/mrdoob/three.js@r154/examples/jsm/libs/basis/");

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
  const terrainRightRef = useRef()
  const terrainLeftRef = useRef()
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
  ])

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
      const refs = [cubeRef, waterRef, terrainRightRef, terrainLeftRef]
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

      // Update cube opacity
      if (cubeRef.current) {
        const outerMat = cubeRef.current.material
        const innerMat = cubeRef.current.children[0]?.material
        if (outerMat) {
          outerMat.opacity = opacityRef.current
          outerMat.transparent = true
        }
        if (innerMat) {
          innerMat.opacity = opacityRef.current * 0.85
          innerMat.transparent = true
        }
      }

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
        terrainRightRef.current?.material,
        terrainLeftRef.current?.material,
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

    if (localP < 0.25) {
      // SECTION 1 (progress 0 → 25%)
      scaleVal = 1.0
      rotX = 0.0
      rotY = 0.0
      posY = 1.4
      emissiveInt = 0.6
      lightInt = 25
    } else if (localP < 0.50) {
      // SECTION 2 (progress 25 → 50%)
      const t = (localP - 0.25) / 0.25
      const easedT = easeInOutCubic(t)
      scaleVal = 1.0 + easedT * 1.5 // 1.0 -> 2.5
      rotY = easedT * (Math.PI / 2) // 0 -> 90deg
      rotX = easedT * (15 * Math.PI / 180) // 0 -> 15deg
      posY = 1.4 + easedT * 0.3 // 1.4 -> 1.7
      emissiveInt = 0.6 + easedT * 0.9 // 0.6 -> 1.5
      lightInt = 25 + easedT * 25 // 25 -> 50
    } else if (localP < 0.75) {
      // SECTION 3 (progress 50 → 75%)
      const t = (localP - 0.50) / 0.25
      const easedT = easeInOutCubic(t)
      scaleVal = 2.5 + easedT * 2.5 // 2.5 -> 5.0
      rotY = (Math.PI / 2) + easedT * (Math.PI / 2) // 90deg -> 180deg
      rotX = 15 * Math.PI / 180
      posY = 1.7
      emissiveInt = 1.5 + easedT * 1.5 // 1.5 -> 3.0
      lightInt = 50 + easedT * 25 // 50 -> 75
    } else {
      // SECTION 4 (progress 75 → 100%)
      const t = (localP - 0.75) / 0.25
      const easedT = easeInOutCubic(t)
      scaleVal = 5.0 + easedT * 3.0 // 5.0 -> 8.0
      rotY = Math.PI + easedT * Math.PI // 180deg -> 360deg
      rotX = (1.0 - easedT) * (15 * Math.PI / 180) // 15deg -> 0deg
      posY = 1.7 - easedT * 0.2 // 1.7 -> 1.5
      emissiveInt = 3.0 + easedT * 2.0 // 3.0 -> 5.0
      lightInt = 75 + easedT * 25 // 75 -> 100
    }

    // 5. Subtle idle floating motion
    const idleRot = Math.sin(elapsed) * 0.015 * opacityRef.current
    const idleY = Math.sin(elapsed * 0.8) * 0.02 * opacityRef.current

    if (cubeRef.current) {
      cubeRef.current.scale.setScalar(scaleVal)
      cubeRef.current.position.y = posY + idleY
      cubeRef.current.rotation.y = rotY + idleRot + Math.PI / 4
      cubeRef.current.rotation.x = rotX

      // Intensify emissive glow on cube materials as they approach
      const outerMat = cubeRef.current.material
      const innerMat = cubeRef.current.children[0]?.material
      if (outerMat) {
        outerMat.emissiveIntensity = emissiveInt * 0.6
      }
      if (innerMat) {
        innerMat.emissiveIntensity = emissiveInt * 3.0
      }
    }

    // Update inner light intensity dynamically
    if (pointLightRef.current) {
      pointLightRef.current.intensity = lightInt
      pointLightRef.current.position.y = posY + idleY
    }
  })

  return (
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

          {/* Left/Right rim pointLights (fade out as background mountains fade out) */}
          {bgVisibleRef.current && (
            <>
              <pointLight
                position={[-18, 8, -8]}
                color="#0066ff"
                intensity={45 * bgOpacityRef.current}
                distance={80}
                decay={1.2}
              />
              <pointLight
                position={[18, 8, -8]}
                color="#0066ff"
                intensity={45 * bgOpacityRef.current}
                distance={80}
                decay={1.2}
              />
            </>
          )}
        </>
      )}

      {/* ── Glowing Glass Crystal Cube (Always Visible) ── */}
      {nodes["hero-cube"] && (
        <mesh
          ref={cubeRef}
          geometry={nodes["hero-cube"].geometry}
          position={[0, 1.4, 0]}
          rotation={[0, Math.PI / 4, 0]}
          scale={1.0}
        >
          {/* Outer Glass Mesh */}
          <meshPhysicalMaterial
            color="#020822"
            transmission={1.0}
            roughness={0.0}
            metalness={0.0}
            ior={1.5}
            thickness={2.0}
            transparent={true}
            opacity={opacityRef.current}
            depthWrite={false}
          />
          {/* Inner Glowing Core */}
          <mesh scale={0.75}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#020617"
              emissive="#00b4ff"
              emissiveIntensity={3.0}
              transparent={true}
              opacity={opacityRef.current * 0.85}
            />
          </mesh>
        </mesh>
      )}

      {/* ── Reflective Water Surface (Fades out after 25%) ── */}
      {nodes.water && bgVisibleRef.current && (
        <mesh
          ref={waterRef}
          geometry={nodes.water.geometry}
          position={[-29.378, 2.231, 1.119]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={5.0}
        >
          <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={512}
            mixBlur={0.2}
            mixStrength={2.0}
            depthScale={1.0}
            minDepthThreshold={0.5}
            maxDepthThreshold={1.3}
            color="#010617"
            roughness={0.05}
            metalness={0.9}
            normalMap={waterNormalTex}
            normalScale={new THREE.Vector2(0.06, 0.06)}
            transparent={true}
            opacity={bgOpacityRef.current}
          />
        </mesh>
      )}

      {/* ── Stylized Navy Landscapes (Fade out after 25%) ── */}
      {nodes.terrain_right && bgVisibleRef.current && (
        <mesh
          ref={terrainRightRef}
          geometry={nodes.terrain_right.geometry}
          position={[-29.378 - 4.2, 2.231, 1.119]}
        >
          <meshStandardMaterial
            color="#020617"
            roughness={0.8}
            metalness={0.2}
            transparent={true}
            opacity={bgOpacityRef.current}
            normalMap={terrainNormalTex}
            normalScale={new THREE.Vector2(0.08, 0.08)}
          />
        </mesh>
      )}

      {nodes.terrain_left && bgVisibleRef.current && (
        <mesh
          ref={terrainLeftRef}
          geometry={nodes.terrain_left.geometry}
          position={[-29.378 + 4.2, 2.231, 1.119]}
        >
          <meshStandardMaterial
            color="#020617"
            roughness={0.8}
            metalness={0.2}
            transparent={true}
            opacity={bgOpacityRef.current}
            normalMap={terrainNormalTex}
            normalScale={new THREE.Vector2(0.08, 0.08)}
          />
        </mesh>
      )}
    </group>
  )
}

useGLTF.preload('/models/scene_1.glb')
