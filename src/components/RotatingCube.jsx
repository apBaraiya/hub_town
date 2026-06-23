import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RotatingCube({ children }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;

    // Rotate only
    ref.current.rotation.y += 0.0015;
  });

  return <group ref={ref}>{children}</group>;
}