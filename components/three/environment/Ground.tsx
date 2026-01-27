"use client";

import { useMemo } from "react";
import * as THREE from "three";

// Castle positions for path calculation
const CASTLE_POSITIONS = [
  { x: -25, z: -25, label: "Projects" },
  { x: 25, z: -25, label: "Skills" },
  { x: -30, z: 10, label: "About" },
  { x: 30, z: 10, label: "Contact" },
];

// Mud/dirt path color - brown/muddy color
const MUD_COLOR = {
  r: 0.45,
  g: 0.30,
  b: 0.15,
};

// Check if a point is on a path (for grass exclusion)
export function isOnPath(x: number, z: number): boolean {
  // Center area (fountain)
  const distFromCenter = Math.sqrt(x * x + z * z);
  if (distFromCenter < 4) return true;

  // Bridge path (from center to bridge at z=20)
  if (Math.abs(x) < 2.5 && z > 0 && z < 25) return true;

  // Paths to each castle (curving paths)
  for (const castle of CASTLE_POSITIONS) {
    const dx = castle.x - 0;
    const dz = castle.z - 0;

    // Check multiple points along the bezier curve path
    for (let t = 0; t <= 1; t += 0.02) {
      // Simple curved path calculation
      const curveX = t * castle.x + Math.sin(t * Math.PI) * (castle.x > 0 ? 3 : -3);
      const curveZ = t * castle.z;

      const distToPath = Math.sqrt((x - curveX) ** 2 + (z - curveZ) ** 2);
      if (distToPath < 2.5) return true;
    }
  }

  return false;
}

export default function RealisticGround() {
  // Create procedural texture-like appearance with vertex colors
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(200, 200, 256, 256);
    const positions = geo.attributes.position;
    const colors = new Float32Array(positions.count * 3);

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      // Flat ground - no height variation
      positions.setY(i, 0);

      // Check if this point is on a path
      const onPath = isOnPath(x, z);

      if (onPath) {
        // Mud/dirt path color - muddy brown (not green)
        const variation = Math.random() * 0.08;
        colors[i * 3] = MUD_COLOR.r + variation;       // R - muddy brown
        colors[i * 3 + 1] = MUD_COLOR.g + variation * 0.5; // G - less green
        colors[i * 3 + 2] = MUD_COLOR.b + variation * 0.3; // B - earthy
      } else {
        // Grassy green color - vibrant and filled - DARKER BASE
        const variation = Math.random() * 0.15;
        colors[i * 3] = 0.05 + variation * 0.2;       // R
        colors[i * 3 + 1] = 0.4 + variation * 0.4;    // G (Darker green)
        colors[i * 3 + 2] = 0.05 + variation * 0.2;   // B
      }
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []); // Dependency array

  // Create curved path meshes
  const createCurvedPath = (endX: number, endZ: number, width: number = 3) => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.02, 0),
      new THREE.Vector3(endX * 0.3 + (endX > 0 ? 5 : -5), 0.02, endZ * 0.5),
      new THREE.Vector3(endX, 0.02, endZ)
    );

    const points = curve.getPoints(30);
    const pathGeometry = new THREE.BufferGeometry();

    // Create a tube-like path
    const vertices: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const nextPoint = points[i + 1] || points[i];

      // Direction vector
      const dx = nextPoint.x - point.x;
      const dz = nextPoint.z - point.z;
      const len = Math.sqrt(dx * dx + dz * dz) || 1;

      // Perpendicular vector for width
      const px = -dz / len * width / 2;
      const pz = dx / len * width / 2;

      vertices.push(point.x + px, 0.02, point.z + pz);
      vertices.push(point.x - px, 0.02, point.z - pz);

      if (i < points.length - 1) {
        const idx = i * 2;
        indices.push(idx, idx + 1, idx + 2);
        indices.push(idx + 1, idx + 3, idx + 2);
      }
    }

    pathGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    pathGeometry.setIndex(indices);
    pathGeometry.computeVertexNormals();

    return pathGeometry;
  };

  return (
    <group>
      {/* Main ground - positioned at y=0 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#1a4d1a" // Deep rich green
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Bridge path (straight from center to bridge) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 12.5]} receiveShadow>
        <planeGeometry args={[4, 15]} />
        <meshStandardMaterial color="#6B5344" roughness={1} />
      </mesh>

      {/* Curved paths to each castle - MUD COLOR */}
      {CASTLE_POSITIONS.map((castle, i) => (
        <mesh
          key={i}
          geometry={createCurvedPath(castle.x * 0.9, castle.z * 0.9, 3.5)}
          receiveShadow
        >
          <meshStandardMaterial color="#6B5344" roughness={1} />
        </mesh>
      ))}

      {/* Center circular area around fountain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial color="#5C4A3D" roughness={1} />
      </mesh>

      {/* Decorative stone border around paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <ringGeometry args={[4.8, 5.2, 32]} />
        <meshStandardMaterial color="#696969" roughness={0.8} />
      </mesh>
    </group>
  );
}
