"use client";

import { useUIStore } from "@/store/useUIStore";
import { useEffect, useState, useRef } from "react";

export default function DialogueBox() {
  const dialogueText = useUIStore((s) => s.dialogueText);
  const dialogueSpeaker = useUIStore((s) => s.dialogueSpeaker);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Typewriter effect
  useEffect(() => {
    if (!dialogueText) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    setDisplayedText("");
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index < dialogueText.length) {
        setDisplayedText(dialogueText.slice(0, index + 1));
        index++;
        
        // Play typing sound (optional)
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [dialogueText]);

  if (!dialogueText) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(90vw, 600px)",
        padding: "16px 20px",
        borderRadius: 16,
        border: "2px solid rgba(255, 255, 255, 0.2)",
        background: "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,40,0.95) 100%)",
        backdropFilter: "blur(10px)",
        pointerEvents: "auto",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Speaker name */}
      {dialogueSpeaker && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: 20,
            padding: "4px 12px",
            borderRadius: 8,
            background: "linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.5px",
          }}
        >
          {dialogueSpeaker}
        </div>
      )}
      
      {/* Dialogue text */}
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.6,
          color: "#fff",
          minHeight: 50,
        }}
      >
        {displayedText}
        {isTyping && (
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 16,
              background: "#7c3aed",
              marginLeft: 2,
              animation: "blink 0.5s infinite",
            }}
          />
        )}
      </div>

      {/* Continue indicator */}
      {!isTyping && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 16,
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          ...
        </div>
      )}

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
