"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function RealisticGround() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create procedural texture-like appearance with vertex colors
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(200, 200, 128, 128);
    const positions = geo.attributes.position;
    const colors = new Float32Array(positions.count * 3);

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      // Create natural terrain variation
      const noise1 = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 0.3;
      const noise2 = Math.sin(x * 0.3 + z * 0.2) * 0.15;
      const height = noise1 + noise2;
      
      positions.setY(i, height);

      // Varied grass colors
      const variation = Math.random() * 0.15;
      const distFromCenter = Math.sqrt(x * x + z * z) / 100;
      
      // Base grass green with variation
      colors[i * 3] = 0.1 + variation * 0.5 + distFromCenter * 0.1; // R
      colors[i * 3 + 1] = 0.45 + variation + Math.random() * 0.1; // G
      colors[i * 3 + 2] = 0.1 + variation * 0.3; // B
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      {/* Main ground */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial
          vertexColors
          roughness={0.9}
          metalness={0.0}
          flatShading
        />
      </mesh>

      {/* Path to bridge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 15]} receiveShadow>
        <planeGeometry args={[4, 12]} />
        <meshStandardMaterial color="#8B7355" roughness={1} />
      </mesh>

      {/* Main path from bridge to center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 5]} receiveShadow>
        <planeGeometry args={[4, 10]} />
        <meshStandardMaterial color="#A0522D" roughness={1} />
      </mesh>

      {/* Paths to castles */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[12, 0.01, -10]} receiveShadow>
        <planeGeometry args={[3, 25]} />
        <meshStandardMaterial color="#8B7355" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 4]} position={[-12, 0.01, -10]} receiveShadow>
        <planeGeometry args={[3, 25]} />
        <meshStandardMaterial color="#8B7355" roughness={1} />
      </mesh>
    </group>
  );
}
