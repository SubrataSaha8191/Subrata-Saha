"use client";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  minDuration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Load custom font
  useEffect(() => {
    const font = new FontFace(
      "Roblox2017",
      "url(/fonts/Roblox2017-v6dO.ttf)"
    );
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontsLoaded(true);
    }).catch(() => {
      // Fallback if font fails to load
      setFontsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!textRef.current || !fontsLoaded) return;
    // No JS-driven animation to keep preloader smooth
  }, [fontsLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const done = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 800);
      return () => clearTimeout(done);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  if (!isVisible) return null;

  return (
    <StyledWrapper ref={containerRef} data-fade-out={isFadingOut}>
      <div className="content">
        <h1 ref={textRef} className="title" style={{ visibility: fontsLoaded ? 'visible' : 'hidden' }}>
          SUBRATA SAHA
        </h1>
        <div ref={loaderRef} className="loader-container">
          <div className="loader" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  @font-face {
    font-family: "Roblox2017";
    src: url("/fonts/Roblox2017-v6dO.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #000000 50%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 1;
  transition: opacity 0.8s ease-in-out;

  &[data-fade-out="true"] {
    opacity: 0;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
  }

  .title {
    font-family: "Roblox2017", sans-serif;
    font-size: clamp(3rem, 10vw, 6rem);
    font-weight: bold;
    color: #ffffff;
    text-align: center;
    margin: 0;
    letter-spacing: 0.1em;
    text-shadow: 2px 2px 12px rgba(0, 0, 0, 0.6);
    animation: fadeInTitle 0.6s ease-out both;
  }

  .loader-container {
    display: flex;
    justify-content: center;
    animation: popIn 0.4s ease-out both;
    animation-delay: 0.2s;
  }

  .loader {
    width: 56px;
    height: 56px;
    position: relative;
  }

  .loader:before {
    content: "";
    width: 56px;
    height: 6px;
    background: rgba(255, 255, 255, 0.3);
    position: absolute;
    top: 70px;
    left: 0;
    border-radius: 50%;
    animation: shadow324 0.5s linear infinite;
  }

  .loader:after {
    content: "";
    width: 100%;
    height: 100%;
    background: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
      0 0 20px rgba(255, 255, 255, 0.3);
    animation: jump7456 0.5s linear infinite;
  }

  @keyframes fadeInTitle {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes popIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes jump7456 {
    15% {
      border-bottom-right-radius: 3px;
    }

    25% {
      transform: translateY(9px) rotate(22.5deg);
    }

    50% {
      transform: translateY(18px) scale(1, 0.9) rotate(45deg);
      border-bottom-right-radius: 40px;
    }

    75% {
      transform: translateY(9px) rotate(67.5deg);
    }

    100% {
      transform: translateY(0) rotate(90deg);
    }
  }

  @keyframes shadow324 {
    0%,
    100% {
      transform: scale(1, 1);
    }

    50% {
      transform: scale(1.2, 1);
    }
  }
`;

export default Preloader;
