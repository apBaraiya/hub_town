import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useKTX2 } from "@react-three/drei";
import { skyboxVertexShader, skyboxFragmentShader } from "./CubeShader";

export default function SkyBox() {
  const meshRef = useRef();
  const { size } = useThree();

  const voronoiTexture = useKTX2("/voronoi.ktx2");

  const uniforms = useMemo(
    () => ({
      // Horizon (brightest, bottom) → zenith (darkest, top)
      uColor1: { value: new THREE.Color("#2c548c") }, // horizon glow
      uColor1Stop: { value: 1.0 },
      uColor2: { value: new THREE.Color("#193a72") },
      uColor2Stop: { value: 0.80 },
      uColor3: { value: new THREE.Color("#0e2350") },
      uColor3Stop: { value: 0.64 },
      uColor4: { value: new THREE.Color("#081632") }, // zenith
      uColor4Stop: { value: 0.50 },
      tVoronoi: { value: voronoiTexture },
      uPixelRatio: { value: window.devicePixelRatio || 1 },
      uStarsThreshold: { value: 0.38 },
      uStarsStrength: { value: 1.6 },
      uStarsScale: { value: 18.2 },
      uRadius: { value: 300 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uTime: { value: 0 },
    }),
    [voronoiTexture]
  );

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.getElapsedTime();
      uniforms.uResolution.value.set(state.size.width, state.size.height);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      <sphereGeometry args={[300, 32, 32, 0, Math.PI, 0, Math.PI * 0.65]} />
      <shaderMaterial
        vertexShader={skyboxVertexShader}
        fragmentShader={skyboxFragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
