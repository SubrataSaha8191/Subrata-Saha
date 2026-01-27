"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useGameStore } from "@/store/useGameStore";
import { useUIStore } from "@/store/useUIStore";
import Portal from "../interactables/Portal";
import { skills } from "@/data/skills";
import { useRouter } from "next/navigation";

// Room dimensions
const ROOM_WIDTH = 10;
const ROOM_DEPTH = 12;
const ROOM_HEIGHT = 3.5;
const WALL_COLOR = "#E8E4E0"; // Light gray
const ACCENT_COLOR = "#2196F3"; // Tech blue

// Office Chair component
function OfficeChair({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* Back rest */}
      <mesh castShadow position={[0, 0.85, -0.2]}>
        <boxGeometry args={[0.5, 0.6, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* Chair base pole */}
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Chair base */}
      <mesh castShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 8]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Wheels */}
      {[0, Math.PI / 2.5, Math.PI / 1.25, Math.PI, -Math.PI / 1.25].map((angle, i) => (
        <mesh key={i} castShadow position={[Math.sin(angle) * 0.2, 0.03, Math.cos(angle) * 0.2]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      ))}
    </group>
  );
}

// Desk component
function Desk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Desktop surface */}
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.7} />
      </mesh>
      {/* Left leg panel */}
      <mesh castShadow position={[-0.65, 0.37, 0]}>
        <boxGeometry args={[0.05, 0.72, 0.7]} />
        <meshStandardMaterial color="#4E342E" roughness={0.8} />
      </mesh>
      {/* Right leg panel */}
      <mesh castShadow position={[0.65, 0.37, 0]}>
        <boxGeometry args={[0.05, 0.72, 0.7]} />
        <meshStandardMaterial color="#4E342E" roughness={0.8} />
      </mesh>
      {/* Back panel */}
      <mesh castShadow position={[0, 0.37, -0.35]}>
        <boxGeometry args={[1.35, 0.72, 0.05]} />
        <meshStandardMaterial color="#4E342E" roughness={0.8} />
      </mesh>
    </group>
  );
}

