"use client";

import { useGameStore } from "@/store/useGameStore";
import { skills } from "@/data/skills";

export default function ComputerDisplay() {
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);

  if (roomInteractionState !== "using_computer") return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(85vw, 650px)",
        borderRadius: 12,
        overflow: "hidden",
        border: "2px solid #333",
        background: "#0d1117",
        boxShadow: "0 0 40px rgba(33, 150, 243, 0.2)",
        pointerEvents: "auto",
      }}
    >
      {/* Terminal header */}
      <div
        style={{
          background: "#161b22",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid #30363d",
        }}
      >
        {/* Window buttons */}
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27ca3f" }} />
        </div>
        <span style={{ marginLeft: 12, color: "#8b949e", fontSize: 12 }}>
          skills@portfolio:~
        </span>
      </div>

      {/* Terminal content */}
      <div
        style={{
          padding: "20px 24px",
          fontFamily: "'Fira Code', 'Consolas', monospace",
          fontSize: 13,
          lineHeight: 1.8,
        }}
      >
        {/* Command */}
        <div style={{ color: "#8b949e", marginBottom: 16 }}>
          <span style={{ color: "#7ee787" }}>➜</span>
          <span style={{ color: "#79c0ff" }}> ~</span>
          <span style={{ color: "#c9d1d9" }}> cat skills.json</span>
        </div>

        {/* JSON output */}
        <div style={{ color: "#c9d1d9" }}>
          <span style={{ color: "#ff7b72" }}>{"{"}</span>
          <br />
          <span style={{ marginLeft: 20, display: "inline-block" }}>
            <span style={{ color: "#7ee787" }}>&quot;developer&quot;</span>
            <span style={{ color: "#c9d1d9" }}>: </span>
            <span style={{ color: "#a5d6ff" }}>&quot;Subrata Saha&quot;</span>
            <span style={{ color: "#c9d1d9" }}>,</span>
          </span>
          <br />
          <span style={{ marginLeft: 20, display: "inline-block" }}>
            <span style={{ color: "#7ee787" }}>&quot;technical_skills&quot;</span>
            <span style={{ color: "#c9d1d9" }}>: [</span>
          </span>
          <br />
          {skills.map((skill, i) => (
            <div key={i} style={{ marginLeft: 40 }}>
              <span style={{ color: "#a5d6ff" }}>&quot;{skill}&quot;</span>
              {i < skills.length - 1 && <span style={{ color: "#c9d1d9" }}>,</span>}
            </div>
          ))}
          <span style={{ marginLeft: 20, color: "#c9d1d9" }}>],</span>
          <br />
          <span style={{ marginLeft: 20, display: "inline-block" }}>
            <span style={{ color: "#7ee787" }}>&quot;learning&quot;</span>
            <span style={{ color: "#c9d1d9" }}>: </span>
            <span style={{ color: "#79c0ff" }}>true</span>
            <span style={{ color: "#c9d1d9" }}>,</span>
          </span>
          <br />
          <span style={{ marginLeft: 20, display: "inline-block" }}>
            <span style={{ color: "#7ee787" }}>&quot;open_to_work&quot;</span>
            <span style={{ color: "#c9d1d9" }}>: </span>
            <span style={{ color: "#79c0ff" }}>true</span>
          </span>
          <br />
          <span style={{ color: "#ff7b72" }}>{"}"}</span>
        </div>

        {/* Cursor */}
        <div style={{ marginTop: 16, color: "#8b949e" }}>
          <span style={{ color: "#7ee787" }}>➜</span>
          <span style={{ color: "#79c0ff" }}> ~</span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 16,
              background: "#c9d1d9",
              marginLeft: 8,
              animation: "blink 1s infinite",
            }}
          />
        </div>
      </div>

      {/* Bottom hint */}
      <div
        style={{
          background: "#161b22",
          padding: "10px 20px",
          borderTop: "1px solid #30363d",
          textAlign: "center",
        }}
      >
        <span style={{ color: "#484f58", fontSize: 11 }}>
          Press <kbd style={{ padding: "2px 6px", background: "#21262d", borderRadius: 4 }}>ESC</kbd> to stop using computer
        </span>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
