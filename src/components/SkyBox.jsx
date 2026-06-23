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
      uColor1: { value: new THREE.Color("#0a1f5c") },
      uColor1Stop: { value: 1.0 },
      uColor2: { value: new THREE.Color("#06153a") },
      uColor2Stop: { value: 0.75 },
      uColor3: { value: new THREE.Color("#020617") },
      uColor3Stop: { value: 0.69 },
      uColor4: { value: new THREE.Color("#020617") },
      uColor4Stop: { value: 0.61 },
      tVoronoi: { value: voronoiTexture },
      uPixelRatio: { value: window.devicePixelRatio || 1 },
      uStarsThreshold: { value: 0.363 },
      uStarsStrength: { value: 2.0 },
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
