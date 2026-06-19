import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import * as Icons from 'lucide-react';
import { playSound } from '../lib/sound';

interface GameOverModalProps {
    isOpen: boolean;
    score: number;
    language: 'en' | 'it';
    soundVolume: number;
    onRetry: () => void;
    onQuit: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, score, language, soundVolume, onRetry, onQuit }) => {
    const t = TRANSLATIONS[language] as any;
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsExiting(false);
            try {
                playSound('slash', soundVolume);
                setTimeout(() => playSound('fall', soundVolume), 300);
            } catch(e) {}
        }
    }, [isOpen, soundVolume]);

    const handleRetry = () => {
        playSound('click', soundVolume);
        setIsExiting(true);
        setTimeout(() => onRetry(), 300);
    };

    const handleQuitMenu = () => {
        playSound('click', soundVolume);
        setIsExiting(true);
        setTimeout(() => onQuit(), 300);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-p5-ui p-4 pointer-events-auto overflow-hidden">
             <div className={`absolute inset-0 bg-black/80 backdrop-blur-md ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`} />
             <div className="absolute inset-0 pointer-events-none scanlines opacity-30 mix-blend-overlay" />
             
             <div className={`relative z-10 w-full max-w-lg ${isExiting ? 'scale-75 opacity-0 transition-all duration-300' : 'animate-slam-in scale-100 opacity-100'}`}>
                 <div className="absolute -inset-2 bg-gradient-to-r from-p5-red via-p5-yellow to-p5-red shadow-neon-pink transform -rotate-1 pointer-events-none opacity-50 blur-sm" />
                 
                 <div className="relative bg-[#050510] border-4 border-p5-red p-8 shadow-hard-black flex flex-col clip-jagged transform rotate-1">
                    
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8 border-b-4 border-p5-red/30 pb-6">
                        <Icons.Skull className="w-16 h-16 text-p5-red mb-4 animate-pulse" />
                        <h2 className="font-p5-display text-5xl sm:text-6xl text-white transform -rotate-2 text-glitch tracking-tighter drop-shadow-[4px_4px_0_#ff2a6d] uppercase" data-text={t.gameOver}>
                            {t.gameOver}
                        </h2>
                        <div className="mt-4 bg-black border-2 border-white px-4 py-1 transform skew-x-12 shadow-[4px_4px_0_#fff]">
                            <span className="text-p5-red font-bold tracking-widest text-sm uppercase transform -skew-x-12 inline-block">
                                FATAL ERROR // REBOOT REQUIRED
                            </span>
                        </div>
                    </div>

                    {/* Score */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white text-black px-8 py-3 transform -skew-x-6 border-4 border-black shadow-[4px_4px_0_#ff2a6d]">
                            <span className="transform skew-x-6 block font-p5-display text-4xl tracking-widest uppercase">
                                {t.score}: {score.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={handleRetry}
                            onMouseEnter={() => playSound('hover', soundVolume)}
                            className="group relative w-full py-4 transform -skew-x-6 transition-transform hover:scale-105 active:scale-95 border-2 border-transparent"
                        >
                            <div className="absolute inset-0 bg-black border-2 border-p5-cyan shadow-[4px_4px_0_#05d9e8] group-hover:bg-p5-cyan transition-colors" />
                            <div className="relative z-10 flex items-center justify-center gap-4 text-3xl font-p5-display text-white group-hover:text-black transform skew-x-6 tracking-widest uppercase">
                                <Icons.RotateCcw className="w-6 h-6" /> {t.retry}
                            </div>
                        </button>
                        
                        <button 
                            onClick={handleQuitMenu}
                            onMouseEnter={() => playSound('hover', soundVolume)}
                            className="group relative w-full py-3 transform -skew-x-6 transition-transform hover:scale-105 active:scale-95 mt-2"
                        >
                            <div className="absolute inset-0 bg-transparent border-2 border-white/50 group-hover:border-white group-hover:bg-white/10 transition-colors" />
                            <div className="relative z-10 flex items-center justify-center gap-3 text-xl font-p5-display text-white/70 group-hover:text-white transform skew-x-6 tracking-widest uppercase">
                                <Icons.LogOut className="w-5 h-5" /> {t.back}
                            </div>
                        </button>
                    </div>

                 </div>
             </div>
        </div>
    );
};

export default GameOverModal;
