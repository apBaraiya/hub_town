import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SceneModel } from "./SceneModel";
import SkyBox from "./SkyBox";
import Particles from "./Particles";

export default function HeroScene() {
  return (
    <Canvas
      camera={{
        position: [0, -1, 32],
        fov: 45,
      }}
      gl={{
        antialias: true,
        toneMappingExposure: 1.0,
      }}
    >
      {/* Background & Starry Skybox */}
      <color attach="background" args={["#020617"]} />
      <SkyBox />

      {/* Fog to soften the horizon */}
      <fog attach="fog" args={["#020617", 40, 300]} />

      {/* Futuristic, low-ambient sci-fi lighting scheme */}
      <ambientLight intensity={0.15} />

      {/* Soft color highlights from the left and right */}
      <pointLight
        position={[-25, 10, -5]}
        color="#1d4ed8"
        intensity={35}
        distance={100}
      />
      <pointLight
        position={[25, 10, -5]}
        color="#1d4ed8"
        intensity={35}
        distance={100}
      />

      {/* Main highlight light pointing at the center cube */}
      <pointLight
        position={[0, 12, 10]}
        color="#4fc3ff"
        intensity={45}
        distance={60}
      />

      {/* Internal glow light centered at the cube's position [0, 0.5, -5.453]
          to cast vibrant reflections on the water below */}
      <pointLight
        position={[0, 0.5, -5.453]}
        color="#38bdf8"
        intensity={60}
        distance={25}
      />

      {/* Main 3D Models (Cube, reflective water, mountains) */}
      <SceneModel />

      {/* Starry floating particles */}
      <Particles />

      {/* Post Processing: Premium Bloom Glow */}
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </Canvas>
  );
}