// CPU/Tower component
function CPU({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main case */}
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.45, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      {/* Front panel */}
      <mesh position={[0.101, 0, 0]}>
        <boxGeometry args={[0.01, 0.43, 0.38]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} />
      </mesh>
      {/* Power button */}
      <mesh position={[0.11, 0.15, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
      {/* USB ports */}
      {[-0.05, 0.05].map((z, i) => (
        <mesh key={i} position={[0.11, -0.1, z]}>
          <boxGeometry args={[0.01, 0.02, 0.03]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
}

// Monitor component
function Monitor({ position, isOn }: { position: [number, number, number]; isOn: boolean }) {
  return (
    <group position={position}>
      {/* Screen bezel */}
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.45, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[0.62, 0.38]} />
        <meshStandardMaterial 
          color={isOn ? "#0a0a1a" : "#050505"} 
          emissive={isOn ? "#1a1a3a" : "#000000"}
          emissiveIntensity={isOn ? 0.4 : 0}
        />
      </mesh>
      {/* Stand neck */}
      <mesh castShadow position={[0, -0.3, -0.05]}>
        <boxGeometry args={[0.06, 0.15, 0.06]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Stand base */}
      <mesh castShadow position={[0, -0.38, 0]}>
        <boxGeometry args={[0.25, 0.02, 0.15]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Keyboard component
function Keyboard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.02, 0.15]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
      </mesh>
      {/* Key rows */}
      {[0.04, 0.015, -0.015, -0.04].map((z, row) => (
        <group key={row}>
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh key={i} position={[-0.165 + i * 0.03, 0.015, z]}>
              <boxGeometry args={[0.025, 0.01, 0.02]} />
              <meshStandardMaterial color="#3a3a3a" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// Mouse component
function Mouse({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <capsuleGeometry args={[0.025, 0.04, 4, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[0, 0.03, 0.01]}>
        <cylinderGeometry args={[0.008, 0.008, 0.02, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#333" />
      </mesh>
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

export default function SkillsRoom() {
  const playerPos = useGameStore((s) => s.playerPosition);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);
  const setRoomInteractionState = useGameStore((s) => s.setRoomInteractionState);
  const enterRoom = useGameStore((s) => s.enterRoom);
  
  const setPrompt = useUIStore((s) => s.setInteractionPrompt);
  
  const pressE = useKeyPress("KeyE");
  const pressEsc = useKeyPress("Escape");
  const lastERef = useRef(false);
  const lastEscRef = useRef(false);

  const [isComputerOn, setIsComputerOn] = useState(false);

  // Enter room on mount
  useEffect(() => {
    enterRoom("skills");
    // Spawn player inside room
    setPlayerPosition([0, 0.9, 4]);
  }, [enterRoom, setPlayerPosition]);

  // Positions
  const deskPos: [number, number, number] = [0, 0, -2];
  const chairPos: [number, number, number] = [0, 0, -0.5];
  const cpuPos: [number, number, number] = [0.5, 0.98, -2];
  const monitorPos: [number, number, number] = [0, 1.0, -2.2];
  const keyboardPos: [number, number, number] = [0, 0.78, -1.7];
  const mousePos: [number, number, number] = [0.3, 0.78, -1.7];

  // Check distances and handle interactions
  useFrame(() => {
    const playerVec = new THREE.Vector3(playerPos[0], playerPos[1], playerPos[2]);
    const chairVec = new THREE.Vector3(...chairPos);
    
    const distToChair = playerVec.distanceTo(chairVec);

    // Handle E key press
    const justPressedE = pressE && !lastERef.current;
    lastERef.current = pressE;

    // Handle ESC key press
    const justPressedEsc = pressEsc && !lastEscRef.current;
    lastEscRef.current = pressEsc;

    // State machine for interactions
    switch (roomInteractionState) {
      case "none":
        if (distToChair < 2) {
          setPrompt("Press E to sit on chair");
          if (justPressedE) {
            setRoomInteractionState("sitting_chair");
            // Lock player to chair position
            setPlayerPosition([chairPos[0], 0.5, chairPos[2] + 0.3]);
          }
        } else {
          setPrompt(null);
        }
        break;

      case "sitting_chair":
        // Keep player locked to chair
        setPlayerPosition([chairPos[0], 0.5, chairPos[2] + 0.3]);
        
        if (!isComputerOn) {
          setPrompt("Press E to use computer");
          if (justPressedE) {
            setIsComputerOn(true);
            setRoomInteractionState("using_computer");
          }
        }
        if (justPressedEsc) {
          setRoomInteractionState("none");
        }
        break;

      case "using_computer":
        // Keep player locked to chair
        setPlayerPosition([chairPos[0], 0.5, chairPos[2] + 0.3]);
        
        setPrompt("Viewing skills - Press ESC to stop using computer");
        if (justPressedEsc) {
          setIsComputerOn(false);
          setRoomInteractionState("sitting_chair");
        }
        break;
    }
  });

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_HEIGHT, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Walls */}
      {/* Back wall */}
      <mesh receiveShadow position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH, ROOM_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      {/* Left wall */}
      <mesh receiveShadow position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]}>
        <boxGeometry args={[0.2, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      {/* Right wall */}
      <mesh receiveShadow position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]}>
        <boxGeometry args={[0.2, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      {/* Front wall with door opening */}
      <mesh receiveShadow position={[-ROOM_WIDTH / 4 - 0.75, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH / 2 - 1.5, ROOM_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[ROOM_WIDTH / 4 + 0.75, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH / 2 - 1.5, ROOM_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Tech accent stripe on back wall */}
      <mesh position={[0, 1, -ROOM_DEPTH / 2 + 0.11]}>
        <boxGeometry args={[ROOM_WIDTH - 0.5, 0.1, 0.02]} />
        <meshStandardMaterial color={ACCENT_COLOR} emissive={ACCENT_COLOR} emissiveIntensity={0.3} />
      </mesh>

      {/* Furniture */}
      <Desk position={deskPos} />
      <OfficeChair position={chairPos} rotation={[0, Math.PI, 0]} />
      <CPU position={cpuPos} />
      <Monitor position={monitorPos} isOn={isComputerOn} />
      <Keyboard position={keyboardPos} />
      <Mouse position={mousePos} />

      {/* Lighting */}
      <pointLight position={[0, ROOM_HEIGHT - 0.3, 0]} intensity={40} distance={12} decay={2} color="#ffffff" />
      <ambientLight intensity={0.5} />

      {/* Exit door */}
      <WoodenDoor position={[0, 1.75, ROOM_DEPTH / 2 - 0.1]} />
    </group>
  );
}