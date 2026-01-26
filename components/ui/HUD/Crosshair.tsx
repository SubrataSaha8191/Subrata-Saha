"use client";

export default function Crosshair() {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 10,
        height: 10,
        borderRadius: 999,
        border: "1px solid rgba(232,238,252,0.7)",
        opacity: 0.7,
      }}
    />
  );
}