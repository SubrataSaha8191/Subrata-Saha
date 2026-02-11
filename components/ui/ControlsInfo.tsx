"use client";

import { useState } from "react";
import { useGameStore } from "@/store/useGameStore";

export default function ControlsInfo() {
    const [isOpen, setIsOpen] = useState(false);
    const cameraMode = useGameStore((s) => s.cameraMode);

    return (
        <>
            {/* Info Button - positioned above the customizer button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full 
                   bg-linear-to-br from-gray-600 to-black 
                   hover:from-gray-400 hover:via-gray-300 hover:to-gray-200
                   shadow-lg shadow-gray-500/30 group text-white hover:text-black
                   flex items-center justify-center
                   transition-all duration-300 hover:scale-100
                   border-2 border-white/20 cursor-pointer"
                title="Controls Info"
            >
                <span className="text-2xl font-bold">i</span>
            </button>

            {/* Controls Panel */}
            {isOpen && (
            import { useIsMobile } from "@/hooks/useIsMobile";
                <div className="fixed bottom-40 right-6 z-50 
                        bg-linear-to-br from-gray-900/95 to-gray-800/95 
                        backdrop-blur-xl rounded-2xl p-5
                        border border-white/10 shadow-2xl shadow-blue-500/20
                const isMobile = useIsMobile();

                const buttonPosition = isMobile
                    ? "fixed top-20 right-4"
                    : "fixed bottom-24 right-6";
                const panelPosition = isMobile
                    ? "fixed top-36 right-4"
                    : "fixed bottom-40 right-6";
                        min-w-70">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <span>🎮</span> Controls
                        </h3>
                        <button
                            className={`${buttonPosition} z-50 w-14 h-14 rounded-full 
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Current Mode Indicator */}
                    <div className="mb-4 p-3 rounded-xl bg-linear-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                        <span className="text-gray-400 text-sm">Current Mode:</span>
                        <span className="ml-2 text-white font-semibold">
                            {cameraMode === "fpp" ? "🎯 First Person (FPP)" : " 👁️ Third Person (TPP)"}
                        </span>
                    </div>

                            <div className={`${panelPosition} z-50 
                        {/* Movement */}
                        <div className="space-y-2">
                            <h4 className="text-purple-400 font-semibold text-sm uppercase tracking-wider">Movement</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <ControlItem keys={["W", "A", "S", "D"]} action="Move" />
                                <ControlItem keys={["↑", "←", "↓", "→"]} action="Move (Alt)" />
                                <ControlItem keys={["Shift"]} action="Sprint" />
                                <ControlItem keys={["Space"]} action="Jump" />
                                <ControlItem keys={["Joystick (Mobile)"]} action="Move" />
                                <ControlItem keys={["Tap ⬆ (Mobile)"]} action="Jump" />
                            </div>
                        </div>

                        {/* Camera */}
                        <div className="space-y-2">
                            <h4 className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Camera</h4>
                            <div className="space-y-2 text-sm">
                                <ControlItem keys={["Scroll ↓"]} action="Enter FPP Mode" />
                                <ControlItem keys={["Scroll ↑"]} action="Enter TPP Mode" />
                                {cameraMode === "tpp" ? (
                                    <ControlItem keys={["Right Click + Drag"]} action="Rotate Camera" />
                                ) : (
                                    <ControlItem keys={["Move Mouse"]} action="Look Around" />
                                )}
                            </div>
                        </div>

                        {/* Interaction */}
                        <div className="space-y-2">
                            <h4 className="text-green-400 font-semibold text-sm uppercase tracking-wider">Interaction</h4>
                            <div className="text-sm">
                                <ControlItem keys={["E"]} action="Enter Portal" />
                                <ControlItem keys={["Tap E (Mobile)"]} action="Enter Portal / Interact" />
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="mt-4 pt-3 border-t border-white/10">
                        <p className="text-gray-400 text-xs italic">
                            💡 Tip: Scroll all the way in to enter first-person view!
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

function ControlItem({ keys, action }: { keys: string[]; action: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                {keys.map((key, i) => (
                    <kbd
                        key={i}
                        className="px-2 py-1 bg-gray-700/50 rounded-md text-white text-xs font-mono
                       border border-gray-600/50 shadow-sm"
                    >
                        {key}
                    </kbd>
                ))}
            </div>
            <span className="text-gray-300">{action}</span>
        </div>
    );
}
