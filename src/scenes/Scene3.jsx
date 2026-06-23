import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneAnimation } from '../components/SceneManager/SceneAnimationController'
import { getLocalProgress, easeInOutCubic } from '../utils/progress'

/**
 * Scene3
 * Displays public/models/scene_3.glb with smooth scroll animation, 
 * idle motion, and fade transitions.
 *
 * @param {{ scale: number }} props
 */
export default function Scene3({ scale = 1 }) {
  const { scene } = useGLTF('/models/scene_3.glb')
  const groupRef = useRef()
  const materialsRef = useRef([])

  const { progress: globalProgress } = useSceneAnimation()
  const start = 0.50
  const end = 0.75

  const initialActive = globalProgress >= start && globalProgress < end
  const opacityRef = useRef(initialActive ? 1 : 0)
  const visibleRef = useRef(initialActive)

  // Center model and extract unique materials on load
  useEffect(() => {
    if (scene) {
      console.log('Scene 3 hierarchy:', scene)

      // Center model automatically at origin using Box3
      const box = new THREE.Box3().setFromObject(scene)
      const center = new THREE.Vector3()
      box.getCenter(center)
      scene.position.copy(center).multiplyScalar(-1)

      // Gather materials to control opacity centrally
      const materials = new Set()
      scene.traverse((child) => {
        if (child.isMesh) {
          // Optimization: Explicit frustum culling
          child.frustumCulled = true

          if (child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material]
            mats.forEach((mat) => {
              // Apply environmental reflections intensity
              mat.envMapIntensity = 1.5

              // Identify transparent glass or window surfaces
              const name = (mat.name || '').toLowerCase()
              const isGlass = name.includes('glass') || name.includes('window') || name.includes('transparent')

              let activeMat = mat
              if (isGlass) {
                if (mat.type !== 'MeshPhysicalMaterial') {
                  const prevColor = mat.color ? mat.color.clone() : new THREE.Color('#ffffff')
                  activeMat = new THREE.MeshPhysicalMaterial({
                    color: prevColor,
                    roughness: 0.1,
                    metalness: 0.1,
                    transparent: true,
                    opacity: opacityRef.current,
                    transmission: 0.9,
                    thickness: 1.5,
                    ior: 1.5,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.1,
                    envMapIntensity: 1.5,
                    depthWrite: false,
                  })
                  activeMat.name = mat.name

                  if (Array.isArray(child.material)) {
                    const idx = child.material.indexOf(mat)
                    child.material[idx] = activeMat
                  } else {
                    child.material = activeMat
                  }
                } else {
                  // Already MeshPhysicalMaterial, optimize it for glass reflections
                  mat.transmission = 0.9
                  mat.thickness = 1.5
                  mat.ior = 1.5
                  mat.roughness = 0.1
                  mat.metalness = 0.1
                  mat.clearcoat = 1.0
                  mat.clearcoatRoughness = 0.1
                  mat.transparent = true
                  mat.opacity = opacityRef.current
                  mat.depthWrite = false
                }
              } else {
                // Clamping standard materials to luxury ranges
                mat.transparent = true
                mat.opacity = opacityRef.current
                mat.metalness = Math.max(0.2, Math.min(0.5, mat.metalness !== undefined ? mat.metalness : 0.3))
                mat.roughness = Math.max(0.2, Math.min(0.6, mat.roughness !== undefined ? mat.roughness : 0.4))
              }
              materials.add(activeMat)
            })
          }
        }
      })
      materialsRef.current = Array.from(materials)

      // Apply initial visibility
      if (groupRef.current) {
        groupRef.current.visible = visibleRef.current
      }
    }
  }, [scene])

  // Clean up geometries and materials to avoid memory leaks
  useEffect(() => {
    return () => {
      if (scene) {
        scene.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose()
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose())
            } else {
              child.material.dispose()
            }
          }
        })
      }
    }
  }, [scene])

  useFrame((state, delta) => {
    if (!scene) return

    const isActive = globalProgress >= start && globalProgress < end

    // 1. Calculate opacity (fade transition)
    const targetOpacity = isActive ? 1 : 0
    if (opacityRef.current !== targetOpacity) {
      const step = delta / 0.5
      if (opacityRef.current < targetOpacity) {
        opacityRef.current = Math.min(targetOpacity, opacityRef.current + step)
      } else {
        opacityRef.current = Math.max(targetOpacity, opacityRef.current - step)
      }

      materialsRef.current.forEach((mat) => {
        mat.opacity = opacityRef.current
      })

      const nextVisible = opacityRef.current > 0
      if (visibleRef.current !== nextVisible) {
        visibleRef.current = nextVisible
        if (groupRef.current) {
          groupRef.current.visible = nextVisible
        }
      }
    }

    // Skip updating layout transformations if not visible
    if (!visibleRef.current) return

    // 2. Base animation driven by localized scroll progress
    const localP = getLocalProgress(globalProgress, start, end)
    const easedP = easeInOutCubic(localP)

    const rotationY = easedP * 0.8
    const positionY = easedP * -0.3
    const scaleVal = 1 + easedP * 0.10

    // 3. Idle motion scaled by current opacity to prevent jumps
    const time = state.clock.getElapsedTime()
    const idleRot = Math.sin(time) * 0.02 * opacityRef.current
    const idleY = Math.sin(time) * 0.03 * opacityRef.current

    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY + idleRot
      groupRef.current.position.y = positionY + idleY
      groupRef.current.scale.setScalar(scaleVal * scale)
    }
  })

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/scene_3.glb')

