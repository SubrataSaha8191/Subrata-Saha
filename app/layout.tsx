import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subrata Saha",
  description: "A Roblox-style 3D portfolio built with Next.js + React Three Fiber",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}