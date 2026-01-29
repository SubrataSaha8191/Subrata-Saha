"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useGameStore } from "@/store/useGameStore";
import { useCharacterStore, CharacterOutfit } from "@/store/useCharacterStore";

const MOVE_SPEED = 6;
const SPRINT_MULTIPLIER = 1.6;
const JUMP_FORCE = 8;
const GRAVITY = -20;
const GROUND_LEVEL = 0.9;

// Outfit color configurations
const outfitConfigs: Record<CharacterOutfit, {
  skin: string;
  primary: string;
  secondary: string;
  accent: string;
  hair: string;
  special?: string;
}> = {
  casual: {
    skin: "#FFCC99",
    primary: "#3B82F6",
    secondary: "#1E3A5F",
    accent: "#FFD700",
    hair: "#4A3728",
  },
  dinosaur: {
    skin: "#4CAF50",
    primary: "#388E3C",
    secondary: "#2E7D32",
    accent: "#FF5722",
    hair: "#4CAF50",
    special: "#FF9800",
  },
  rugby: {
    skin: "#FFCC99",
    primary: "#D32F2F",
    secondary: "#1565C0",
    accent: "#FFFFFF",
    hair: "#3E2723",
  },
  santa: {
    skin: "#FFCC99",
    primary: "#C62828",
    secondary: "#FFFFFF",
    accent: "#FFC107",
    hair: "#FFFFFF",
    special: "#B71C1C",
  },
  robot: {
    skin: "#78909C",
    primary: "#455A64",
    secondary: "#37474F",
    accent: "#00BCD4",
    hair: "#78909C",
    special: "#00E5FF",
  },
};

