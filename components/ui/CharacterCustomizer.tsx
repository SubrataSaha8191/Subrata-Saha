"use client";

import { useCharacterStore, CharacterOutfit } from "@/store/useCharacterStore";
import { useIsMobile } from "@/hooks/useIsMobile";

const outfits: { id: CharacterOutfit; label: string; icon: string }[] = [
    { id: "casual", label: "Casual", icon: "👕" },
    { id: "dinosaur", label: "Dinosaur", icon: "🦖" },
    { id: "rugby", label: "Rugby Player", icon: "🏉" },
    { id: "santa", label: "Santa Claus", icon: "🎅" },
    { id: "robot", label: "Robot", icon: "🤖" },
];

export default function CharacterCustomizer() {
    const { currentOutfit, isCustomizerOpen, setOutfit, toggleCustomizer } = useCharacterStore();
    const isMobile = useIsMobile();

    const buttonPosition = isMobile
        ? "fixed top-20 left-4"
        : "fixed bottom-6 right-6";
    const panelPosition = isMobile
        ? "fixed top-36 left-4"
        : "fixed bottom-24 right-6";

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={toggleCustomizer}
                className={`${buttonPosition} z-50 w-14 h-14 rounded-full 
                   bg-linear-to-br from-purple-600 to-pink-600 
                   hover:from-purple-500 hover:to-pink-500
                   shadow-lg shadow-purple-500/30 
                   flex items-center justify-center ml-62 mt-10
                   transition-all duration-300 hover:scale-110
                   border-2 border-white/20`}
                title="Customize Character"
            >
                <span className="text-2xl">👤</span>
            </button>

            {/* Customizer Panel */}
            {isCustomizerOpen && (
                <div
                    className={`${panelPosition} z-50 
                        bg-linear-to-br from-gray-900/95 to-gray-800/95 
                        backdrop-blur-xl rounded-2xl p-5
                        border border-white/10 shadow-2xl shadow-purple-500/20
                        min-w-50`}
                >
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <span>✨</span> Choose Outfit
                    </h3>

                    <div className="flex flex-col gap-2">
                        {outfits.map((outfit) => (
                            <button
                                key={outfit.id}
                                onClick={() => setOutfit(outfit.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl
                           transition-all duration-200
                           ${currentOutfit === outfit.id
                                        ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                        : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <span className="text-2xl">{outfit.icon}</span>
                                <span className="font-medium">{outfit.label}</span>
                                {currentOutfit === outfit.id && (
                                    <span className="ml-auto text-green-400">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
