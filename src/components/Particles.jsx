import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Particles() {
  const pointsRef = useRef();

  const particleCount = 2000;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = elapsed * 0.012;
    pointsRef.current.rotation.x = elapsed * 0.005;
    pointsRef.current.position.y = Math.sin(elapsed * 0.3) * 0.15; // slow floating wave
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>

      <pointsMaterial size={0.005} color="#6ab7ff" transparent opacity={0.35} sizeAttenuation={true} />
    </points>
  );
}