export default function RobloxCharacter() {
  const characterRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const setPlayerObject = useGameStore((s) => s.setPlayerObject);
  const cameraYaw = useGameStore((s) => s.cameraYaw);
  const cameraMode = useGameStore((s) => s.cameraMode);

  // Jump physics
  const velocityY = useGameStore((s) => s.velocityY);
  const setVelocityY = useGameStore((s) => s.setVelocityY);
  const isJumping = useGameStore((s) => s.isJumping);
  const setIsJumping = useGameStore((s) => s.setIsJumping);

  const currentOutfit = useCharacterStore((s) => s.currentOutfit);
  const colors = outfitConfigs[currentOutfit];

  // Key bindings
  const w = useKeyPress("KeyW");
  const s = useKeyPress("KeyS");
  const a = useKeyPress("KeyA");
  const d = useKeyPress("KeyD");
  const up = useKeyPress("ArrowUp");
  const down = useKeyPress("ArrowDown");
  const left = useKeyPress("ArrowLeft");
  const right = useKeyPress("ArrowRight");
  const shiftLeft = useKeyPress("ShiftLeft");
  const shiftRight = useKeyPress("ShiftRight");
  const space = useKeyPress("Space");

  const forward = w || up;
  const back = s || down;
  const moveLeft = a || left;
  const moveRight = d || right;
  const sprint = shiftLeft || shiftRight;

  const isMoving = forward || back || moveLeft || moveRight;
  const wasSpacePressed = useRef(false);

  useEffect(() => {
    if (characterRef.current) {
      setPlayerObject(characterRef.current);
    }
  }, [setPlayerObject]);

  useFrame((state, delta) => {
    const character = characterRef.current;
    if (!character) return;

    // HARD lock while sitting: Skills chair/Projects sofa/About sofa.
    // RobloxCharacter is the active movement controller, so we must stop movement here.
    const { sittingState, roomInteractionState } = useGameStore.getState();
    if (sittingState.isSitting) {
      const [x, y, z] = sittingState.seatPosition;
      character.position.set(x, y, z);
      // Stop jump + vertical motion while sitting
      if (isJumping) setIsJumping(false);
      if (velocityY !== 0) setVelocityY(0);
      setPlayerPosition([x, y, z]);
      return;
    }

    // Extra safety: block movement during interaction states
    if (roomInteractionState !== "none") {
      setPlayerPosition([character.position.x, character.position.y, character.position.z]);
      return;
    }

    const speed = MOVE_SPEED * (sprint ? SPRINT_MULTIPLIER : 1);
    const time = state.clock.getElapsedTime();

    // Handle jump - only when stationary
    if (space && !wasSpacePressed.current && !isJumping && !isMoving) {
      setVelocityY(JUMP_FORCE);
      setIsJumping(true);
    }
    wasSpacePressed.current = space;

    // Apply gravity and update position
    if (isJumping || character.position.y > GROUND_LEVEL) {
      const newVelocityY = velocityY + GRAVITY * delta;
      setVelocityY(newVelocityY);
      character.position.y += newVelocityY * delta;

      // Check if landed
      if (character.position.y <= GROUND_LEVEL) {
        character.position.y = GROUND_LEVEL;
        setVelocityY(0);
        setIsJumping(false);
      }
    }

    // Calculate input direction in local space
    const inputX = (moveRight ? 1 : 0) - (moveLeft ? 1 : 0);
    const inputZ = (back ? 1 : 0) - (forward ? 1 : 0);

    // Only allow movement if NOT jumping
    if (!isJumping && (inputX !== 0 || inputZ !== 0)) {
      // Create direction vector relative to camera yaw
      const dir = new THREE.Vector3(inputX, 0, inputZ);
      dir.normalize();

      // Rotate direction by camera yaw to make movement relative to camera view
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraYaw);

      // Move character
      character.position.addScaledVector(dir, speed * delta);

      // Smooth rotation to face movement direction
      const angle = Math.atan2(dir.x, dir.z);
      const targetQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, angle, 0)
      );
      character.quaternion.slerp(targetQuat, 0.15);
    }

    // Walking animation (only when not jumping)
    if (!isJumping) {
      if (isMoving) {
        const walkSpeed = sprint ? 12 : 8;
        const swing = Math.sin(time * walkSpeed) * 0.5;

        if (leftArmRef.current) leftArmRef.current.rotation.x = swing;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;
        if (leftLegRef.current) leftLegRef.current.rotation.x = -swing;
        if (rightLegRef.current) rightLegRef.current.rotation.x = swing;

        // Bobbing only when on ground - Reduced to be subtle
        if (!isJumping) {
          // Gentle sway, not a bounce
          character.position.y = GROUND_LEVEL + Math.sin(time * walkSpeed) * 0.03;
        }
      } else {
        // Idle pose
        if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
        if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
        if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
        if (rightLegRef.current) rightLegRef.current.rotation.x = 0;

        // Subtle breathing
        if (character.position.y <= GROUND_LEVEL) {
          character.position.y = GROUND_LEVEL + Math.sin(time * 2) * 0.02;
        }
      }
    } else {
      // Jump pose - arms and legs slightly spread
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.5;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0.2;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0.2;
    }

    setPlayerPosition([
      character.position.x,
      character.position.y,
      character.position.z,
    ]);
  });

  // Render special outfit features
  const renderOutfitSpecials = () => {
    switch (currentOutfit) {
      case "dinosaur":
        return (
          <>
            {/* Dinosaur spikes on back */}
            {[0, 0.25, 0.5].map((offset, i) => (
              <mesh key={i} position={[0, 0.7 - offset * 0.3, -0.35 - offset * 0.1]} rotation={[0.3, 0, 0]}>
                <coneGeometry args={[0.12 - offset * 0.03, 0.25 - offset * 0.05, 4]} />
                <meshStandardMaterial color={colors.special} />
              </mesh>
            ))}
            {/* Tail */}
            <mesh position={[0, 0.1, -0.5]} rotation={[0.5, 0, 0]}>
              <coneGeometry args={[0.15, 0.6, 8]} />
              <meshStandardMaterial color={colors.primary} />
            </mesh>
          </>
        );
      case "santa":
        return (
          <>
            {/* Santa hat */}
            <mesh position={[0, 1.85, 0]}>
              <coneGeometry args={[0.35, 0.6, 16]} />
              <meshStandardMaterial color={colors.special} />
            </mesh>
            {/* Hat pom-pom */}
            <mesh position={[0.15, 2.15, 0.1]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Belt */}
            <mesh position={[0, 0.4, 0.26]}>
              <boxGeometry args={[0.4, 0.15, 0.02]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>
          </>
        );
      case "robot":
        return (
          <>
            {/* Antenna */}
            <mesh position={[0, 1.95, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
              <meshStandardMaterial color="#455A64" />
            </mesh>
            <mesh position={[0, 2.15, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color={colors.special}
                emissive={colors.special}
                emissiveIntensity={1}
              />
            </mesh>
            {/* Chest panel */}
            <mesh position={[0, 0.7, 0.27]}>
              <boxGeometry args={[0.4, 0.3, 0.02]} />
              <meshStandardMaterial color="#263238" />
            </mesh>
            {/* LED lights on chest */}
            {[-0.1, 0, 0.1].map((x, i) => (
              <mesh key={i} position={[x, 0.7, 0.29]}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshStandardMaterial
                  color={i === 1 ? "#00FF00" : colors.accent}
                  emissive={i === 1 ? "#00FF00" : colors.accent}
                  emissiveIntensity={0.8}
                />
              </mesh>
            ))}
          </>
        );
      case "rugby":
        return (
          <>
            {/* Rugby helmet */}
            <mesh position={[0, 1.75, 0]}>
              <sphereGeometry args={[0.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#1565C0" />
            </mesh>
            {/* Shoulder pads */}
            <mesh position={[-0.55, 0.85, 0]}>
              <sphereGeometry args={[0.22, 8, 8]} />
              <meshStandardMaterial color={colors.secondary} />
            </mesh>
            <mesh position={[0.55, 0.85, 0]}>
              <sphereGeometry args={[0.22, 8, 8]} />
              <meshStandardMaterial color={colors.secondary} />
            </mesh>
            {/* Jersey number */}
            <mesh position={[0, 0.65, 0.27]}>
              <boxGeometry args={[0.25, 0.35, 0.01]} />
              <meshStandardMaterial color={colors.accent} />
            </mesh>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={characterRef} position={[0, 0.9, 22]} castShadow visible={cameraMode === "tpp"}>
      {/* Head - now using sphere for curved look */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={colors.skin} />
      </mesh>

      {/* Face */}
      {/* Eyes */}
      <mesh position={[-0.12, 1.45, 0.32]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={currentOutfit === "robot" ? colors.accent : "#333"} />
      </mesh>
      <mesh position={[0.12, 1.45, 0.32]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={currentOutfit === "robot" ? colors.accent : "#333"} />
      </mesh>
      {/* Eye highlights */}
      <mesh position={[-0.1, 1.47, 0.38]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.14, 1.47, 0.38]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Smile/Mouth */}
      {currentOutfit !== "robot" ? (
        <mesh position={[0, 1.28, 0.32]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ) : (
        <mesh position={[0, 1.28, 0.35]}>
          <boxGeometry args={[0.15, 0.03, 0.01]} />
          <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* Hair - conditional based on outfit */}
      {currentOutfit !== "robot" && currentOutfit !== "dinosaur" && (
        <>
          <mesh position={[0, 1.7, 0]} castShadow>
            <sphereGeometry args={[0.42, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={colors.hair} />
          </mesh>
          <mesh position={[0, 1.5, -0.25]} castShadow>
            <sphereGeometry args={[0.35, 12, 8]} />
            <meshStandardMaterial color={colors.hair} />
          </mesh>
        </>
      )}

      {/* Torso - using capsule for curved body */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.4, 8, 16]} />
        <meshStandardMaterial color={colors.primary} />
      </mesh>

      {/* Shirt accent */}
      <mesh position={[0, 0.85, 0.26]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color={colors.accent} />
      </mesh>

      {/* Left Arm - capsule geometry */}
      <group ref={leftArmRef} position={[-0.5, 0.75, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.35, 6, 12]} />
          <meshStandardMaterial color={colors.primary} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.55, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={colors.skin} />
        </mesh>
      </group>

      {/* Right Arm - capsule geometry */}
      <group ref={rightArmRef} position={[0.5, 0.75, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.35, 6, 12]} />
          <meshStandardMaterial color={colors.primary} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.55, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={colors.skin} />
        </mesh>
      </group>

      {/* Left Leg - capsule geometry */}
      <group ref={leftLegRef} position={[-0.15, 0.1, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.35, 6, 12]} />
          <meshStandardMaterial color={colors.secondary} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.65, 0.05]} castShadow>
          <boxGeometry args={[0.2, 0.12, 0.3]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Right Leg - capsule geometry */}
      <group ref={rightLegRef} position={[0.15, 0.1, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.35, 6, 12]} />
          <meshStandardMaterial color={colors.secondary} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.65, 0.05]} castShadow>
          <boxGeometry args={[0.2, 0.12, 0.3]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Render outfit-specific features */}
      {renderOutfitSpecials()}
    </group>
  );
}
