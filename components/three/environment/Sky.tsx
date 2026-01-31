"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky as DreiSky, Cloud, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/store/useGameStore";

export default function FantasySky() {
  const cloudsRef = useRef<THREE.Group>(null);
  const frameCount = useRef(0);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const setTimeOfDay = useGameStore((s) => s.setTimeOfDay);

  // Sync with real world time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      // Calculate decimal hour (e.g., 10:30 -> 10.5)
      const decimalTime = hours + minutes / 60 + seconds / 3600;
      setTimeOfDay(decimalTime);
    };

    updateTime(); // Initial set
    const interval = setInterval(updateTime, 1000 * 30); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [setTimeOfDay]);

  useFrame((_, delta) => {
    // Skip frames for cloud rotation
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;
    
    // Slower cloud movement
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.0005;
    }
  });

  // Calculate sun/moon position based on time
  const getSunPosition = (): [number, number, number] => {
    // Sun rises at 5, sets at 19
    const sunAngle = ((timeOfDay - 6) / 14) * Math.PI; // Map 6am-8pm to 0-PI

    // Day time logic
    if (timeOfDay >= 5 && timeOfDay < 19) {
      const x = Math.cos(sunAngle) * 100; // East to West movement
      const y = Math.sin(sunAngle) * 100; // Height arc
      return [-x, Math.max(y, -20), -50]; // Simple arc
    }

    // Night logic (sun hidden)
    return [0, -100, 0];
  };

  // Calculate sky parameters based on time
  const getSkyParams = () => {
    // Night: 0-5, 19-24
    // Sunrise: 5-7
    // Day: 7-17
    // Sunset: 17-19

    if (timeOfDay >= 5 && timeOfDay < 7) {
      // Sunrise
      const t = (timeOfDay - 5) / 2;
      return {
        turbidity: 10 - t * 2,
        rayleigh: 0.5 + t * 2.5,
        mieCoefficient: 0.005 + t * 0.015,
        mieDirectionalG: 0.8,
        inclination: 0.49, // fixed for sunrise effect in Drei Sky
        azimuth: 0.25,
        starsOpacity: 1 - t,
      };
    } else if (timeOfDay >= 7 && timeOfDay < 17) {
      // Day
      return {
        turbidity: 5,
        rayleigh: 1.5,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        inclination: 0.5, // Noonish
        azimuth: 0.25,
        starsOpacity: 0,
      };
    } else if (timeOfDay >= 17 && timeOfDay < 19) {
      // Sunset
      const t = (timeOfDay - 17) / 2;
      return {
        turbidity: 8 + t * 4,
        rayleigh: 3,
        mieCoefficient: 0.02,
        mieDirectionalG: 0.8,
        inclination: 0.49, // Sunset effect
        azimuth: 0.75,
        starsOpacity: t,
      };
    } else {
      // Night
      return {
        turbidity: 10,
        rayleigh: 0.1,
        mieCoefficient: 0.001,
        mieDirectionalG: 0.7,
        inclination: 0,
        azimuth: 0.25,
        starsOpacity: 1,
      };
    }
  };

  const sunPosition = getSunPosition();
  const skyParams = getSkyParams();
  const isNight = timeOfDay < 5 || timeOfDay >= 19;

  return (
    <>
      <DreiSky
        distance={450000}
        sunPosition={sunPosition}
        inclination={skyParams.inclination}
        azimuth={skyParams.azimuth}
        mieCoefficient={skyParams.mieCoefficient}
        mieDirectionalG={skyParams.mieDirectionalG}
        rayleigh={skyParams.rayleigh}
        turbidity={skyParams.turbidity}
      />

      {/* Stars visible at night */}
      <Stars
        radius={300}
        depth={60}
        count={3000}
        factor={isNight ? 5 : 0}
        saturation={0}
        fade
        speed={0.2}
      />

      {/* Moon (visible at night) */}
      {isNight && (
        <mesh position={[50, 80, -100]}>
          <sphereGeometry args={[8, 32, 32]} />
          <meshStandardMaterial
            color="#FEFCD7"
            emissive="#FEFCD7"
            emissiveIntensity={0.6}
            roughness={0.5}
          />
        </mesh>
      )}

      {/* Floating clouds - slower and darker at night */}
      <group ref={cloudsRef}>
        <Cloud position={[-30, 25, -40]} speed={0.05} opacity={isNight ? 0.2 : 0.6} color={isNight ? "#2c3e50" : "white"} />
        <Cloud position={[40, 30, -60]} speed={0.05} opacity={isNight ? 0.2 : 0.5} color={isNight ? "#2c3e50" : "white"} />
        <Cloud position={[20, 22, 50]} speed={0.05} opacity={isNight ? 0.2 : 0.7} color={isNight ? "#2c3e50" : "white"} />
      </group>
    </>
  );
}
