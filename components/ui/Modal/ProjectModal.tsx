"use client";

import Modal from "./Modal";
import type { Project } from "@/types/project";

export default function ProjectModal({
  open,
  project,
  onClose,
}: {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <Modal open={open} title={project?.title ?? "Project"} onClose={onClose}>
      {!project ? (
        <div style={{ color: "var(--muted)" }}>No project selected.</div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>
            {project.description}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {project.techStack.map((t) => (
              <span
                key={t}
                style={{
                  border: "1px solid var(--border)",
                  background: "rgba(232,238,252,0.06)",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  border: "1px solid var(--border)",
                  background: "rgba(232,238,252,0.06)",
                  padding: "8px 12px",
                  borderRadius: 12,
                }}
              >
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  border: "1px solid var(--border)",
                  background: "rgba(232,238,252,0.06)",
                  padding: "8px 12px",
                  borderRadius: 12,
                }}
              >
                Live Demo
              </a>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}