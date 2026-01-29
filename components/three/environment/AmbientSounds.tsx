"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";

// Component that plays ambient sounds based on time of day using audio files
export default function AmbientSounds() {
  const timeOfDay = useGameStore((s) => s.timeOfDay);

  const birdsAudioRef = useRef<HTMLAudioElement | null>(null);
  const cricketsAudioRef = useRef<HTMLAudioElement | null>(null);
  const wolfAudioRef = useRef<HTMLAudioElement | null>(null);
  const wolfIntervalRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);
  const lastIsDayRef = useRef<boolean | null>(null);

  // Determine if it's day or night (day: 6am-7pm, night: 7pm-6am)
  const isDay = timeOfDay >= 6 && timeOfDay < 19;
  const isNight = !isDay;

  // Initialize audio elements
  useEffect(() => {
    // Create audio elements once
    if (!birdsAudioRef.current) {
      birdsAudioRef.current = new Audio("/audio/BirdsChirping.mp3");
      birdsAudioRef.current.loop = true;
      birdsAudioRef.current.volume = 0.3;
    }

    if (!cricketsAudioRef.current) {
      cricketsAudioRef.current = new Audio("/audio/CricketsBuzzing.mp3");
      cricketsAudioRef.current.loop = true;
      cricketsAudioRef.current.volume = 0.25;
    }

    if (!wolfAudioRef.current) {
      wolfAudioRef.current = new Audio("/audio/WolfHowling.mp3");
      wolfAudioRef.current.loop = false;
      wolfAudioRef.current.volume = 0.3;
    }

    // Start audio on first user interaction
    const initAudio = () => {
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      // Read the latest time from the store to avoid using a stale closure value
      const currentTime = useGameStore.getState().timeOfDay;
      const currentIsDay = currentTime >= 6 && currentTime < 19;

      // Record current day/night so the transition effect doesn't immediately re-trigger
      lastIsDayRef.current = currentIsDay;

      if (currentIsDay) {
        // Daytime: play birds and ensure night sounds are stopped
        birdsAudioRef.current?.play().catch(() => {});
        cricketsAudioRef.current?.pause();
        wolfAudioRef.current?.pause();
        if (wolfIntervalRef.current) {
          window.clearInterval(wolfIntervalRef.current);
          wolfIntervalRef.current = null;
        }
      } else {
        // Nighttime: start crickets and schedule wolf howls immediately and on interval
        cricketsAudioRef.current?.play().catch(() => {});
        birdsAudioRef.current?.pause();

        // Play a wolf howl immediately
        if (wolfAudioRef.current) {
          wolfAudioRef.current.currentTime = 0;
          wolfAudioRef.current.play().catch((err) => console.log("Wolf audio error:", err));
        }

        // Clear any previous interval and then set a new one
        if (wolfIntervalRef.current) {
          window.clearInterval(wolfIntervalRef.current);
          wolfIntervalRef.current = null;
        }

        wolfIntervalRef.current = window.setInterval(() => {
          if (wolfAudioRef.current) {
            wolfAudioRef.current.currentTime = 0;
            wolfAudioRef.current.play().catch((err) => console.log("Wolf audio error:", err));
          }
        }, 20000);
      }

      document.removeEventListener("click", initAudio);
      document.removeEventListener("keydown", initAudio);
    };

    document.addEventListener("click", initAudio);
    document.addEventListener("keydown", initAudio);

    return () => {
      document.removeEventListener("click", initAudio);
      document.removeEventListener("keydown", initAudio);
    };
  }, []);

  // Handle day/night transitions - use timeOfDay directly to ensure proper triggering
  useEffect(() => {
    if (!isInitializedRef.current) return;

    const isDaytime = timeOfDay >= 6 && timeOfDay < 19;

    // Only react when day/night changes to avoid frequent retriggers
    if (lastIsDayRef.current === isDaytime) return;
    lastIsDayRef.current = isDaytime;

    if (isDaytime) {
      // Daytime: Play birds, stop crickets and wolf
      birdsAudioRef.current?.play().catch(() => {});
      cricketsAudioRef.current?.pause();
      wolfAudioRef.current?.pause();
      
      // Clear wolf interval
      if (wolfIntervalRef.current) {
        window.clearInterval(wolfIntervalRef.current);
        wolfIntervalRef.current = null;
      }
    } else {
      // Nighttime: Play crickets, stop birds, schedule wolf howls
      cricketsAudioRef.current?.play().catch(() => {});
      birdsAudioRef.current?.pause();

      // Clear any existing wolf interval first
      if (wolfIntervalRef.current) {
        window.clearInterval(wolfIntervalRef.current);
        wolfIntervalRef.current = null;
      }

      // Play wolf immediately when night starts
      if (wolfAudioRef.current) {
        wolfAudioRef.current.currentTime = 0;
        wolfAudioRef.current.play().catch((err) => console.log("Wolf audio error:", err));
      }

      // Then play wolf every 20 seconds using window.setInterval
      wolfIntervalRef.current = window.setInterval(() => {
        if (wolfAudioRef.current) {
          wolfAudioRef.current.currentTime = 0;
          wolfAudioRef.current.play().catch((err) => console.log("Wolf audio error:", err));
        }
      }, 20000);
    }
    // Note: No cleanup here - we clear interval only when transitioning to day
  }, [timeOfDay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      birdsAudioRef.current?.pause();
      cricketsAudioRef.current?.pause();
      wolfAudioRef.current?.pause();
      
      if (wolfIntervalRef.current) {
        window.clearInterval(wolfIntervalRef.current);
      }
    };
  }, []);

  return null; // Audio-only component
}
