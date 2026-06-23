import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useGLTF, useKTX2, Reflector } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { cubeVertexShader, cubeFragmentShader } from "./CubeShader";

export function SceneModel(props) {
  const { nodes } = useGLTF("/scene_1.glb");

  const cubeRef = useRef();

  // Load KTX2 Textures
  const [
    gridTex,
    edgesTex,
    detailsTex,
    aoTex,
    noise1Tex,
    noise2Tex,
    revealPatternTex,
    terrainNormalTex,
    waterNormalTex,
  ] = useKTX2([
    "/hero-cube-grid.ktx2",
    "/hero-cube-edges.ktx2",
    "/hero-cube-details.ktx2",
    "/hero-cube-ao.ktx2",
    "/noise_1.ktx2",
    "/noise_2.ktx2",
    "/hero-cube-hex.ktx2",
    "/terrain_normal.ktx2",
    "/water-normal.ktx2",
  ]);

  // Setup Texture Wrapping and Properties
  useMemo(() => {
    const textures = [
      gridTex,
      edgesTex,
      detailsTex,
      aoTex,
      noise1Tex,
      noise2Tex,
      revealPatternTex,
      terrainNormalTex,
      waterNormalTex,
    ];
    textures.forEach((tex) => {
      if (tex) {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
      }
    });

    if (terrainNormalTex) {
      terrainNormalTex.repeat.set(20, 20);
    }
    if (waterNormalTex) {
      waterNormalTex.repeat.set(4, 4);
    }
  }, [
    gridTex,
    edgesTex,
    detailsTex,
    aoTex,
    noise1Tex,
    noise2Tex,
    revealPatternTex,
    terrainNormalTex,
    waterNormalTex,
  ]);

  // Define Holographic Cube Shader Uniforms
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
      uRotationSpeed: { value: -0.1 },
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
    [
      gridTex,
      edgesTex,
      detailsTex,
      aoTex,
      noise1Tex,
      noise2Tex,
      revealPatternTex,
    ]
  );

  // Clone Geometry, compute tangents/bounds and update size uniform
  const cubeGeometry = useMemo(() => {
    if (!nodes["hero-cube"]) return null;
    const geom = nodes["hero-cube"].geometry.clone();

    // Ensure uv1 and uv2 exist as attributes for our custom shader
    if (!geom.attributes.uv1) {
      geom.setAttribute("uv1", geom.attributes.uv.clone());
    }
    if (!geom.attributes.uv2) {
      geom.setAttribute("uv2", geom.attributes.uv.clone());
    }

    geom.computeTangents();
    geom.computeBoundingBox();

    const size = new THREE.Vector3();
    geom.boundingBox.getSize(size);
    cubeUniforms.uSize.value.copy(size);

    return geom;
  }, [nodes, cubeUniforms]);

  // Frame Updates (Time and Water Distortion)
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // Update cube time uniform
    if (cubeUniforms) {
      cubeUniforms.uTime.value = elapsed;
    }

    // Animate water normal map offsets to create flow/distortion ripples
    if (waterNormalTex) {
      const speed = 0.015;
      waterNormalTex.offset.set(elapsed * speed, elapsed * speed * 0.8);
    }
  });

  return (
    <group {...props} rotation={[0, Math.PI, 0]}>
      {/* Holographic Cube */}
      {cubeGeometry && (
        <mesh
          ref={cubeRef}
          geometry={cubeGeometry}
          position={[0, 0.5, -5.453]}
          rotation={[0, Math.PI / 4, 0]}
          scale={1.05}
        >
          <shaderMaterial
            vertexShader={cubeVertexShader}
            fragmentShader={cubeFragmentShader}
            uniforms={cubeUniforms}
          />
        </mesh>
      )}

      {/* Reflective Water Surface */}
      <Reflector
        geometry={nodes.water.geometry}
        position={[-29.378, 2.231, -4.334]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={1.232}
        resolution={1024}
        mirror={0.65}
        mixBlur={1.0}
        mixStrength={1.5}
        depthScale={1.2}
        minDepthThreshold={0.7}
        maxDepthThreshold={1.3}
        color="#040b1a"
        roughness={0.1}
        metalness={0.9}
        normalMap={waterNormalTex}
        normalScale={new THREE.Vector2(2.5, 2.5)}
      />

      {/* Terrains styled to match live site's deep blue hues */}
      <mesh
        geometry={nodes.terrain_right.geometry}
        position={[-29.378, 2.231, -4.334]}
      >
        <meshPhysicalMaterial
          color={new THREE.Color(0, 0.0235, 0.627)} // #0006a0
          emissive={new THREE.Color(0.0549, 0.0549, 0.141)} // #0e0e24
          emissiveIntensity={1.0}
          roughness={0.8}
          metalness={0.2}
          normalMap={terrainNormalTex}
          normalScale={new THREE.Vector2(1.5, 1.5)}
        />
      </mesh>

      <mesh
        geometry={nodes.terrain_left.geometry}
        position={[-29.378, 2.231, -4.334]}
      >
        <meshPhysicalMaterial
          color={new THREE.Color(0, 0.0235, 0.627)}
          emissive={new THREE.Color(0.0549, 0.0549, 0.141)}
          emissiveIntensity={1.0}
          roughness={0.8}
          metalness={0.2}
          normalMap={terrainNormalTex}
          normalScale={new THREE.Vector2(1.5, 1.5)}
        />
      </mesh>

      <mesh
        geometry={nodes.terrain.geometry}
        position={[-29.378, 2.231, -4.334]}
      >
        <meshPhysicalMaterial
          color={new THREE.Color(0, 0.0235, 0.627)}
          emissive={new THREE.Color(0.0549, 0.0549, 0.141)}
          emissiveIntensity={1.0}
          roughness={0.8}
          metalness={0.2}
          normalMap={terrainNormalTex}
          normalScale={new THREE.Vector2(1.5, 1.5)}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/scene_1.glb");
