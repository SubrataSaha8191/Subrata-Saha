"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMobileAwareKeyPress } from "@/hooks/useMobileAwareKeyPress";
import { useGameStore } from "@/store/useGameStore";
import { useUIStore } from "@/store/useUIStore";
import Portal from "../interactables/Portal";
import { skills } from "@/data/skills";
import { useRouter } from "next/navigation";

// Room dimensions
const ROOM_WIDTH = 14;
const ROOM_DEPTH = 16;
const ROOM_HEIGHT = 4.5;
const WALL_COLOR = "#E8E4E0"; // Light gray
const ACCENT_COLOR = "#2196F3"; // Tech blue

// Larger Office Chair component
function OfficeChair({ position, rotation = [0, 0, 0], scale = 1.8 }: { position: [number, number, number]; rotation?: [number, number, number]; scale?: number }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Seat */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.6, 0.12, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* Back rest */}
      <mesh castShadow position={[0, 0.95, -0.25]}>
        <boxGeometry args={[0.58, 0.7, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* Armrests */}
      <mesh castShadow position={[-0.32, 0.65, 0]}>
        <boxGeometry args={[0.08, 0.2, 0.4]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0.32, 0.65, 0]}>
        <boxGeometry args={[0.08, 0.2, 0.4]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
      </mesh>
      {/* Chair base pole */}
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.45, 8]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Chair base */}
      <mesh castShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 8]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Wheels */}
      {[0, Math.PI / 2.5, Math.PI / 1.25, Math.PI, -Math.PI / 1.25].map((angle, i) => (
        <mesh key={i} castShadow position={[Math.sin(angle) * 0.25, 0.03, Math.cos(angle) * 0.25]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      ))}
    </group>
  );
}

// Larger Desk component
function Desk({ position, scale = 2.2 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Desktop surface */}
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[1.8, 0.06, 1.0]} />
        <meshStandardMaterial color="#5D4037" roughness={0.7} />
      </mesh>
      {/* Left leg panel */}
      <mesh castShadow position={[-0.82, 0.37, 0]}>
        <boxGeometry args={[0.06, 0.72, 0.9]} />
        <meshStandardMaterial color="#4E342E" roughness={0.8} />
      </mesh>
      {/* Right leg panel */}
      <mesh castShadow position={[0.82, 0.37, 0]}>
        <boxGeometry args={[0.06, 0.72, 0.9]} />
        <meshStandardMaterial color="#4E342E" roughness={0.8} />
      </mesh>
      {/* Back panel */}
      <mesh castShadow position={[0, 0.37, -0.45]}>
        <boxGeometry args={[1.7, 0.72, 0.06]} />
        <meshStandardMaterial color="#4E342E" roughness={0.8} />
      </mesh>
      {/* Drawer */}
      <mesh castShadow position={[0.5, 0.5, 0.2]}>
        <boxGeometry args={[0.5, 0.15, 0.4]} />
        <meshStandardMaterial color="#3E2723" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Larger CPU/Tower component
