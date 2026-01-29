"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import styled from "styled-components";

gsap.registerPlugin(GSAPSplitText, useGSAP);

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

  useGSAP(
    () => {
      if (!textRef.current || !fontsLoaded) return;

      const el = textRef.current;

      // Create split text animation
      const splitInstance = new GSAPSplitText(el, {
        type: "chars",
        charsClass: "split-char",
      });

      // Animate each character
      gsap.fromTo(
        splitInstance.chars,
        {
          opacity: 0,
          y: 80,
          rotateX: -90,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
          stagger: 0.08,
        }
      );

      // Animate loader appearing
      gsap.fromTo(
        loaderRef.current,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, delay: 1, ease: "back.out(2)" }
      );

      return () => {
        splitInstance.revert();
      };
    },
    { dependencies: [fontsLoaded], scope: containerRef }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      // Fade out animation
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            setIsVisible(false);
            onComplete?.();
          },
        });
      }
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  if (!isVisible) return null;

  return (
    <StyledWrapper ref={containerRef}>
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

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    perspective: 1000px;
  }

  .title {
    font-family: "Roblox2017", sans-serif;
    font-size: clamp(3rem, 10vw, 6rem);
    font-weight: bold;
    color: #ffffff;
    text-align: center;
    margin: 0;
    letter-spacing: 0.1em;
    text-shadow: 
      1px 1px 0 #666,
      2px 2px 0 #666,
      3px 3px 0 #666,
      4px 4px 0 #666,
      5px 5px 0 #666,
      6px 6px 0 #666,
      7px 7px 0 #666,
      8px 8px 0 #666,
      9px 9px 0 #666,
      10px 10px 0 #666,
      11px 11px 0 #666,
      12px 12px 0 #666,
      13px 13px 0 #666,
      14px 14px 0 #666,
      15px 15px 30px rgba(0, 0, 0, 0.6);
    transform-style: preserve-3d;
  }

  .title .split-char {
    display: inline-block;
    transform-style: preserve-3d;
    will-change: transform, opacity;
  }

  .loader-container {
    display: flex;
    justify-content: center;
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
