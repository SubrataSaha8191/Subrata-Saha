"use client";

import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useGameStore } from "@/store/useGameStore";
import { useUIStore } from "@/store/useUIStore";
import Portal from "../interactables/Portal";
import { useRouter } from "next/navigation";

// Room dimensions
const ROOM_WIDTH = 12;
const ROOM_DEPTH = 14;
const ROOM_HEIGHT = 4;
const WALL_COLOR = "#F5E6D3"; // Warm beige

// Dummy dialogue data - replace with actual about text later
const DIALOGUE_PARAGRAPHS = [
  "Hello there! Welcome to my space. I'm Subrata, a passionate developer...",
  "I love building interactive web experiences and exploring new technologies...",
  "My journey in programming started when I discovered the magic of creating things from code...",
  "I specialize in full-stack development with React, Next.js, and Node.js...",
  "When I'm not coding, you can find me exploring game development or learning new skills...",
  "Feel free to check out my projects and don't hesitate to reach out!",
];

// Sofa component
function Sofa({ position, rotation = [0, 9.4, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Sofa base/seat */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[2.2, 0.4, 1]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.9} />
      </mesh>
      {/* Sofa back */}
      <mesh castShadow receiveShadow position={[0, 0.8, -0.4]}>
        <boxGeometry args={[2.2, 0.9, 0.2]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.9} />
      </mesh>
      {/* Left armrest */}
      <mesh castShadow receiveShadow position={[-1.0, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.5, 1]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.9} />
      </mesh>
      {/* Right armrest */}
      <mesh castShadow receiveShadow position={[1.0, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.5, 1]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.9} />
      </mesh>
      {/* Cushions */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.55, 0]}>
          <boxGeometry args={[0.8, 0.15, 0.8]} />
          <meshStandardMaterial color="#5A5A5A" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

// Round Coffee Table
function RoundTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Table top */}
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.06, 24]} />
        <meshStandardMaterial color="#5D4037" roughness={0.7} />
      </mesh>
      {/* Table leg */}
      <mesh castShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 12]} />
        <meshStandardMaterial color="#4E342E" roughness={0.8} />
      </mesh>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.04, 16]} />
        <meshStandardMaterial color="#4E342E" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Coffee Mug component
function CoffeeMug({ position, isPickedUp }: { position: [number, number, number]; isPickedUp: boolean }) {
  if (isPickedUp) return null;
  
  return (
    <group position={position}>
      {/* Mug body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.1, 12]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
      {/* Handle */}
      <mesh castShadow position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.025, 0.008, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
      {/* Coffee liquid */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.01, 12]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
    </group>
  );
}