function CPU({ position, scale = 2.0 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Main case */}
      <mesh castShadow>
        <boxGeometry args={[0.25, 0.55, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      {/* Front panel */}
      <mesh position={[0.126, 0, 0]}>
        <boxGeometry args={[0.01, 0.53, 0.48]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} />
      </mesh>
      {/* Power button */}
      <mesh position={[0.14, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.8} />
      </mesh>
      {/* RGB strip */}
      <mesh position={[0.14, 0, 0]}>
        <boxGeometry args={[0.01, 0.4, 0.02]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} />
      </mesh>
      {/* USB ports */}
      {[-0.08, 0.08].map((z, i) => (
        <mesh key={i} position={[0.14, -0.15, z]}>
          <boxGeometry args={[0.01, 0.025, 0.04]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
}

// Larger Monitor component with screen display
function Monitor({
  position,
  isOn,
  skillsPage,
  totalSkillPages,
  onNextPage,
  scale = 2.5,
}: {
  position: [number, number, number];
  isOn: boolean;
  skillsPage: number;
  totalSkillPages: number;
  onNextPage: () => void;
  scale?: number;
}) {
  const isMobile = useIsMobile();
  return (
    <group position={position} scale={scale}>
      {/* Screen bezel */}
      <mesh castShadow>
        <boxGeometry args={[0.85, 0.55, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      {/* Screen - this is where we'll render skills */}
      <mesh position={[0, 0, 0.026]}>
        <planeGeometry args={[0.78, 0.48]} />
        <meshStandardMaterial 
          color={isOn ? "#0a0a1a" : "#050505"} 
          emissive={isOn ? "#1a1a3a" : "#000000"}
          emissiveIntensity={isOn ? 0.4 : 0}
        />
      </mesh>
      {/* Skills display on screen when on */}
      {isOn && (
        <Html
          position={[0, 0, 0.03]}
          transform
          distanceFactor={isMobile ? 0.5 : 0.4}
          style={{
            width: '780px',
            height: '510px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '0px',
            padding: '28px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
            pointerEvents: isMobile ? 'auto' : 'none',
            position: 'relative',
          }}
        >
          {isMobile && (
            <>
              <button
                onClick={() => onNextPage()}
                style={{
                  position: 'absolute',
                  right: '18px',
                  bottom: '18px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '999px',
                  border: '2px solid rgba(255,255,255,0.2)',
                  background: 'linear-gradient(145deg, rgba(59,130,246,0.9), rgba(37,99,235,0.9))',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                }}
                aria-label="Next skills page"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => onNextPage()}
                style={{
                  position: 'absolute',
                  left: '18px',
                  bottom: '18px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '999px',
                  border: '2px solid rgba(255,255,255,0.2)',
                  background: 'linear-gradient(145deg, rgba(59,130,246,0.9), rgba(37,99,235,0.9))',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                }}
                aria-label="Previous skills page"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5" />
                  <path d="M11 19l-7-7 7-7" />
                </svg>
              </button>
            </>
          )}
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#e2e8f0',
              marginBottom: '20px',
              borderBottom: '2px solid #475569',
              paddingBottom: '12px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Technical Skills</span>
              <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
                {skillsPage + 1} / {totalSkillPages}
              </span>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '12px',
              gridAutoRows: 'minmax(80px, 1fr)',
              flex: 1
            }}>
              {skills.slice(skillsPage * 9, skillsPage * 9 + 9).map((skill, i) => (
                <div 
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 12px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '8px',
                    border: '2px solid rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    minHeight: '80px',
                  }}
                >
                  <img 
                    src={skill.icon} 
                    alt={skill.name}
                    style={{ 
                      width: '40px', 
                      height: '40px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }} 
                  />
                  <span style={{ 
                    color: '#e2e8f0', 
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'center',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {skill.name}
                  </span>
                  {skill.category && (
                    <span style={{ 
                      color: '#94a3b8', 
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {skill.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Html>
      )}
      {/* Stand neck */}
      <mesh castShadow position={[0, -0.35, -0.06]}>
        <boxGeometry args={[0.08, 0.18, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Stand base */}
      <mesh castShadow position={[0, -0.45, 0]}>
        <boxGeometry args={[0.35, 0.03, 0.2]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Keyboard component
function Keyboard({ position, scale = 2.0 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.025, 0.18]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
      </mesh>
      {/* Key rows */}
      {[0.05, 0.02, -0.01, -0.04].map((z, row) => (
        <group key={row}>
          {Array.from({ length: 14 }).map((_, i) => (
            <mesh key={i} position={[-0.22 + i * 0.032, 0.018, z]}>
              <boxGeometry args={[0.028, 0.012, 0.025]} />
              <meshStandardMaterial color="#3a3a3a" />
            </mesh>
          ))}
        </group>
      ))}
      {/* RGB underglow */}
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[0.48, 0.005, 0.16]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// Mouse component
function Mouse({ position, scale = 2.0 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.03, 0.05, 4, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[0, 0.035, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.025, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* RGB */}
      <mesh position={[0, 0.02, -0.02]}>
        <boxGeometry args={[0.02, 0.005, 0.02]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Wooden Door component
function WoodenDoor({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const router = useRouter();
  const playerPos = useGameStore((s) => s.playerPosition);
  const setPrompt = useUIStore((s) => s.setInteractionPrompt);
  const setIsNearExitDoor = useUIStore((s) => s.setIsNearExitDoor);
  const exitRoom = useGameStore((s) => s.exitRoom);
  const setLoading = useGameStore((s) => s.setLoading);
  const setLoadingStyle = useGameStore((s) => s.setLoadingStyle);
  const pressE = useMobileAwareKeyPress("KeyE");
  const lastERef = useRef(false);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);
  const uiGetState = useUIStore.getState;

  useEffect(() => {
    return () => setIsNearExitDoor(false);
  }, [setIsNearExitDoor]);

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
      setIsNearExitDoor(true);
      if (justPressedE) {
        setLoadingStyle("dots");
        setLoading(true);
        exitRoom();
        router.push("/");
      }
      return;
    }

    setIsNearExitDoor(false);

    const currentPrompt = uiGetState().interactionPrompt;
    if (currentPrompt?.toLowerCase().includes("exit room")) {
      setPrompt(null);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Door frame */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3, 5.5, 0.15]} />
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
  const router = useRouter();

  useFrame(() => {
      // Wall collision/bounds
      const player = useGameStore.getState().playerObject;
      const sittingState = useGameStore.getState().sittingState;
      
      // Skip collision when sitting
      if (sittingState.isSitting) return;
      
      if (player) {
        const { x, z } = player.position;
        const halfWidth = ROOM_WIDTH / 2 - 0.5;
        const halfDepth = ROOM_DEPTH / 2 - 0.5;

        if (Math.abs(x) > halfWidth) {
          player.position.x = Math.sign(x) * halfWidth;
        }
        if (Math.abs(z) > halfDepth) {
           player.position.z = Math.sign(z) * halfDepth;
        }
      }
  });
  
  const playerPos = useGameStore((s) => s.playerPosition);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);
  const setRoomInteractionState = useGameStore((s) => s.setRoomInteractionState);
  const sittingState = useGameStore((s) => s.sittingState);
  const sitDown = useGameStore((s) => s.sitDown);
  const standUp = useGameStore((s) => s.standUp);
  const enterRoom = useGameStore((s) => s.enterRoom);
  
  const setPrompt = useUIStore((s) => s.setInteractionPrompt);
  
  const pressE = useMobileAwareKeyPress("KeyE");
  const pressEsc = useMobileAwareKeyPress("Escape");
  const lastERef = useRef(false);
  const lastEscRef = useRef(false);

  const [isComputerOn, setIsComputerOn] = useState(false);
  const [skillsPage, setSkillsPage] = useState(0);
  const totalSkillPages = Math.max(1, Math.ceil(skills.length / 9));

  // Enter room on mount
  useEffect(() => {
    enterRoom("skills");
    setPlayerPosition([0, 0.9, 5]);
  }, [enterRoom, setPlayerPosition]);

  // Updated positions for larger furniture
  const deskPos: [number, number, number] = [0, -0.6, -4];
  const chairPos: [number, number, number] = [0, 0, -2];
  // Align seatPosition with the actual chair seat (seat mesh is at y=0.5 inside the chair group)
  const seatPosition: [number, number, number] = [0, 0.9, -2]; // Where player sits (on chair)
  const cpuPos: [number, number, number] = [1.6, 1.8, -4];
  const monitorPos: [number, number, number] = [0, 2.3, -4.3];
  const keyboardPos: [number, number, number] = [0, 1.3, -3.2];
  const mousePos: [number, number, number] = [0.7, 1.3, -3.2];

  // Check distances and handle interactions
  useFrame(() => {
    const playerVec = new THREE.Vector3(playerPos[0], playerPos[1], playerPos[2]);
    const chairVec = new THREE.Vector3(...chairPos);
    
    const distToChair = playerVec.distanceTo(chairVec);

    const justPressedE = pressE && !lastERef.current;
    lastERef.current = pressE;

    const justPressedEsc = pressEsc && !lastEscRef.current;
    lastEscRef.current = pressEsc;

    // Keep player locked when sitting
    if (sittingState.isSitting) {
      setPlayerPosition(sittingState.seatPosition);
    }

    switch (roomInteractionState) {
      case "none":
        if (distToChair < 2.5) {
          setPrompt("Press E to sit on chair");
          if (justPressedE) {
            setRoomInteractionState("sitting_chair");
            // Sit down facing the monitor
            sitDown(seatPosition, monitorPos);
          }
        } else {
          setPrompt(null);
        }
        break;

      case "sitting_chair":
        if (!isComputerOn) {
          setPrompt("Press E to use computer - Press ESC to stand up");
          if (justPressedE) {
            setIsComputerOn(true);
            setSkillsPage(0);
            setRoomInteractionState("using_computer");
          }
        }
        if (justPressedEsc) {
          standUp();
          setIsComputerOn(false);
        }
        break;

      case "using_computer":
        setPrompt("Right click for next page - Press ESC to stop");
        if (justPressedEsc) {
          setIsComputerOn(false);
          setRoomInteractionState("sitting_chair");
        }
        break;
    }
  });

  // Handle right click for next skills page
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (roomInteractionState === "using_computer" && isComputerOn) {
        e.preventDefault();
        setSkillsPage((prev) => (prev + 1) % totalSkillPages);
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, [roomInteractionState, isComputerOn, totalSkillPages]);

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
      <mesh receiveShadow position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH, ROOM_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]}>
        <boxGeometry args={[0.2, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]}>
        <boxGeometry args={[0.2, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[-ROOM_WIDTH / 4 - 0.75, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH / 2 - 1.5, ROOM_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[ROOM_WIDTH / 4 + 0.75, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH / 2 - 1.5, ROOM_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Tech accent stripe on back wall */}
      <mesh position={[0, 1.5, -ROOM_DEPTH / 2 + 0.11]}>
        <boxGeometry args={[ROOM_WIDTH - 0.5, 0.15, 0.02]} />
        <meshStandardMaterial color={ACCENT_COLOR} emissive={ACCENT_COLOR} emissiveIntensity={0.4} />
      </mesh>

      {/* Larger Furniture */}
      <Desk position={deskPos} />
      <OfficeChair position={chairPos} rotation={[0, Math.PI, 0]} />
      <CPU position={cpuPos} />
      <Monitor
        position={monitorPos}
        isOn={isComputerOn}
        skillsPage={skillsPage}
        totalSkillPages={totalSkillPages}
        onNextPage={() => setSkillsPage((prev) => (prev + 1) % totalSkillPages)}
      />
      <Keyboard position={keyboardPos} />
      <Mouse position={mousePos} />

      {/* Lighting */}
      <pointLight position={[0, ROOM_HEIGHT - 0.3, 0]} intensity={50} distance={14} decay={2} color="#ffffff" />
      <ambientLight intensity={0.5} />

      {/* Exit door */}
      <WoodenDoor position={[0, 1.75, ROOM_DEPTH / 2 - 0.1]} rotation={[0, Math.PI, 0]} />
    </group>
  );
}