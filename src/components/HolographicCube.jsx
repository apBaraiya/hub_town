import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF, useKTX2 } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { cubeVertexShader, cubeFragmentShader } from "./CubeShader";

const KTX2_TRANSCODER = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r154/examples/jsm/libs/basis/";

/**
 * HolographicCube
 * The glowing grid-textured crystal cube seen on the hero — rendered with the
 * project's custom holographic GLSL shader. Self-animating (uTime + built-in
 * rotation/reveal), so it keeps moving even when the page isn't being scrolled.
 *
 * Render it inside a <group> and animate that group for scroll-driven
 * scale / position / rotation.
 */
export default function HolographicCube(props) {
  const { nodes } = useGLTF("/models/scene_1.glb");

  const [gridTex, edgesTex, detailsTex, aoTex, noise1Tex, noise2Tex, revealPatternTex] =
    useKTX2(
      [
        "/hero-cube-grid.ktx2",
        "/hero-cube-edges.ktx2",
        "/hero-cube-details.ktx2",
        "/hero-cube-ao.ktx2",
        "/noise_1.ktx2",
        "/noise_2.ktx2",
        "/hero-cube-hex.ktx2",
      ],
      KTX2_TRANSCODER
    );

  // Texture wrapping
  useMemo(() => {
    [gridTex, edgesTex, detailsTex, aoTex, noise1Tex, noise2Tex, revealPatternTex].forEach((t) => {
      if (t) {
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
      }
    });
  }, [gridTex, edgesTex, detailsTex, aoTex, noise1Tex, noise2Tex, revealPatternTex]);

  const cubeUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      tGrid: { value: gridTex },
      tEdges: { value: edgesTex },
      tDetails: { value: detailsTex },
      tAO: { value: aoTex },
      uSize: { value: new THREE.Vector3(1, 1, 1) },
      tNoise1: { value: noise1Tex },
      tNoise2: { value: noise2Tex },
      tRevealPattern: { value: revealPatternTex },

      uBloomColor: { value: new THREE.Vector3(0, 0.27, 0.63) },
      uAoContrast: { value: 1.2 },
      uAoSmoothstep: { value: new THREE.Vector2(0, 0.74) },
      uContrast: { value: 1.25 },
      uGridTextureScale: { value: -0.27 },
      uGridTextureOffset: { value: new THREE.Vector2(1.32, 0) },
      uGridTextureContrast: { value: 0.1 },
      uGridTextureRemap: { value: new THREE.Vector2(0.4, 1) },
      uGridTextureStrength: { value: 1.5 },
      uGridEdgesContrast: { value: 1.58 },
      uGridEdgesThresholds: { value: new THREE.Vector2(0.79, 0.9) },
      uGridEdgesStrength: { value: 0.35 },
      uDetailsScale: { value: 0 },
      uDetailsContrast: { value: 2.6 },
      uDetailsStrength: { value: 3.43 },
      uEdgeColor: { value: new THREE.Color("#57a6b8") },
      uEdgeThickness: { value: 0.01 },
      uEdgeSmoothness: { value: 0.005 },
      uRotationSpeed: { value: -0.12 }, // continuous spin (independent of scroll)
      uVerticalMovementSpeed: { value: 0.7 },
      uVerticalMovementAmount: { value: 0.15 },
      uFresnelAmount: { value: 0.22 },
      uFresnelOffset: { value: 0.16 },
      uFresnelFalloff: { value: 1.0 },
      uFresnelAddition: { value: 3.0 },
      uNoiseTextureScale: { value: new THREE.Vector2(0.55, 0.13) },
      uNoiseTextureContrast: { value: 1.0 },
      uNoiseTextureRemap: { value: new THREE.Vector2(0, 1) },
      uNoiseTextureSpeed: { value: 0.01 },
      uNoiseTextureStrength: { value: 0.26 },
      uGradientNoiseScale: { value: new THREE.Vector2(3.55, 4.68) },
      uGradientNoiseSpeed: { value: 0.34 },
      uGradientColor1: { value: new THREE.Color("#000957") },
      uGradientColor2: { value: new THREE.Color("#1867a8") },
      uGradientColor3: { value: new THREE.Color("#6eb4ff") },
      uGradientNoiseContrast: { value: 1.13 },
      uGradientStep: { value: new THREE.Vector4(0, 0.29, 0.7, 0.99) },
      uGradientNoiseThresholds: { value: new THREE.Vector2(0, 1) },
      uExtraHighlightColor: { value: new THREE.Color("#3372ff") },
      uExtraHighlightSteps: { value: new THREE.Vector4(-0.15, 0.33, 0.52, 1.15) },
      uExtraHighlightStrength: { value: 1.0 },
      uRevealPatternScale: { value: new THREE.Vector2(4.0, 4.0) },
      uRevealPatternOffset: { value: new THREE.Vector2(0, 0) },
      uRevealPatternEdge: { value: new THREE.Vector2(0.4, 0.4) },
      uRevealGradientThresholds: { value: new THREE.Vector2(-0.12, 1.15) },
      uRevealSpeed: { value: 0.19 },
      uRevealPatternColor: { value: new THREE.Color("#3c9aff") },
      uRevealPatternStrength: { value: 2.0 },
    }),
    [gridTex, edgesTex, detailsTex, aoTex, noise1Tex, noise2Tex, revealPatternTex]
  );

  // Clone geometry, build tangents + uv1/uv2, set size uniform
  const cubeGeometry = useMemo(() => {
    if (!nodes?.["hero-cube"]) return null;
    const geom = nodes["hero-cube"].geometry.clone();
    if (!geom.attributes.uv1) geom.setAttribute("uv1", geom.attributes.uv.clone());
    if (!geom.attributes.uv2) geom.setAttribute("uv2", geom.attributes.uv.clone());
    geom.computeTangents();
    geom.computeBoundingBox();
    const size = new THREE.Vector3();
    geom.boundingBox.getSize(size);
    cubeUniforms.uSize.value.copy(size);
    return geom;
  }, [nodes, cubeUniforms]);

  useFrame((state) => {
    cubeUniforms.uTime.value = state.clock.getElapsedTime();
  });

  if (!cubeGeometry) return null;

  return (
    <mesh geometry={cubeGeometry} {...props}>
      <shaderMaterial
        vertexShader={cubeVertexShader}
        fragmentShader={cubeFragmentShader}
        uniforms={cubeUniforms}
        transparent
      />
    </mesh>
  );
}

useGLTF.preload("/models/scene_1.glb");
