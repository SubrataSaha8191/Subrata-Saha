"use client";

import MobileJoystick from "./MobileJoystick";
import MobileActionButtons from "./MobileActionButtons";
import MobileTouchCamera from "./MobileTouchCamera";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function MobileControls() {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <>
      <MobileJoystick />
      <MobileActionButtons />
      <MobileTouchCamera />
    </>
  );
}
