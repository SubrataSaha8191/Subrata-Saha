"use client";

import { useGameStore } from "@/store/useGameStore";
import { useUIStore } from "@/store/useUIStore";

export default function TelephoneUI() {
  const telephoneCode = useGameStore((s) => s.telephoneCode);
  const setTelephoneCode = useGameStore((s) => s.setTelephoneCode);
  const showTelephoneUI = useUIStore((s) => s.showTelephoneUI);

  if (!showTelephoneUI) return null;

  const handleKeyPress = (key: string) => {
    if (telephoneCode.length < 4) {
      setTelephoneCode(telephoneCode + key);
    }
  };

  const handleClear = () => {
    setTelephoneCode("");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 280,
        borderRadius: 16,
        overflow: "hidden",
        border: "2px solid #333",
        background: "#1a1a1a",
        boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        pointerEvents: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#111",
          padding: "14px 20px",
          borderBottom: "1px solid #333",
          textAlign: "center",
        }}
      >
        <div style={{ color: "#00ff00", fontSize: 11, marginBottom: 4 }}>
          ● CONNECTED
        </div>
        <div style={{ color: "#888", fontSize: 12 }}>
          Enter Access Code
        </div>
      </div>

      {/* Code display */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 45,
              height: 55,
              borderRadius: 8,
              border: "2px solid #333",
              background: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
              color: telephoneCode[i] ? "#fff" : "#333",
              fontFamily: "monospace",
            }}
          >
            {telephoneCode[i] || "•"}
          </div>
        ))}
      </div>

      {/* Keypad */}
      <div
        style={{
          padding: "10px 20px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
        }}
      >
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "←"].map((key) => (
          <button
            key={key}
            onClick={() => {
              if (key === "C") handleClear();
              else if (key === "←") setTelephoneCode(telephoneCode.slice(0, -1));
              else handleKeyPress(key);
            }}
            style={{
              padding: "14px",
              borderRadius: 8,
              border: "1px solid #333",
              background: key === "C" ? "#8B0000" : key === "←" ? "#333" : "#222",
              color: "#fff",
              fontSize: 18,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.1s",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Hint */}
      <div
        style={{
          background: "#111",
          padding: "12px 20px",
          borderTop: "1px solid #333",
          textAlign: "center",
        }}
      >
        <span style={{ color: "#555", fontSize: 11 }}>
          Press <kbd style={{ padding: "2px 6px", background: "#222", borderRadius: 4 }}>ESC</kbd> to hang up
        </span>
      </div>
    </div>
  );
}
