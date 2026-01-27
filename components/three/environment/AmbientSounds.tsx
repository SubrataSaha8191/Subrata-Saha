"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "@/store/useGameStore";

// Component that plays ambient sounds based on time of day
export default function AmbientSounds() {
    const timeOfDay = useGameStore((s) => s.timeOfDay);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const dayGainRef = useRef<GainNode | null>(null);
    const nightGainRef = useRef<GainNode | null>(null);
    const birdNodesRef = useRef<OscillatorNode[]>([]);
    const cricketNodesRef = useRef<OscillatorNode[]>([]);
    const wolfTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Determine if it's day or night
    const isDay = timeOfDay >= 5 && timeOfDay < 19;
    const isDawn = timeOfDay >= 5 && timeOfDay < 7;
    const isDusk = timeOfDay >= 17 && timeOfDay < 19;
    const isNight = timeOfDay < 5 || timeOfDay >= 19;

    // Initialize audio context on user interaction
    useEffect(() => {
        const initAudio = () => {
            if (!audioContext) {
                const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
                setAudioContext(ctx);
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
    }, [audioContext]);

    // Create bird chirping sounds for daytime
    useEffect(() => {
        if (!audioContext || !isDay) return;

        const createBirdChirp = () => {
            if (!audioContext || audioContext.state === "closed") return;

            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();

            // Random bird frequencies (high pitched chirps)
            const baseFreq = 1000 + Math.random() * 2000;
            osc.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(
                baseFreq * (1 + Math.random() * 0.5),
                audioContext.currentTime + 0.1
            );

            osc.type = "sine";
            filter.type = "highpass";
            filter.frequency.value = 800;

            gain.gain.setValueAtTime(0, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.02);
            gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.15);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);

            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.2);
        };

        // Create random bird sounds
        const birdInterval = setInterval(() => {
            if (Math.random() < 0.3) {
                createBirdChirp();
                // Sometimes do a double chirp
                if (Math.random() < 0.5) {
                    setTimeout(createBirdChirp, 100);
                }
            }
        }, 800);

        return () => {
            clearInterval(birdInterval);
        };
    }, [audioContext, isDay]);

    // Create cricket/insect sounds for nighttime
    useEffect(() => {
        if (!audioContext || !isNight) return;

        const createCricket = () => {
            if (!audioContext || audioContext.state === "closed") return;

            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            // Cricket frequency (high pitched continuous chirp)
            osc.frequency.value = 4000 + Math.random() * 1000;
            osc.type = "square";

            gain.gain.setValueAtTime(0.01, audioContext.currentTime);

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.start(audioContext.currentTime);

            // Modulate the cricket sound
            const modulate = () => {
                if (audioContext.state === "closed") return;
                gain.gain.setValueAtTime(
                    Math.random() < 0.5 ? 0.01 : 0,
                    audioContext.currentTime
                );
            };

            const modInterval = setInterval(modulate, 50);

            setTimeout(() => {
                clearInterval(modInterval);
                osc.stop();
            }, 2000 + Math.random() * 3000);
        };

        // Create wolf howl
        const createWolfHowl = () => {
            if (!audioContext || audioContext.state === "closed") return;

            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();

            // Wolf howl - low frequency with pitch variation
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(150, audioContext.currentTime);
            osc.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.5);
            osc.frequency.linearRampToValueAtTime(180, audioContext.currentTime + 2);
            osc.frequency.linearRampToValueAtTime(140, audioContext.currentTime + 3);

            filter.type = "lowpass";
            filter.frequency.value = 400;

            gain.gain.setValueAtTime(0, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 0.3);
            gain.gain.linearRampToValueAtTime(0.015, audioContext.currentTime + 2);
            gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 3.5);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);

            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 4);
        };

        // Start crickets
        const cricketInterval = setInterval(() => {
            if (Math.random() < 0.2) {
                createCricket();
            }
        }, 1000);

        // Occasional wolf howl
        const scheduleWolf = () => {
            const delay = 15000 + Math.random() * 30000; // 15-45 seconds
            wolfTimeoutRef.current = setTimeout(() => {
                createWolfHowl();
                scheduleWolf();
            }, delay);
        };
        scheduleWolf();

        return () => {
            clearInterval(cricketInterval);
            if (wolfTimeoutRef.current) {
                clearTimeout(wolfTimeoutRef.current);
            }
        };
    }, [audioContext, isNight]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (audioContext && audioContext.state !== "closed") {
                audioContext.close();
            }
        };
    }, [audioContext]);

    return null; // This is an audio-only component
}
