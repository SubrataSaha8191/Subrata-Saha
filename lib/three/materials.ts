import * as THREE from "three";

export function createBasicBlockMaterial(color: string) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.95,
    metalness: 0.0,
  });
}