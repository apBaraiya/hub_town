import { Environment, Lightformer } from '@react-three/drei'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { EffectComposer, Bloom, DepthOfField, Vignette, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

// Scene files
import Scene1 from '../../scenes/Scene1'
import Scene2 from '../../scenes/Scene2'
import Scene3 from '../../scenes/Scene3'
import Scene4 from '../../scenes/Scene4'
import CameraPathController from './CameraPathController'
import SkyBox from '../SkyBox'
import Particles from '../Particles'

// Initialize RectAreaLight shader uniforms once
RectAreaLightUniformsLib.init()

// ── Configuration Constants ────────────────────────────────────────────────
const DEBUG = false
const MODEL_SCALE = 1

/**
 * SceneManager
 * Coordinates loading, mounting, scaling, and lifecycle of all
 * four GLB scenes driven by overall scroll progress.
 * Renders cinematic studio lighting and camera/rendering post-effects.
 *
 * @param {{ isMobileDevice: boolean }} props
 */
export default function SceneManager({ isMobileDevice }) {
  return (
    <>
      {/* ── Environment Background & Fog ── */}
      {/* Base colour matches the sky horizon so the dome seam is invisible */}
      <color attach="background" args={["#0d2350"]} />
      <fogExp2 attach="fog" color="#11295a" density={0.0085} />

      {/* Camera Path Controller (interpolates keyframes based on progress) */}
      <CameraPathController isMobileDevice={isMobileDevice} />

      {/* Starry SkyBox & Ambient Particles */}
      <SkyBox />
      <Particles />

      {/* ── Cinematic Studio Lighting ── */}
      {/* Soft ambient lighting for filling shadows (lifted so geometry reads) */}
      <ambientLight intensity={0.18} />

      {/* Key Light (Cinematic Moon) casting high-quality soft shadows */}
      <directionalLight
        position={[8, 15, 8]}
        intensity={0.55}
        color="#6f9bff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0002}
        shadow-radius={6} // Software blur radius for PCFShadowMap
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 50]} />
      </directionalLight>

      {/* Cool moonlight rim — grazes the mountain slopes from the upper-left to
          give the snow-lit / cyan highlight look (cube is a shader, unaffected) */}
      <directionalLight position={[-7, 11, 5]} intensity={0.9} color="#8fb6ff" />
      {/* Dim cyan fill from the opposite side so both ridges read with depth */}
      <directionalLight position={[6, 6, -4]} intensity={0.35} color="#3f74d6" />

      {/* Self-contained night environment (no remote HDR fetch) — provides
          subtle cool reflections on the water/metallic surfaces */}
      <Environment resolution={256} environmentIntensity={0.3}>
        <Lightformer intensity={0.6} color="#1b3a7a" position={[0, 6, -6]} scale={[12, 12, 1]} />
        <Lightformer intensity={0.25} color="#0a1730" position={[0, -3, 6]} scale={[12, 12, 1]} />
        <Lightformer intensity={0.9} color="#6f9bff" form="ring" position={[-5, 4, 3]} scale={2.5} />
        <Lightformer intensity={0.5} color="#3f74d6" form="ring" position={[5, 3, -3]} scale={2} />
      </Environment>

      {/* ── Debug Helpers ── */}
      {DEBUG && (
        <>
          <axesHelper args={[5]} />
          <gridHelper args={[20, 20, '#c9a96e', '#222222']} />
        </>
      )}

      {/* ── Scenes ── */}
      <Scene1 scale={MODEL_SCALE} />
      <Scene2 scale={MODEL_SCALE} />
      <Scene3 scale={MODEL_SCALE} />
      <Scene4 scale={MODEL_SCALE} />

      {/* ── Post-Processing composition ── */}
      <EffectComposer disableNormalPass={true}>
        {/* Cinematic depth of field focusing on the active model center at origin */}
        <DepthOfField
          target={[0, 0.5, 0]}
          focalLength={isMobileDevice ? 0.005 : 0.02}
          bokehScale={isMobileDevice ? 0.5 : 1.5}
          height={480}
        />
        {/* Soft bloom highlighting glowing meshes */}
        <Bloom
          luminanceThreshold={0.7}
          luminanceSmoothing={0.9}
          intensity={0.5}
          mipmapBlur
        />
        {/* Subtle camera vignette shading */}
        <Vignette
          eskil={false}
          offset={0.35}
          darkness={0.65}
        />
        {/* Premium filmic tone mapper */}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  )
}
