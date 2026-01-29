"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useGameStore } from "@/store/useGameStore";
import PortalTrigger from "./PortalTrigger";

export default function Portal({
  position,
  label,
  href,
}: {
  position: [number, number, number];
  label: string;
  href: string;
}) {
  const router = useRouter();
  const isLoading = useGameStore((s) => s.isLoading);
  const setLoading = useGameStore((s) => s.setLoading);

  const pressE = useKeyPress("KeyE");

  const [canEnter, setCanEnter] = useState(false);
  const lastPressedRef = useRef(false);

  useEffect(() => {
    // detect key press edge (pressed now but wasn't pressed last frame)
    const justPressed = pressE && !lastPressedRef.current;
    lastPressedRef.current = pressE;

    if (!justPressed) return;
    if (!canEnter) return;
    if (isLoading) return;

    setLoading(true);
    setTimeout(() => {
      router.push(href);
      setLoading(false);
    }, 200);
  }, [pressE, canEnter, isLoading, href, router, setLoading]);

  return (
    <group position={position}>
      {/* Portal frame */}
      <mesh castShadow receiveShadow position={[0, 1.3, 0]}>
        <boxGeometry args={[2.4, 2.6, 0.4]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Trigger */}
      <PortalTrigger
        position={position}
        label={label}
        onEnterReady={(ready) => setCanEnter(ready)}
      />

      {/* When player is outside, PortalTrigger will clear prompt but we also need canEnter false */}
      {/* Simple approach: if prompt disappears, canEnter stays true. We'll fix properly next step */}
    </group>
  );
}