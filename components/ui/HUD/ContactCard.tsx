"use client";

import { useUIStore } from "@/store/useUIStore";

// Contact information - update with your details
const CONTACT_INFO = {
  name: "Subrata Saha",
  email: "subrata@example.com", // Replace with your email
  phone: "+91 XXXXXXXXXX", // Replace with your phone
  message: "Feel free to reach out!",
};

export default function ContactCard() {
  const showContactCard = useUIStore((s) => s.showContactCard);
  const setShowContactCard = useUIStore((s) => s.setShowContactCard);

  if (!showContactCard) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(90vw, 400px)",
        borderRadius: 16,
        overflow: "hidden",
        border: "2px solid rgba(124, 58, 237, 0.5)",
        background: "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,10,40,0.98) 100%)",
        boxShadow: "0 0 60px rgba(124, 58, 237, 0.3)",
        pointerEvents: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)",
          padding: "20px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
          ✓ ACCESS GRANTED
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>
          Contact Information
        </div>
      </div>

      {/* Contact details */}
      <div style={{ padding: "24px" }}>
        {/* Name */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
            Name
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>
            {CONTACT_INFO.name}
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
            Email
          </div>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            style={{
              fontSize: 16,
              color: "#a855f7",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            {CONTACT_INFO.email}
          </a>
        </div>

        {/* Phone */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
            Phone
          </div>
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            style={{
              fontSize: 16,
              color: "#a855f7",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {CONTACT_INFO.phone}
          </a>
        </div>

        {/* Message */}
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            background: "rgba(124, 58, 237, 0.1)",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 14, color: "#ccc", fontStyle: "italic" }}>
            &quot;{CONTACT_INFO.message}&quot;
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#0a0a0a",
          padding: "12px 20px",
          borderTop: "1px solid #222",
          textAlign: "center",
        }}
      >
        <span style={{ color: "#555", fontSize: 11 }}>
          Press <kbd style={{ padding: "2px 6px", background: "#1a1a1a", borderRadius: 4 }}>ESC</kbd> to close
        </span>
      </div>
    </div>
  );
}
