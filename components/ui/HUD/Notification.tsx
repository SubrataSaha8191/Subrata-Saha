"use client";

import { useUIStore } from "@/store/useUIStore";
import { useEffect } from "react";

export default function Notification() {
  const notification = useUIStore((s) => s.notification);
  const setNotification = useUIStore((s) => s.setNotification);

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  if (!notification) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "12px 24px",
        borderRadius: 8,
        background: "rgba(0, 0, 0, 0.9)",
        border: "1px solid rgba(124, 58, 237, 0.5)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        pointerEvents: "none",
        animation: "slideDown 0.3s ease-out",
      }}
    >
      <div
        style={{
          color: "#fff",
          fontSize: 14,
          fontWeight: 500,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ color: "#a855f7" }}>ℹ️</span>
        {notification}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
