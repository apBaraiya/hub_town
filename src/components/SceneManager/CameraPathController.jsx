import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneAnimation } from './SceneAnimationController'
import { easeInOutCubic } from '../../utils/progress'

// Lerp helper for arrays/vectors
function lerp(start, end, t) {
  return start + (end - start) * t
}

// Target camera positions and target lookAt points at discrete scroll keyframes
const KEYFRAMES = [
  { progress: 0.00, position: [0, 0.5, 14], target: [0, 1.4, 0] },
  { progress: 0.25, position: [0, 0.5, 14], target: [0, 1.4, 0] },
  { progress: 0.50, position: [0, 0.5, 8],  target: [0, 1.7, 0] },
  { progress: 0.75, position: [0, 0.5, 4],  target: [0, 1.7, 0] },
  { progress: 1.00, position: [0, 0.5, 2],  target: [0, 1.5, 0] },
]

/**
 * CameraPathController
 * Smoothly interpolates camera position and lookAt target between scroll keyframes.
 * Includes delta-independent damping to avoid sudden jumps,
 * and skips frames on mobile devices to optimize GPU usage.
 *
 * @param {{ isMobileDevice: boolean }} props
 */
export default function CameraPathController({ isMobileDevice }) {
  const { camera } = useThree()
  const { progress } = useSceneAnimation()

  const targetPosRef = useRef(new THREE.Vector3(0, 0.5, 14))
  const targetLookRef = useRef(new THREE.Vector3(0, 1.4, 0))
  const currentPosRef = useRef(new THREE.Vector3(0, 0.5, 18)) // Start slightly offset for zoom-in glide on load
  const currentLookRef = useRef(new THREE.Vector3(0, 1.4, 0))
  const frameSkipClock = useRef(0)
  const isInitialized = useRef(false)

  useFrame((state, delta) => {
    // ── Mobile Frame Rate Reduction ──
    if (isMobileDevice) {
      frameSkipClock.current += delta
      if (frameSkipClock.current < 0.033) {
        // Skip frame to target ~30fps camera updates on mobile
        return
      }
      frameSkipClock.current = 0
    }

    const p = Math.min(1, Math.max(0, progress))

    // 1. Find active keyframe segment
    let startIdx = 0
    for (let i = 0; i < KEYFRAMES.length - 1; i++) {
      if (p >= KEYFRAMES[i].progress && p <= KEYFRAMES[i + 1].progress) {
        startIdx = i
        break
      }
    }

    const startKF = KEYFRAMES[startIdx]
    const endKF   = KEYFRAMES[startIdx + 1]

    // 2. Interpolation factor inside the current 25% zone
    const segmentProgress = (p - startKF.progress) / (endKF.progress - startKF.progress)
    const easedT = easeInOutCubic(segmentProgress)

    // 3. Calculate target coordinates
    const tx = lerp(startKF.position[0], endKF.position[0], easedT)
    const ty = lerp(startKF.position[1], endKF.position[1], easedT)
    const tz = lerp(startKF.position[2], endKF.position[2], easedT)
    targetPosRef.current.set(tx, ty, tz)

    const lx = lerp(startKF.target[0], endKF.target[0], easedT)
    const ly = lerp(startKF.target[1], endKF.target[1], easedT)
    const lz = lerp(startKF.target[2], endKF.target[2], easedT)
    targetLookRef.current.set(lx, ly, lz)

    // 4. Initialize or update with damping
    if (!isInitialized.current) {
      currentLookRef.current.copy(targetLookRef.current)
      camera.position.copy(currentPosRef.current)
      camera.lookAt(currentLookRef.current)
      isInitialized.current = true
    }

    // Delta-independent damping to maintain smoothing across different refresh rates (60Hz/120Hz/144Hz)
    const damping = isMobileDevice ? 0.08 : 0.05
    const lerpFactor = 1 - Math.exp(-damping * delta * 120)

    currentPosRef.current.lerp(targetPosRef.current, lerpFactor)
    currentLookRef.current.lerp(targetLookRef.current, lerpFactor)

    camera.position.copy(currentPosRef.current)
    camera.lookAt(currentLookRef.current)
  })

  return null
}
