"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useGameStore } from "@/store/useGameStore";
import { useUIStore } from "@/store/useUIStore";
import Portal from "../interactables/Portal";
import { projects } from "@/data/projects";
import { useRouter } from "next/navigation";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

// Room dimensions - larger for big TV
const ROOM_WIDTH = 16;
const ROOM_DEPTH = 18;
const ROOM_HEIGHT = 5;
const WALL_COLOR = "#FFE4C4"; // Peach color
const WALL_PATTERN_COLOR = "#FFD4A4";

// Sofa component
function Sofa({ position, rotation = [0, 9.43, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
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
        <boxGeometry args={[1.6, 0.08, 0.6]} />
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

// Remote Control component - shown in hand when picked up
function Remote({ position, isPickedUp }: { position: [number, number, number]; isPickedUp: boolean }) {
  if (isPickedUp) return null;
  
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.18, 0.035, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      {/* Buttons */}
      {[[-0.04, 0.02, 0], [0.04, 0.02, 0]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.012, 0.012, 0.012, 8]} />
          <meshStandardMaterial color={i === 0 ? "#ff0000" : "#00ff00"} emissive={i === 0 ? "#ff0000" : "#00ff00"} emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* D-pad */}
      <mesh position={[0, 0.02, 0.02]}>
        <boxGeometry args={[0.03, 0.008, 0.03]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

// Remote in hand component
function RemoteInHand() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.12, 0.025, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      {/* Buttons */}
      {[[-0.03, 0.015, 0], [0.03, 0.015, 0]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.008, 0.008, 0.008, 8]} />
          <meshStandardMaterial color={i === 0 ? "#ff0000" : "#00ff00"} emissive={i === 0 ? "#ff0000" : "#00ff00"} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// HUGE 8K TV component with screen display
function TV({ position, isOn, currentProject }: { position: [number, number, number]; isOn: boolean; currentProject: number }) {
  const project = projects[currentProject] || projects[0];
  
  return (
    <group position={position}>
      {/* Massive TV frame - 8K size */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[10, 5.5, 0.2]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* TV screen bezel */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[9.6, 5.2, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* TV screen */}
      <mesh position={[0, 0, 0.12]}>
        <planeGeometry args={[9.2, 5]} />
        <meshStandardMaterial 
          color={isOn ? "#111122" : "#050505"} 
          emissive={isOn ? "#1a1a3a" : "#000000"}
          emissiveIntensity={isOn ? 0.5 : 0}
        />
      </mesh>
      
      {/* Project content displayed on TV when on */}
      {isOn && (
        <Html
          position={[0, -0.6, 0.05]}
          transform
          distanceFactor={2.8}
          style={{
            width: '1410px',
            height: '580px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '0px',
            padding: '28px',
            overflow: 'auto',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}>
            {/* TV Header */}
            <div style={{
              background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #333',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#00ff00',
                  boxShadow: '0 0 12px #00ff00',
                }} />
                <span style={{ color: '#888', fontSize: '16px', fontWeight: 700, letterSpacing: '2px' }}>
                  PROJECT SHOWCASE
                </span>
              </div>
              <div style={{ color: '#666', fontSize: '14px', fontWeight: 600 }}>
                {currentProject + 1} / {projects.length}
              </div>
            </div>

            {/* Project Content */}
            <div style={{ flex: 1, padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Title */}
              <h1 style={{
                fontSize: '36px',
                fontWeight: 800,
                color: '#fff',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <span style={{
                  width: '6px',
                  height: '40px',
                  background: 'linear-gradient(180deg, #7c3aed 0%, #a855f7 100%)',
                  borderRadius: '3px',
                }} />
                {project.title}
              </h1>

              {/* Description */}
              <p style={{
                fontSize: '18px',
                color: '#bbb',
                lineHeight: 1.8,
                margin: 0,
                maxWidth: '700px',
              }}>
                {project.description}
              </p>

              {/* Tech Stack */}
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontWeight: 600,
                }}>
                  Technologies Used
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: '#282c3d',
                        border: '2px solid #282c3d',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div style={{ display: 'flex', gap: '20px', marginTop: 'auto' }}>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      background: '#282c3d',
                      border: '2px solid #333',
                      color: '#fff',
                      fontSize: '14px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <FaGithub size={16} />
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      background: 'linear-gradient(90deg, #4287f5 0%, #6d98de 100%)',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <FaExternalLinkAlt size={14} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Bottom Controls */}
            <div style={{
              background: '#0a0a0a',
              padding: '12px 24px',
              borderTop: '2px solid #222',
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
            }}>
              <span style={{ color: '#555', fontSize: '13px' }}>
                <span style={{ 
                  padding: '4px 10px', 
                  background: '#1a1a1a', 
                  borderRadius: '6px', 
                  marginRight: '8px',
                  border: '1px solid #333'
                }}>
                  RIGHT CLICK
                </span>
                Next Project
              </span>
              <span style={{ color: '#555', fontSize: '13px' }}>
                <span style={{ 
                  padding: '4px 10px', 
                  background: '#1a1a1a', 
                  borderRadius: '6px', 
                  marginRight: '8px',
                  border: '1px solid #333'
                }}>
                  LEFT CLICK
                </span>
                Open Links
              </span>
              <span style={{ color: '#555', fontSize: '13px' }}>
                <span style={{ 
                  padding: '4px 10px', 
                  background: '#1a1a1a', 
                  borderRadius: '6px', 
                  marginRight: '8px',
                  border: '1px solid #333'
                }}>
                  ESC
                </span>
                Exit
              </span>
            </div>
          </div>
        </Html>
      )}
      
      {/* TV stand/mount */}
      <mesh castShadow position={[0, -3, 0.15]}>
        <boxGeometry args={[0, 0, 0.15]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} />
      </mesh>
      {/* TV base */}
      <mesh castShadow position={[0, -3.4, 0.3]}>
        <boxGeometry args={[0, 0, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} />
      </mesh>
      {/* Ambient light strip on back */}
      {isOn && (
        <mesh position={[0, 0, -0.15]}>
          <boxGeometry args={[9, 4.5, 0.02]} />
          <meshStandardMaterial 
            color="#7c3aed" 
            emissive="#7c3aed" 
            emissiveIntensity={0.8} 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}
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
        <boxGeometry args={[4, 7, 0.15]} />
        <meshStandardMaterial color="#3a2718" roughness={0.8} />
      </mesh>
      {/* Door panels */}
      <mesh castShadow position={[0, 1.9, 0.08]}>
        <boxGeometry args={[2.5, 1.7, 0.08]} />
        <meshStandardMaterial color="#4a3728" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, -0.4, 0.08]}>
        <boxGeometry args={[2.5, 1.7, 0.08]} />
        <meshStandardMaterial color="#4a3728" roughness={0.7} />
      </mesh>
      {/* Door handle */}
      <mesh castShadow position={[-0.7, 0.2, 0.15]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Vertical trim */}
      <mesh castShadow position={[0, 0.76, 0.12]}>
        <boxGeometry args={[0.08, 3.3, 0.05]} />
        <meshStandardMaterial color="#3a2718" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function ProjectsRoom() {

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
  
  const router = useRouter();
  const playerPos = useGameStore((s) => s.playerPosition);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);
  const setRoomInteractionState = useGameStore((s) => s.setRoomInteractionState);
  const currentProjectIndex = useGameStore((s) => s.currentProjectIndex);
  const setCurrentProjectIndex = useGameStore((s) => s.setCurrentProjectIndex);
  const isTVOn = useGameStore((s) => s.isTVOn);
  const setIsTVOn = useGameStore((s) => s.setIsTVOn);
  const isHoldingRemote = useGameStore((s) => s.isHoldingRemote);
  const setIsHoldingRemote = useGameStore((s) => s.setIsHoldingRemote);
  const sittingState = useGameStore((s) => s.sittingState);
  const sitDown = useGameStore((s) => s.sitDown);
  const standUp = useGameStore((s) => s.standUp);
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
    setPlayerPosition([0, 0.9, 6]);
  }, [enterRoom, setPlayerPosition]);

  // Sofa position - adjusted for larger room
  const sofaPos: [number, number, number] = [0, 0, -2];
  const seatPosition: [number, number, number] = [0, 0.7, -1.7]; // Seated position on sofa
  const tablePos: [number, number, number] = [0, 0, -4];
  const remotePos: [number, number, number] = [0, 0.48, -4];
  const tvPos: [number, number, number] = [0, 3.5, -ROOM_DEPTH / 2 + 0.5];

  // Check distances and handle interactions
  useFrame(() => {
    const playerVec = new THREE.Vector3(playerPos[0], playerPos[1], playerPos[2]);
    const sofaVec = new THREE.Vector3(...sofaPos);
    const tableVec = new THREE.Vector3(...tablePos);
    
    const distToSofa = playerVec.distanceTo(sofaVec);
    const distToTable = playerVec.distanceTo(tableVec);

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
        if (distToSofa < 3) {
          setPrompt("Press E to sit on sofa");
          if (justPressedE) {
            setRoomInteractionState("sitting_sofa");
            // Sit down facing the TV
            sitDown(seatPosition, tvPos);
          }
        } else {
          setPrompt(null);
        }
        break;

      case "sitting_sofa":
        if (!isHoldingRemote) {
          setPrompt("Press E to pick up remote - Press ESC to leave");
          if (justPressedE) {
            setIsHoldingRemote(true);
            setRoomInteractionState("holding_remote");
          }
        }
        if (justPressedEsc) {
          standUp();
          setIsHoldingRemote(false);
          setIsTVOn(false);
        }
        break;

      case "holding_remote":
        setPrompt("Press E to turn on TV - Press ESC to leave");
        if (justPressedE) {
          setIsTVOn(true);
          setRoomInteractionState("watching_tv");
        }
        if (justPressedEsc) {
          setIsHoldingRemote(false);
          setRoomInteractionState("sitting_sofa");
        }
        break;

      case "watching_tv":
        setPrompt("Right click for next project - Left click to open links - Press ESC to turn off TV");
        if (justPressedEsc) {
          setIsTVOn(false);
          setRoomInteractionState("holding_remote");
        }
        break;
    }
  });

  // Handle right click for next project (left click is reserved for link navigation)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (roomInteractionState === "watching_tv" && isTVOn) {
        e.preventDefault();
        setCurrentProjectIndex((currentProjectIndex + 1) % projects.length);
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, [roomInteractionState, isTVOn, currentProjectIndex, setCurrentProjectIndex]);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>

      {/* Ceiling - higher for big TV */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_HEIGHT, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#FFF8DC" />
      </mesh>

      {/* Walls */}
      <DecorativeWall 
        position={[0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2]} 
        size={[ROOM_WIDTH, ROOM_HEIGHT, 0.3]} 
      />
      <DecorativeWall 
        position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} 
        size={[0.3, ROOM_HEIGHT, ROOM_DEPTH]}
      />
      <DecorativeWall 
        position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]} 
        size={[0.3, ROOM_HEIGHT, ROOM_DEPTH]}
      />
      <mesh receiveShadow position={[-ROOM_WIDTH / 4 - 1, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH / 2 - 2, ROOM_HEIGHT, 0.3]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[ROOM_WIDTH / 4 + 1, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH / 2 - 2, ROOM_HEIGHT, 0.3]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[0, ROOM_HEIGHT - 0.5, ROOM_DEPTH / 2]}>
        <boxGeometry args={[2.5, 1, 0.3]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Furniture */}
      <Sofa position={sofaPos} />
      <CoffeeTable position={tablePos} />
      <Remote position={remotePos} isPickedUp={isHoldingRemote} />
      <TV position={tvPos} isOn={isTVOn} currentProject={currentProjectIndex} />

      {/* Remote in hand when holding */}
      {isHoldingRemote && (
        <group position={[playerPos[0] + 0.25, playerPos[1] - 0.15, playerPos[2] - 0.3]}>
          <RemoteInHand />
        </group>
      )}

      {/* Lighting - brighter for big room */}
      <pointLight position={[0, ROOM_HEIGHT - 0.5, 0]} intensity={70} distance={20} decay={2} color="#FFF5E6" />
      <pointLight position={[-4, 3, 0]} intensity={25} distance={12} decay={2} color="#FFE4C4" />
      <pointLight position={[4, 3, 0]} intensity={25} distance={12} decay={2} color="#FFE4C4" />
      <ambientLight intensity={0.5} />

      {/* Exit door */}
      <WoodenDoor position={[0, 1.75, ROOM_DEPTH / 2 - 0.1]} rotation={[0, Math.PI, 0]} />
    </group>
  );
}