// NPC Character sitting on sofa
function NPCCharacter({ position, isSipping }: { position: [number, number, number]; isSipping: boolean }) {
  const armRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (armRef.current) {
      // Animate arm when sipping
      const targetRotation = isSipping ? -0.8 : 0;
      armRef.current.rotation.x = THREE.MathUtils.lerp(armRef.current.rotation.x, targetRotation, 0.1);
    }
  });

  return (
    <group position={position}>
      {/* Body - sitting */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[0.5, 0.6, 0.3]} />
        <meshStandardMaterial color="#2196F3" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[0.35, 0.35, 0.3]} />
        <meshStandardMaterial color="#FFCC99" roughness={0.9} />
      </mesh>
      {/* Hair */}
      <mesh castShadow position={[0, 1.3, 0]}>
        <boxGeometry args={[0.36, 0.12, 0.32]} />
        <meshStandardMaterial color="#3E2723" roughness={0.95} />
      </mesh>
      {/* Eyes */}
      {[-0.08, 0.08].map((x, i) => (
        <mesh key={i} position={[x, 1.12, 0.16]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
      {/* Legs - sitting position */}
      {[-0.12, 0.12].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.2, 0.2]} rotation={[-Math.PI / 2.5, 0, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      ))}
      {/* Left arm (static) */}
      <mesh castShadow position={[-0.35, 0.5, 0]}>
        <boxGeometry args={[0.12, 0.4, 0.12]} />
        <meshStandardMaterial color="#2196F3" roughness={0.8} />
      </mesh>
      {/* Right arm (animated for sipping) */}
      <group ref={armRef} position={[0.35, 0.7, 0]}>
        <mesh castShadow position={[0, -0.15, 0.1]}>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial color="#2196F3" roughness={0.8} />
        </mesh>
        {/* Mug in hand when sipping */}
        {isSipping && (
          <group position={[0, -0.35, 0.15]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.05, 0.04, 0.1, 12]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
            </mesh>
          </group>
        )}
      </group>
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

export default function AboutRoom() {
  const playerPos = useGameStore((s) => s.playerPosition);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);
  const setRoomInteractionState = useGameStore((s) => s.setRoomInteractionState);
  const dialogueIndex = useGameStore((s) => s.dialogueIndex);
  const setDialogueIndex = useGameStore((s) => s.setDialogueIndex);
  const isDialogueActive = useGameStore((s) => s.isDialogueActive);
  const setIsDialogueActive = useGameStore((s) => s.setIsDialogueActive);
  const enterRoom = useGameStore((s) => s.enterRoom);
  
  const setPrompt = useUIStore((s) => s.setInteractionPrompt);
  const setDialogueText = useUIStore((s) => s.setDialogueText);
  const setDialogueSpeaker = useUIStore((s) => s.setDialogueSpeaker);
  
  const pressE = useKeyPress("KeyE");
  const pressQ = useKeyPress("KeyQ");
  const pressEsc = useKeyPress("Escape");
  const lastERef = useRef(false);
  const lastQRef = useRef(false);
  const lastEscRef = useRef(false);

  const [npcSipping, setNpcSipping] = useState(false);
  const [playerHoldingCoffee, setPlayerHoldingCoffee] = useState(false);
  const [playerSipping, setPlayerSipping] = useState(false);
  const sipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dialogueTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Enter room on mount
  useEffect(() => {
    enterRoom("about");
    // Spawn player inside room
    setPlayerPosition([0, 0.9, 5]);
    
    // Start NPC sipping animation loop
    const sipLoop = setInterval(() => {
      setNpcSipping(true);
      setTimeout(() => setNpcSipping(false), 1500);
    }, 3000);
    
    return () => {
      clearInterval(sipLoop);
      if (sipTimerRef.current) clearTimeout(sipTimerRef.current);
      if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);
    };
  }, [enterRoom]);

  // Positions
  const npcSofaPos: [number, number, number] = [0, 0, -2.9];
  const playerSofaPos: [number, number, number] = [0, 0, 3];
  const tablePos: [number, number, number] = [0, 0, 0];
  const playerCoffeePos: [number, number, number] = [0.3, 0.48, 0];

  // Dialogue progression
  useEffect(() => {
    if (isDialogueActive && dialogueIndex < DIALOGUE_PARAGRAPHS.length) {
      setDialogueSpeaker("Subrata");
      setDialogueText(DIALOGUE_PARAGRAPHS[dialogueIndex]);
      
      // Auto-advance dialogue after delay
      dialogueTimerRef.current = setTimeout(() => {
        if (dialogueIndex < DIALOGUE_PARAGRAPHS.length - 1) {
          setDialogueIndex(dialogueIndex + 1);
        }
      }, 5000);
    } else if (!isDialogueActive) {
      setDialogueText(null);
      setDialogueSpeaker(null);
    }
    
    return () => {
      if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);
    };
  }, [isDialogueActive, dialogueIndex, setDialogueIndex, setDialogueText, setDialogueSpeaker]);

  // Check distances and handle interactions
  useFrame(() => {
    const playerVec = new THREE.Vector3(playerPos[0], playerPos[1], playerPos[2]);
    const sofaVec = new THREE.Vector3(...playerSofaPos);
    
    const distToSofa = playerVec.distanceTo(sofaVec);

    // Handle E key press
    const justPressedE = pressE && !lastERef.current;
    lastERef.current = pressE;

    // Handle Q key press  
    const justPressedQ = pressQ && !lastQRef.current;
    lastQRef.current = pressQ;

    // Handle ESC key press
    const justPressedEsc = pressEsc && !lastEscRef.current;
    lastEscRef.current = pressEsc;

    // State machine for interactions
    switch (roomInteractionState) {
      case "none":
        if (distToSofa < 2.5) {
          setPrompt("Press E to sit on sofa");
          if (justPressedE) {
            setRoomInteractionState("talking_npc");
            setIsDialogueActive(true);
            setDialogueIndex(0);
            // Lock player to sofa position
            setPlayerPosition([playerSofaPos[0], 0.5, playerSofaPos[2] + 0.3]);
          }
        } else {
          setPrompt(null);
        }
        break;

      case "talking_npc":
        // Keep player locked to sofa
        setPlayerPosition([playerSofaPos[0], 0.5, playerSofaPos[2] + 0.3]);
        
        if (!playerHoldingCoffee) {
          setPrompt("Press E to pick up coffee");
          if (justPressedE) {
            setPlayerHoldingCoffee(true);
            setRoomInteractionState("holding_coffee");
          }
        }
        if (justPressedEsc) {
          setIsDialogueActive(false);
          setRoomInteractionState("none");
          setPlayerHoldingCoffee(false);
        }
        break;

      case "holding_coffee":
        // Keep player locked to sofa
        setPlayerPosition([playerSofaPos[0], 0.5, playerSofaPos[2] + 0.3]);
        
        setPrompt("Press Q to sip coffee - Press ESC to leave");
        if (justPressedQ && !playerSipping) {
          setPlayerSipping(true);
          // Play sipping sound
          const audio = new Audio('/audio/sip.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {}); // Ignore errors if sound file missing
          sipTimerRef.current = setTimeout(() => setPlayerSipping(false), 1000);
        }
        if (justPressedEsc) {
          setIsDialogueActive(false);
          setRoomInteractionState("none");
          setPlayerHoldingCoffee(false);
        }
        break;
    }
  });

  return (
    <group>
      {/* Floor - wooden */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_HEIGHT, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#FFF8DC" />
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
      {/* Front wall with door */}
      <mesh receiveShadow position={[-ROOM_WIDTH / 4 - 1, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH / 2 - 2, ROOM_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[ROOM_WIDTH / 4 + 1, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH / 2 - 2, ROOM_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Wall decorations - picture frames */}
      {[[-3, 2.2, -ROOM_DEPTH / 2 + 0.15], [3, 2.2, -ROOM_DEPTH / 2 + 0.15]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.9, 0.05]} />
            <meshStandardMaterial color="#5D4037" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[1, 0.7]} />
            <meshStandardMaterial color={i === 0 ? "#87CEEB" : "#90EE90"} />
          </mesh>
        </group>
      ))}

      {/* Furniture */}
      <Sofa position={npcSofaPos} rotation={[0, Math.PI/120, 0]} />
      <Sofa position={playerSofaPos} />
      <RoundTable position={tablePos} />
      <CoffeeMug position={playerCoffeePos} isPickedUp={playerHoldingCoffee} />
      
      {/* NPC on sofa */}
      <NPCCharacter position={[0, 0.15, -2.5]} isSipping={npcSipping} />
      {/* Coffee in player hand when holding */}
      {playerHoldingCoffee && (
        <group position={[playerPos[0] + 0.3, playerPos[1] + 0.8, playerPos[2] - 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.12, 16]} />
            <meshStandardMaterial color="#8B4513" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <torusGeometry args={[0.06, 0.015, 8, 16]} />
            <meshStandardMaterial color="#654321" roughness={0.8} />
          </mesh>
          {/* Coffee liquid */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.07, 0.06, 0.02, 16]} />
            <meshStandardMaterial color="#4A3020" roughness={0.3} />
          </mesh>
          {/* Sipping indicator */}
          {playerSipping && (
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
          )}
        </group>
      )}
      {/* Lighting */}
      <pointLight position={[0, ROOM_HEIGHT - 0.5, 0]} intensity={45} distance={14} decay={2} color="#FFF5E6" />
      <pointLight position={[-3, 2, 0]} intensity={15} distance={8} decay={2} color="#FFE4C4" />
      <pointLight position={[3, 2, 0]} intensity={15} distance={8} decay={2} color="#FFE4C4" />
      <ambientLight intensity={0.4} />

      {/* Exit door */}
      <WoodenDoor position={[0, 1.75, ROOM_DEPTH / 2 - 0.1]} />
    </group>
  );
}
