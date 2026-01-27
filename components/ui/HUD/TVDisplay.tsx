"use client";

import { useGameStore } from "@/store/useGameStore";
import { projects } from "@/data/projects";

export default function TVDisplay() {
  const isTVOn = useGameStore((s) => s.isTVOn);
  const currentProjectIndex = useGameStore((s) => s.currentProjectIndex);
  const roomInteractionState = useGameStore((s) => s.roomInteractionState);

  if (!isTVOn || roomInteractionState !== "watching_tv") return null;

  const project = projects[currentProjectIndex] || projects[0];

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(85vw, 700px)",
        padding: 0,
        borderRadius: 12,
        overflow: "hidden",
        border: "3px solid #333",
        background: "#0a0a0a",
        boxShadow: "0 0 60px rgba(100, 100, 255, 0.3)",
        pointerEvents: "auto",
      }}
    >
      {/* TV Header bar */}
      <div
        style={{
          background: "linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #333",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#00ff00",
              boxShadow: "0 0 8px #00ff00",
            }}
          />
          <span style={{ color: "#888", fontSize: 12, fontWeight: 600 }}>PROJECT VIEWER</span>
        </div>
        <div style={{ color: "#666", fontSize: 11 }}>
          {currentProjectIndex + 1} / {projects.length}
        </div>
      </div>

      {/* Project content */}
      <div style={{ padding: "24px 28px", background: "#111" }}>
        {/* Project title */}
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              width: 4,
              height: 24,
              background: "linear-gradient(180deg, #7c3aed 0%, #a855f7 100%)",
              borderRadius: 2,
            }}
          />
          {project.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            color: "#aaa",
            lineHeight: 1.7,
            marginBottom: 20,
          }}
        >
          {project.description}
        </p>

        {/* Tech stack */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              color: "#666",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Tech Stack
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {project.techStack.map((tech, i) => (
              <span
                key={i}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "rgba(124, 58, 237, 0.2)",
                  border: "1px solid rgba(124, 58, 237, 0.4)",
                  color: "#a855f7",
                  fontSize: 12,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 16 }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 8,
                background: "#1a1a2e",
                border: "1px solid #333",
                color: "#fff",
                fontSize: 13,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = "#333")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 8,
                background: "linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)",
                color: "#fff",
                fontSize: 13,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Bottom controls hint */}
      <div
        style={{
          background: "#0a0a0a",
          padding: "10px 20px",
          borderTop: "1px solid #222",
          display: "flex",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <span style={{ color: "#555", fontSize: 11 }}>
          <kbd style={{ padding: "2px 6px", background: "#1a1a1a", borderRadius: 4, marginRight: 6 }}>
            LEFT CLICK
          </kbd>
          Next Project
        </span>
        <span style={{ color: "#555", fontSize: 11 }}>
          <kbd style={{ padding: "2px 6px", background: "#1a1a1a", borderRadius: 4, marginRight: 6 }}>
            ESC
          </kbd>
          Exit TV
        </span>
      </div>
    </div>
  );
}
