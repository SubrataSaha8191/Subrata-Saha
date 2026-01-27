"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useGameStore } from "@/store/useGameStore";
import { useUIStore } from "@/store/useUIStore";
import Portal from "../interactables/Portal";
import { projects } from "@/data/projects";
import { useRouter } from "next/navigation";

// Room dimensions
const ROOM_WIDTH = 12;
const ROOM_DEPTH = 14;
const ROOM_HEIGHT = 4;
const WALL_COLOR = "#FFE4C4"; // Peach color
const WALL_PATTERN_COLOR = "#FFD4A4";

// Sofa component
function Sofa({ position, rotation = [0, 9.5, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Sofa base/seat */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[2.5, 0.4, 1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      {/* Sofa back */}
      <mesh castShadow receiveShadow position={[0, 0.8, -0.4]}>
        <boxGeometry args={[2.5, 0.9, 0.2]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      {/* Left armrest */}
      <mesh castShadow receiveShadow position={[-1.15, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.5, 1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      {/* Right armrest */}
      <mesh castShadow receiveShadow position={[1.15, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.5, 1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      {/* Cushions */}
      {[-0.7, 0, 0.7].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.55, 0]}>
          <boxGeometry args={[0.65, 0.15, 0.8]} />
          <meshStandardMaterial color="#CD853F" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

// Coffee Table component
function CoffeeTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Table top */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.6]} />
        <meshStandardMaterial color="#4a3728" roughness={0.7} />
      </mesh>
      {/* Table legs */}
      {[
        [-0.5, 0.2, -0.2],
        [0.5, 0.2, -0.2],
        [-0.5, 0.2, 0.2],
        [0.5, 0.2, 0.2],
      ].map((pos, i) => (
        <mesh key={i} castShadow position={pos as [number, number, number]}>
          <boxGeometry args={[0.08, 0.36, 0.08]} />
          <meshStandardMaterial color="#3a2718" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// Remote Control component
function Remote({ position, isPickedUp }: { position: [number, number, number]; isPickedUp: boolean }) {
  if (isPickedUp) return null;
  
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.15, 0.03, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      {/* Buttons */}
      {[[-0.03, 0.018, 0], [0.03, 0.018, 0]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.01, 0.01, 0.01, 8]} />
          <meshStandardMaterial color={i === 0 ? "#ff0000" : "#00ff00"} />
        </mesh>
      ))}
    </group>
  );
}

// TV component
function TV({ position, isOn, currentProject }: { position: [number, number, number]; isOn: boolean; currentProject: number }) {
  const project = projects[currentProject] || projects[0];
  
  return (
    <group position={position}>
      {/* TV frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 1.8, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      {/* TV screen */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[2.7, 1.5]} />
        <meshStandardMaterial 
          color={isOn ? "#111111" : "#050505"} 
          emissive={isOn ? "#222244" : "#000000"}
          emissiveIntensity={isOn ? 0.3 : 0}
        />
      </mesh>
      {/* TV stand mount */}
      <mesh castShadow position={[0, -1.1, 0.1]}>
        <boxGeometry args={[0.3, 0.4, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
}

// Wall with decorative pattern
function DecorativeWall({ position, size, rotation = [0, 0, 0] }: { 
  position: [number, number, number]; 
  size: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main wall */}
      <mesh receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      {/* Decorative pattern - horizontal stripes */}
      {[-1.2, 0, 1.2].map((y, i) => (
        <mesh key={i} position={[0, y, size[2] / 2 + 0.01]}>
          <planeGeometry args={[size[0] - 0.2, 0.15]} />
          <meshStandardMaterial color={WALL_PATTERN_COLOR} />
        </mesh>
      ))}
    </group>
  );
}

// Wooden Door component
function WoodenDoor({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const router = useRouter();
  const playerPos = useGameStore((s) => s.playerPosition);
  const setPrompt = useUIStore((s) => s.setInteractionPrompt);
  const exitRoom = useGameStore((s) => s.exitRoom);
  const pressE = useKeyPress("KeyE");
  const lastERef = useRef(false);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);

  useFrame(() => {
    // Only allow exit when not interacting
    if (roomInteractionState !== "none") return;

    const playerVec = new THREE.Vector3(...playerPos);
    const doorVec = new THREE.Vector3(...position);
    const dist = playerVec.distanceTo(doorVec);

    const justPressedE = pressE && !lastERef.current;
    lastERef.current = pressE;

    if (dist < 3) {
      setPrompt("Press E to exit room");
      if (justPressedE) {
        exitRoom();
        router.push("/");
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Door frame */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 3.5, 0.15]} />
        <meshStandardMaterial color="#3a2718" roughness={0.8} />
      </mesh>
      {/* Door panels */}
      <mesh castShadow position={[0, 1.2, 0.08]}>
        <boxGeometry args={[2, 1.4, 0.08]} />
        <meshStandardMaterial color="#4a3728" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, -0.6, 0.08]}>
        <boxGeometry args={[2, 1.4, 0.08]} />
        <meshStandardMaterial color="#4a3728" roughness={0.7} />
      </mesh>
      {/* Door handle */}
      <mesh castShadow position={[-0.7, 0.2, 0.15]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Vertical trim */}
      <mesh castShadow position={[0, 0, 0.12]}>
        <boxGeometry args={[0.08, 3.3, 0.05]} />
        <meshStandardMaterial color="#3a2718" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function ProjectsRoom() {
  const router = useRouter();
  const playerPos = useGameStore((s) => s.playerPosition);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);
  const setRoomInteractionState = useGameStore((s) => s.setRoomInteractionState);
  const currentProjectIndex = useGameStore((s) => s.currentProjectIndex);
  const setCurrentProjectIndex = useGameStore((s) => s.setCurrentProjectIndex);
  const isTVOn = useGameStore((s) => s.isTVOn);
  const setIsTVOn = useGameStore((s) => s.setIsTVOn);
  const enterRoom = useGameStore((s) => s.enterRoom);
  
  const setPrompt = useUIStore((s) => s.setInteractionPrompt);
  
  const pressE = useKeyPress("KeyE");
  const pressEsc = useKeyPress("Escape");
  const clickRef = useRef(false);
  const lastERef = useRef(false);
  const lastEscRef = useRef(false);

  // Enter room on mount
  useEffect(() => {
    enterRoom("projects");
    // Spawn player inside room
    setPlayerPosition([0, 0.9, 5]);
  }, [enterRoom, setPlayerPosition]);

  // Sofa position
  const sofaPos: [number, number, number] = [0, 0, 3];
  const tablePos: [number, number, number] = [0, 0, 1.5];
  const remotePos: [number, number, number] = [0, 0.45, 1.5];
  const tvPos: [number, number, number] = [0, 2, -ROOM_DEPTH / 2 + 0.2];

  // Check distances and handle interactions
  useFrame(() => {
    const playerVec = new THREE.Vector3(playerPos[0], playerPos[1], playerPos[2]);
    const sofaVec = new THREE.Vector3(...sofaPos);
    const tableVec = new THREE.Vector3(...tablePos);
    
    const distToSofa = playerVec.distanceTo(sofaVec);
    const distToTable = playerVec.distanceTo(tableVec);

    // Handle E key press
    const justPressedE = pressE && !lastERef.current;
    lastERef.current = pressE;

    // Handle ESC key press
    const justPressedEsc = pressEsc && !lastEscRef.current;
    lastEscRef.current = pressEsc;

    // State machine for interactions
    switch (roomInteractionState) {
      case "none":
        if (distToSofa < 2.5) {
          setPrompt("Press E to sit on sofa");
          if (justPressedE) {
            setRoomInteractionState("sitting_sofa");
            // Lock player to sofa position with lower camera height
            setPlayerPosition([sofaPos[0], 0.5, sofaPos[2] + 0.3]);
          }
        } else {
          setPrompt(null);
        }
        break;

      case "sitting_sofa":
        // Keep player locked to sofa
        setPlayerPosition([sofaPos[0], 0.5, sofaPos[2] + 0.3]);
        
        if (!isTVOn) {
          setPrompt("Look at remote on table - Press E to pick up remote");
          if (justPressedE) {
            setRoomInteractionState("holding_remote");
          }
        } else {
          setPrompt("Watching TV - Press ESC to stop watching");
        }
        if (justPressedEsc) {
          if (isTVOn) {
            setIsTVOn(false);
          } else {
            setRoomInteractionState("none");
          }
        }
        break;

      case "holding_remote":
        // Keep player locked to sofa
        setPlayerPosition([sofaPos[0], 0.5, sofaPos[2] + 0.3]);
        
        setPrompt("Press E to turn on TV");
        if (justPressedE) {
          setIsTVOn(true);
          setRoomInteractionState("watching_tv");
        }
        if (justPressedEsc) {
          setRoomInteractionState("sitting_sofa");
        }
        break;

      case "watching_tv":
        // Keep player locked to sofa
        setPlayerPosition([sofaPos[0], 0.5, sofaPos[2] + 0.3]);
        
        setPrompt("Left click for next project - Press ESC to exit TV");
        if (justPressedEsc) {
          setIsTVOn(false);
          setRoomInteractionState("holding_remote");
        }
        break;
    }
  });

  // Handle mouse click for next project
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.button === 0 && roomInteractionState === "watching_tv" && isTVOn) {
        setCurrentProjectIndex((currentProjectIndex + 1) % projects.length);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [roomInteractionState, isTVOn, currentProjectIndex, setCurrentProjectIndex]);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_HEIGHT, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#FFF8DC" />
      </mesh>

      {/* Walls */}
      {/* Back wall (TV wall) */}
      <DecorativeWall 
        position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]} 
        size={[ROOM_WIDTH, ROOM_HEIGHT, 0.3]} 
      />
      {/* Left wall */}
      <DecorativeWall 
        position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} 
        size={[0.3, ROOM_HEIGHT, ROOM_DEPTH]}
      />
      {/* Right wall */}
      <DecorativeWall 
        position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} 
        size={[0.3, ROOM_HEIGHT, ROOM_DEPTH]}
      />
      {/* Front wall with door opening */}
      <mesh receiveShadow position={[-ROOM_WIDTH / 4 - 1, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH / 2 - 2, ROOM_HEIGHT, 0.3]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[ROOM_WIDTH / 4 + 1, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH / 2 - 2, ROOM_HEIGHT, 0.3]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      {/* Above door */}
      <mesh receiveShadow position={[0, ROOM_HEIGHT - 0.5, ROOM_DEPTH / 2]}>
        <boxGeometry args={[2.5, 1, 0.3]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Furniture */}
      <Sofa position={sofaPos} />
      <CoffeeTable position={tablePos} />
      <Remote position={remotePos} isPickedUp={roomInteractionState === "holding_remote" || roomInteractionState === "watching_tv"} />
      <TV position={tvPos} isOn={isTVOn} currentProject={currentProjectIndex} />

      {/* Lighting */}
      <pointLight position={[0, ROOM_HEIGHT - 0.5, 0]} intensity={50} distance={15} decay={2} color="#FFF5E6" />
      <ambientLight intensity={0.4} />

      {/* Exit door */}
      <WoodenDoor position={[0, 1.75, ROOM_DEPTH / 2 - 0.1]} />
    </group>
  );
}