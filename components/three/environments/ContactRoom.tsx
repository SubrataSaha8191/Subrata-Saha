"use client";

import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useMobileAwareKeyPress } from "@/hooks/useMobileAwareKeyPress";
import { useGameStore } from "@/store/useGameStore";
import { useUIStore } from "@/store/useUIStore";
import Portal from "../interactables/Portal";
import { useRouter } from "next/navigation";

// Room dimensions
const ROOM_WIDTH = 10;
const ROOM_DEPTH = 10;
const ROOM_HEIGHT = 5;
const WALL_COLOR = "#5A5A5A"; // Lighter industrial
const SECRET_CODE = "4582";

// Generator component
function Generator({ position, isOn, onInteract }: { 
  position: [number, number, number]; 
  isOn: boolean;
  onInteract?: () => void;
}) {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame(({ clock }) => {
    if (lightRef.current && isOn) {
      // Flickering effect
      lightRef.current.intensity = 2 + Math.sin(clock.getElapsedTime() * 20) * 0.3;
    }
  });

  return (
    <group position={position} scale={3.5}>
      {/* Main body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.9, 0.4]} />
        <meshStandardMaterial color="#2D2D2D" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Control panel */}
      <mesh position={[0, 0.15, 0.21]}>
        <boxGeometry args={[0.3, 0.25, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      {/* Power switch */}
      <mesh position={[0, 0.2, 0.23]} rotation={[isOn ? 0.5 : -0.5, 0, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.03]} />
        <meshStandardMaterial color={isOn ? "#4CAF50" : "#F44336"} />
      </mesh>
      {/* Indicator light */}
      <mesh position={[0, 0.05, 0.22]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial 
          color={isOn ? "#00FF00" : "#330000"} 
          emissive={isOn ? "#00FF00" : "#000000"}
          emissiveIntensity={isOn ? 2 : 0}
        />
      </mesh>
      {/* Vents */}
      {[-0.15, 0, 0.15].map((y, i) => (
        <mesh key={i} position={[0, -0.25 + y * 0.5, 0.21]}>
          <boxGeometry args={[0.4, 0.03, 0.01]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
      {/* Exhaust pipe */}
      <mesh castShadow position={[0.2, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.15, 8]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Plug/outlet */}
      <mesh position={[-0.2, -0.2, 0.21]}>
        <boxGeometry args={[0.1, 0.08, 0.02]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Glow when on */}
      {isOn && (
        <pointLight ref={lightRef} position={[0, 0, 0.3]} color="#00FF00" intensity={2} distance={3} decay={2} />
      )}
    </group>
  );
}

// Telephone component (wall-mounted)
function Telephone({ position, hasPower }: { position: [number, number, number]; hasPower: boolean }) {
  return (
    <group position={position} scale={4.5}>
      {/* Phone body */}
      <mesh castShadow>
        <boxGeometry args={[0.25, 0.35, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      {/* Handset cradle */}
      <mesh position={[0, 0.08, 0.06]}>
        <boxGeometry args={[0.2, 0.06, 0.04]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Handset */}
      <group position={[0, 0.1, 0.08]}>
        {/* Handle */}
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.04, 0.04]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
        {/* Earpiece */}
        <mesh castShadow position={[-0.08, 0.02, 0]}>
          <cylinderGeometry args={[0.025, 0.03, 0.04, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Mouthpiece */}
        <mesh castShadow position={[0.08, 0.02, 0]}>
          <cylinderGeometry args={[0.025, 0.03, 0.04, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
      {/* Keypad */}
      <group position={[0, -0.08, 0.051]}>
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <mesh key={`${row}-${col}`} position={[(col - 1) * 0.05, (1 - row) * 0.05, 0]}>
              <boxGeometry args={[0.035, 0.035, 0.01]} />
              <meshStandardMaterial color={hasPower ? "#3a3a3a" : "#2a2a2a"} />
            </mesh>
          ))
        )}
        {/* 0 key */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.035, 0.035, 0.01]} />
          <meshStandardMaterial color={hasPower ? "#3a3a3a" : "#2a2a2a"} />
        </mesh>
      </group>
      {/* Power indicator */}
      <mesh position={[0.08, 0.13, 0.051]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial 
          color={hasPower ? "#00FF00" : "#330000"} 
          emissive={hasPower ? "#00FF00" : "#000000"}
          emissiveIntensity={hasPower ? 1 : 0}
        />
      </mesh>
      {/* Cord */}
      <mesh position={[0, -0.2, 0.03]}>
        <cylinderGeometry args={[0.008, 0.008, 0.1, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

// Secret message above door - appears only when player discovers it after entering the room
function SecretMessage({ position }: { position: [number, number, number] }) {
  const playerPos = useGameStore((s) => s.playerPosition);
  const isInRoom = useGameStore((s) => s.isInRoom);
  const currentRoom = useGameStore((s) => s.currentRoom);
  const [revealed, setRevealed] = useState(false);
  const REVEAL_DISTANCE = 1.5; // player must be very close to reveal

  useEffect(() => {
    // Reset reveal when player leaves the room so they must find it again next visit
    if (!isInRoom || currentRoom !== "contact") {
      if (revealed) setRevealed(false);
      return;
    }

    // Use planar distance (ignore vertical difference) so player can discover the note without getting to ceiling height
    const dx = playerPos[0] - position[0];
    const dz = playerPos[2] - position[2];
    const planarDist = Math.hypot(dx, dz);
    const REVEAL_PLANAR = 2.5; // horizontal proximity to reveal

    if (planarDist < REVEAL_PLANAR && !revealed) setRevealed(true);
  }, [playerPos, position, revealed, isInRoom, currentRoom]);

  if (!revealed) return null;

  return (
    <group position={position}>
      {/* Sticky note background */}
      <mesh>
        <planeGeometry args={[6, 2.2]} />
        <meshStandardMaterial color="#FFE87C" roughness={0.9} />
      </mesh>

      {/* Actual readable text using Html */}
      <Html
        position={[0, 0, 0.02]}
        rotation={[0, Math.PI, 0]}
        transform
        distanceFactor={1.8}
        style={{
          width: '550px',
          padding: '20px',
          color: '#000000',
          fontSize: '18px',
          fontFamily: 'Comic Sans MS, cursive',
          textAlign: 'center',
          lineHeight: '1.5',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Hello there, I'm Subrata's one of the</p>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>mischievous friend and I like to expose</p>
          <p style={{ margin: '0 0 12px 0', fontWeight: 600 }}>his secrets. The access code of the</p>
          <p style={{ margin: '0 0 12px 0', fontWeight: 600 }}>telephone is <span style={{ fontSize: '32px', fontWeight: 'bold' }}>4582</span></p>
          <p style={{ margin: '0', fontWeight: 600, fontSize: '20px' }}>Thank me later! </p>
        </div>
      </Html>

      {/* Shadow/edge for sticky note effect */}
      <mesh position={[0.05, -0.05, -0.005]}>
        <planeGeometry args={[6, 2.2]} />
        <meshStandardMaterial color="#D4A574" opacity={0.3} transparent />
      </mesh>

      {/* Soft light to illuminate the note */}
      <pointLight position={[0, 0, 0.8]} intensity={15} distance={3} color="#FFFACD" />
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
        <boxGeometry args={[2.2, 3.5, 0.15]} />
        <meshStandardMaterial color="#3a2718" roughness={0.8} />
      </mesh>
      {/* Door panels */}
      <mesh castShadow position={[0, 0.6, 0.08]}>
        <boxGeometry args={[2, 1.4, 0.08]} />
        <meshStandardMaterial color="#4a3728" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, -0.8, 0.08]}>
        <boxGeometry args={[2, 1.4, 0.08]} />
        <meshStandardMaterial color="#4a3728" roughness={0.7} />
      </mesh>
      {/* Door handle - single handle on door only */}
      <mesh castShadow position={[-0.7, 0, 0.15]}>
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

export default function ContactRoom() {

  useFrame(() => {
      // Wall collision/bounds
      const player = useGameStore.getState().playerObject;
      if (player) {
        const { x, z } = player.position;
        const halfWidth = ROOM_WIDTH / 2 - 0.5; // reduce by radius
        const halfDepth = ROOM_DEPTH / 2 - 0.5;
  
        // Clamp x
        if (Math.abs(x) > halfWidth) {
          player.position.x = Math.sign(x) * halfWidth;
        }
        // Clamp z (adjust for door specifically?)
        // Door is at +halfDepth. If z > halfDepth - padding?
        if (Math.abs(z) > halfDepth) {
           player.position.z = Math.sign(z) * halfDepth;
        }
      }
  });
  
  const playerPos = useGameStore((s) => s.playerPosition);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);
  const setRoomInteractionState = useGameStore((s) => s.setRoomInteractionState);
  const isGeneratorOn = useGameStore((s) => s.isGeneratorOn);
  const setIsGeneratorOn = useGameStore((s) => s.setIsGeneratorOn);
  const telephoneCode = useGameStore((s) => s.telephoneCode);
  const setTelephoneCode = useGameStore((s) => s.setTelephoneCode);
  const isCodeCorrect = useGameStore((s) => s.isCodeCorrect);
  const setIsCodeCorrect = useGameStore((s) => s.setIsCodeCorrect);
  const enterRoom = useGameStore((s) => s.enterRoom);
  
  const setPrompt = useUIStore((s) => s.setInteractionPrompt);
  const setNotification = useUIStore((s) => s.setNotification);
  const setShowTelephoneUI = useUIStore((s) => s.setShowTelephoneUI);
  const setShowContactCard = useUIStore((s) => s.setShowContactCard);
  
  const pressE = useMobileAwareKeyPress("KeyE");
  const pressEsc = useMobileAwareKeyPress("Escape");
  const lastERef = useRef(false);
  const lastEscRef = useRef(false);

  // Enter room on mount
  useEffect(() => {
    enterRoom("contact");
    // Spawn player inside room
    setPlayerPosition([0, 0.9, 4]);
    return () => {
      setShowTelephoneUI(false);
      setShowContactCard(false);
    };
  }, [enterRoom, setShowTelephoneUI, setShowContactCard]);

  // Positions
  // Moved apart to avoid collision (generator left, telephone right)
  const telephonePos: [number, number, number] = [2.0, 1.5, -ROOM_DEPTH / 2 + 0.15];
  const generatorPos: [number, number, number] = [-2.8, 0.45, -ROOM_DEPTH / 2 + 0.6];
  // Place sticky note centered above the door on front wall
  const secretNotePos: [number, number, number] = [0, ROOM_HEIGHT - 0.8, ROOM_DEPTH / 2 - 0.05];

  // Check distances and handle interactions
  useFrame(() => {
    const playerVec = new THREE.Vector3(playerPos[0], playerPos[1], playerPos[2]);
    const telephoneVec = new THREE.Vector3(...telephonePos);
    const generatorVec = new THREE.Vector3(...generatorPos);
    
    const distToTelephone = playerVec.distanceTo(telephoneVec);
    const distToGenerator = playerVec.distanceTo(generatorVec);

    // Handle E key press
    const justPressedE = pressE && !lastERef.current;
    lastERef.current = pressE;

    // Handle ESC key press
    const justPressedEsc = pressEsc && !lastEscRef.current;
    lastEscRef.current = pressEsc;

    // State machine for interactions
    switch (roomInteractionState) {
      case "none":
        // Check generator first
        if (distToGenerator < 2 && !isGeneratorOn) {
          setPrompt("Press E to interact");
          if (justPressedE) {
            setIsGeneratorOn(true);
            setNotification("Generator is now running!");
            setTimeout(() => setNotification(null), 2000);
          }
        } else if (distToTelephone < 2) {
          if (!isGeneratorOn) {
            setPrompt("Press E to use telephone");
            if (justPressedE) {
              setNotification("No power! The telephone won't work without electricity...");
              setTimeout(() => setNotification(null), 3000);
            }
          } else if (!isCodeCorrect) {
            setPrompt("Press E to use telephone");
            if (justPressedE) {
              setRoomInteractionState("using_telephone");
              setShowTelephoneUI(true);
            }
          } else {
            setPrompt("Press E to view contact info");
            if (justPressedE) {
              setShowContactCard(true);
              setRoomInteractionState("using_telephone");
            }
          }
        } else if (distToGenerator < 2 && isGeneratorOn) {
          setPrompt("Generator is running");
        } else {
          setPrompt(null);
        }
        break;

      case "using_telephone":
      case "entering_code":
        if (justPressedEsc) {
          setShowTelephoneUI(false);
          setShowContactCard(false);
          setRoomInteractionState("none");
        }
        break;
    }
  });

  // Handle code verification
  useEffect(() => {
    if (telephoneCode.length === 4) {
      if (telephoneCode === SECRET_CODE) {
        setIsCodeCorrect(true);
        setShowTelephoneUI(false);
        setShowContactCard(true);
        setNotification("Access granted! Contact information unlocked.");
        setTimeout(() => setNotification(null), 2000);
      } else {
        setNotification("Wrong code! Try again...");
        setTimeout(() => {
          setNotification(null);
          setTelephoneCode("");
        }, 1500);
      }
    }
  }, [telephoneCode, setIsCodeCorrect, setShowTelephoneUI, setShowContactCard, setNotification, setTelephoneCode]);

  return (
    <group>
      {/* Floor - concrete/industrial */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.95} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_HEIGHT, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Walls */}
      {/* Back wall (telephone wall) */}
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
      <mesh receiveShadow position={[-ROOM_WIDTH / 4 - 0.75, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH - 1.5, ROOM_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[ROOM_WIDTH / 4 + 0.75, ROOM_HEIGHT / 2, ROOM_DEPTH / 2]}>
        <boxGeometry args={[ROOM_WIDTH - 1.5, ROOM_HEIGHT, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      {/* Above door */}
      <mesh receiveShadow position={[0, ROOM_HEIGHT - 0.5, ROOM_DEPTH / 2]}>
        <boxGeometry args={[2, 1, 0.2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Secret note above entry door */}
      <SecretMessage position={secretNotePos} />

      {/* Objects */}
      <Telephone position={telephonePos} hasPower={isGeneratorOn} />
      <Generator position={generatorPos} isOn={isGeneratorOn} />

      {/* Exposed pipes on ceiling */}
      {[-2, 0, 2].map((x, i) => (
        <mesh key={i} position={[x, ROOM_HEIGHT - 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, ROOM_DEPTH - 0.5, 8]} />
          <meshStandardMaterial color="#5D5D5D" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* Industrial light fixture */}
      <group position={[0, ROOM_HEIGHT - 0.3, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.1, 8]} />
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color={isGeneratorOn ? "#FFFF99" : "#1a1a1a"} 
            emissive={isGeneratorOn ? "#FFFF00" : "#000000"}
            emissiveIntensity={isGeneratorOn ? 0.5 : 0}
          />
        </mesh>
      </group>

      {/* Lighting - changes based on generator */}
      {isGeneratorOn ? (
        <>
          <pointLight position={[0, ROOM_HEIGHT - 0.5, 0]} intensity={45} distance={14} decay={2} color="#FFF5B1" />
          <ambientLight intensity={0.45} />
        </>
      ) : (
        <>
          <pointLight position={[0, ROOM_HEIGHT - 0.5, 0]} intensity={12} distance={12} decay={2} color="#666680" />
          <ambientLight intensity={0.25} />
        </>
      )}

      {/* Exit door */}
      <WoodenDoor position={[0, 1.75, ROOM_DEPTH / 2 - 0.1]} rotation={[0, Math.PI, 0]} />
    </group>
  );
}
