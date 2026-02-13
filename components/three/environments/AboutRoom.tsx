"use client";

import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMobileAwareKeyPress } from "@/hooks/useMobileAwareKeyPress";
import { useIsMobile } from "@/hooks/useIsMobile";
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
        <cylinderGeometry args={[1.1, 1.1, 0.06, 42]} />
        <meshStandardMaterial color="#5D4037" roughness={0.7} />
      </mesh>
      {/* Table leg */}
      <mesh castShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 12]} />
        <meshStandardMaterial color="#4E342E" roughness={0.8} />
      </mesh>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.7, 0.5, 0.4, 16]} />
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
  const isMobile = useIsMobile();
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
        window.sessionStorage.setItem("skipPreloaderOnce", "1");
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
        <boxGeometry args={[4, 5, 0.15]} />
        <meshStandardMaterial color="#3a2718" roughness={0.8} />
      </mesh>
      {/* Door panels */}
      <mesh castShadow position={[0, 1.2, 0.08]}>
        <boxGeometry args={[3, 1.4, 0.08]} />
        <meshStandardMaterial color="#4a3728" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, -0.6, 0.08]}>
        <boxGeometry args={[3, 1.4, 0.08]} />
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
  const isMobile = useIsMobile();
  const playerPos = useGameStore((s) => s.playerPosition);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);
  const setRoomInteractionState = useGameStore((s) => s.setRoomInteractionState);
  const dialogueIndex = useGameStore((s) => s.dialogueIndex);
  const setDialogueIndex = useGameStore((s) => s.setDialogueIndex);
  const isDialogueActive = useGameStore((s) => s.isDialogueActive);
  const setIsDialogueActive = useGameStore((s) => s.setIsDialogueActive);
  const sittingState = useGameStore((s) => s.sittingState);
  const sitDown = useGameStore((s) => s.sitDown);
  const standUp = useGameStore((s) => s.standUp);
  const enterRoom = useGameStore((s) => s.enterRoom);
  
  const setPrompt = useUIStore((s) => s.setInteractionPrompt);
  const setDialogueText = useUIStore((s) => s.setDialogueText);

  useFrame(() => {
    // Wall collision/bounds - skip when sitting
    const player = useGameStore.getState().playerObject;
    const currentSittingState = useGameStore.getState().sittingState;
    
    if (currentSittingState.isSitting) return;
    
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
  const setDialogueSpeaker = useUIStore((s) => s.setDialogueSpeaker);
  
  const pressE = useMobileAwareKeyPress("KeyE");
  const pressQ = useMobileAwareKeyPress("KeyQ");
  const pressEsc = useMobileAwareKeyPress("Escape");
  const lastERef = useRef(false);
  const lastQRef = useRef(false);
  const lastEscRef = useRef(false);

  const [npcSipping, setNpcSipping] = useState(false);
  const [playerHoldingCoffee, setPlayerHoldingCoffee] = useState(false);
  const [playerSipping, setPlayerSipping] = useState(false);
  const sipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dialogueTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Play a short "sip" sound. Tries /audio/sip.mp3 first, falls back to Web Audio synth if not available.
  const playSipSound = () => {
    if (typeof window === "undefined") return;

    const fallback = () => {
      try {
        const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const now = ctx.currentTime;

        // Sine tone for body
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.6, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);

        // Light filtered noise for the "sip" texture
        const bufferSize = Math.floor(ctx.sampleRate * 0.18);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / bufferSize);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "lowpass";
        noiseFilter.frequency.setValueAtTime(1500, now);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.6, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.2);
      } catch (e) {
        // no-op if WebAudio unavailable
      }
    };

    // Try public root first ("/sip.mp3") since you added the file there; then fall back to "/audio/sip.mp3"; finally fall back to synthesized audio
    const tryPlay = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        try {
          const a = new Audio(src);
          a.volume = 0.9;
          a.play().then(() => resolve()).catch((err) => reject(err));
        } catch (err) {
          reject(err);
        }
      });
    };

    (async () => {
      const sources = ['/sip.mp3', '/audio/sip.mp3'];
      for (const s of sources) {
        try {
          await tryPlay(s);
          return;
        } catch (e) {
          // try next source
        }
      }
      fallback();
    })();
  };

  // Enter room on mount
  useEffect(() => {
    enterRoom("about");
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
  const seatPosition: [number, number, number] = [0, 0.7, 3.3]; // Seated position
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

    const justPressedE = pressE && !lastERef.current;
    lastERef.current = pressE;

    const justPressedQ = pressQ && !lastQRef.current;
    lastQRef.current = pressQ;

    const justPressedEsc = pressEsc && !lastEscRef.current;
    lastEscRef.current = pressEsc;

    // Keep player locked when sitting
    if (sittingState.isSitting) {
      setPlayerPosition(sittingState.seatPosition);
    }

    switch (roomInteractionState) {
      case "none":
        if (distToSofa < 2.5) {
          setPrompt(isMobile ? "Tap E to sit on sofa" : "Press E to sit on sofa");
          if (justPressedE) {
            setRoomInteractionState("talking_npc");
            setIsDialogueActive(true);
            setDialogueIndex(0);
            // Sit down facing the NPC
            sitDown(seatPosition, npcSofaPos);
          }
        } else {
          setPrompt(null);
        }
        break;

      case "talking_npc":
        if (!playerHoldingCoffee) {
          setPrompt(
            isMobile
              ? "Tap E to pick up coffee - Tap ✕ to leave"
              : "Press E to pick up coffee - Press ESC to leave"
          );
          if (justPressedE) {
            setPlayerHoldingCoffee(true);
            setRoomInteractionState("holding_coffee");
          }
        }
        if (justPressedEsc) {
          setIsDialogueActive(false);
          standUp();
          setPlayerHoldingCoffee(false);
        }
        break;

      case "holding_coffee":
        setPrompt(
          isMobile
            ? "Tap Sip to sip coffee - Tap ✕ to leave"
            : "Press Q to sip coffee - Press ESC to leave"
        );
        if (justPressedQ && !playerSipping) {
          setPlayerSipping(true);
          // play the sip sound (file first, fallback to WebAudio synth)
          playSipSound();
          sipTimerRef.current = setTimeout(() => setPlayerSipping(false), 1000);
        }
        if (justPressedEsc) {
          setIsDialogueActive(false);
          standUp();
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
      
      {/* Coffee mug in player hand when holding - fixed position relative to seated player */}
      {playerHoldingCoffee && sittingState.isSitting && (
        <group position={[sittingState.seatPosition[0] + 0.25, sittingState.seatPosition[1] + 0.1, sittingState.seatPosition[2] - 0.25]}>
          {/* Coffee mug */}
          <mesh castShadow rotation={playerSipping ? [-0.5, 0, 0] : [0, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.05, 0.1, 16]} />
            <meshStandardMaterial color="#8B4513" roughness={0.7} />
          </mesh>
          {/* Mug handle */}
          <mesh castShadow position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.03, 0.012, 8, 12, Math.PI]} />
            <meshStandardMaterial color="#654321" roughness={0.8} />
          </mesh>
          {/* Coffee liquid */}
          <mesh position={[0, 0.04, 0]} rotation={playerSipping ? [-0.5, 0, 0] : [0, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.045, 0.02, 16]} />
            <meshStandardMaterial color="#3E2723" />
          </mesh>
          {/* Steam effect when not sipping */}
          {!playerSipping && (
            <group position={[0, 0.08, 0]}>
              {[0, 0.03, 0.06].map((y, i) => (
                <mesh key={i} position={[Math.sin(Date.now() * 0.002 + i) * 0.01, y, 0]}>
                  <sphereGeometry args={[0.008, 4, 4]} />
                  <meshStandardMaterial color="#ffffff" transparent opacity={0.3 - i * 0.1} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      )}
      
      {/* Lighting */}
      <pointLight position={[0, ROOM_HEIGHT - 0.5, 0]} intensity={45} distance={14} decay={2} color="#FFF5E6" />
      <pointLight position={[-3, 2, 0]} intensity={15} distance={8} decay={2} color="#FFE4C4" />
      <pointLight position={[3, 2, 0]} intensity={15} distance={8} decay={2} color="#FFE4C4" />
      <ambientLight intensity={0.4} />

      {/* Exit door */}
      <WoodenDoor position={[0, 1.75, ROOM_DEPTH / 2 - 0.1]} rotation={[0, Math.PI, 0]} />
    </group>
  );
}
