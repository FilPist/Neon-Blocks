
import React, { useState } from 'react';
import { Play, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Settings } from '../types';
import { TRANSLATIONS } from '../constants';
import { playSound } from '../lib/sound';

interface PauseMenuProps {
    onResume: () => void;
    onQuit: () => void;
    settings: Settings;
    onUpdateSettings: (s: Settings) => void;
    onOpenSettings?: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onQuit, settings, onUpdateSettings, onOpenSettings }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const t = TRANSLATIONS[settings.language];

    const getVol = () => settings.soundVolume ?? 50;

    const handleResume = () => {
        playSound('click', getVol());
        setIsExiting(true);
        setTimeout(() => {
            onResume();
        }, 400); // Wait for the exit animation duration before unmounting
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-p5-ui p-4 pointer-events-auto overflow-hidden">
             <div className={`absolute inset-0 bg-black/80 backdrop-blur-md ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`} />
             <div className="absolute inset-0 pointer-events-none scanlines opacity-30 mix-blend-overlay" />
             
             <div className={`relative z-10 w-full max-w-lg ${isExiting ? 'scale-75 opacity-0 transition-all duration-300' : 'animate-slam-in scale-100 opacity-100'}`}>
                 <div className="absolute -inset-2 bg-gradient-to-r from-p5-cyan via-p5-blue to-p5-purple shadow-neon-cyan transform -rotate-1 pointer-events-none opacity-50 blur-sm" />
                 
                 <div className="relative bg-[#050510] border-4 border-p5-cyan p-8 shadow-hard-black flex flex-col clip-jagged transform rotate-1">
                    
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8 border-b-4 border-p5-cyan/30 pb-6">
                        <h2 className="font-p5-display text-6xl text-white transform -rotate-2 text-glitch tracking-tighter drop-shadow-[4px_4px_0_#05d9e8]" data-text={t.paused}>
                            {t.paused}
                        </h2>
                        <div className="mt-4 bg-black border-2 border-white px-4 py-1 transform skew-x-12 shadow-[4px_4px_0_#fff]">
                            <span className="text-p5-cyan font-bold tracking-widest text-sm uppercase transform -skew-x-12 inline-block animate-pulse">
                                SYSTEM HALTED // BUFFERING
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-5">
                        {!showConfirm ? (
                            <>
                                <button 
                                    onClick={handleResume} 
                                    onMouseEnter={() => playSound('hover', getVol())}
                                    className="group relative w-full py-4 transform -skew-x-6 transition-transform hover:scale-105 active:scale-95 border-2 border-transparent"
                                >
                                    <div className="absolute inset-0 bg-black border-2 border-p5-cyan shadow-[4px_4px_0_#05d9e8] group-hover:bg-p5-cyan transition-colors" />
                                    <div className="relative z-10 flex items-center justify-center gap-4 text-3xl font-p5-display text-white group-hover:text-black transform skew-x-6 tracking-widest">
                                         <Play className="fill-current w-6 h-6" /> {t.resume}
                                    </div>
                                </button>
                                
                                {onOpenSettings && (
                                    <button 
                                        onClick={() => {
                                            playSound('click', getVol());
                                            onOpenSettings();
                                        }}
                                        onMouseEnter={() => playSound('hover', getVol())}
                                        className="group relative w-full py-4 transform -skew-x-6 transition-transform hover:scale-105 active:scale-95 border-2 border-transparent"
                                    >
                                        <div className="absolute inset-0 bg-black border-2 border-p5-purple shadow-[4px_4px_0_#d300c5] group-hover:bg-p5-purple transition-colors" />
                                        <div className="relative z-10 flex items-center justify-center gap-4 text-2xl font-p5-display text-white group-hover:text-black transform skew-x-6 tracking-widest">
                                             <SettingsIcon className="w-5 h-5" /> {t.options}
                                        </div>
                                    </button>
                                )}

                                <button 
                                    onClick={() => {
                                        playSound('click', getVol());
                                        setShowConfirm(true);
                                    }} 
                                    onMouseEnter={() => playSound('hover', getVol())}
                                    className="group relative w-full py-4 transform -skew-x-6 transition-transform hover:scale-105 active:scale-95 border-2 border-transparent mt-2"
                                >
                                    <div className="absolute inset-0 bg-black border-2 border-p5-red shadow-[4px_4px_0_#ff2a6d] group-hover:bg-p5-red transition-colors" />
                                    <div className="relative z-10 flex items-center justify-center gap-4 text-3xl font-p5-display text-white group-hover:text-black transform skew-x-6 tracking-widest">
                                         <LogOut className="w-6 h-6" /> {t.quit}
                                    </div>
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-6 p-6 bg-black/50 border-2 border-p5-red transform -skew-x-2 shadow-neon-pink mt-2">
                                <div className="text-center transform skew-x-2">
                                    <span className="text-white font-p5-display text-2xl uppercase tracking-widest block mb-1">
                                        Are you sure?
                                    </span>
                                    <span className="text-p5-cyan/80 font-p5-ui text-sm uppercase">
                                        This game will be saved to leaderboard.
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => {
                                            playSound('click', getVol());
                                            onQuit();
                                        }} 
                                        onMouseEnter={() => playSound('hover', getVol())}
                                        className="flex-1 py-3 bg-p5-red text-white font-p5-display text-xl tracking-widest border-2 border-p5-red hover:bg-white hover:text-p5-red hover:border-white transition-colors transform -skew-x-6 shadow-[3px_3px_0_#fff]"
                                    >
                                        <span className="transform skew-x-6 block">YES</span>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            playSound('click', getVol());
                                            setShowConfirm(false);
                                        }} 
                                        onMouseEnter={() => playSound('hover', getVol())}
                                        className="flex-1 py-3 bg-black text-white font-p5-display text-xl tracking-widest border-2 border-white hover:bg-white hover:text-black transition-colors transform -skew-x-6 shadow-[3px_3px_0_#fff]"
                                    >
                                        <span className="transform skew-x-6 block">CANCEL</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                 </div>
             </div>
        </div>
    );
};

export default PauseMenu;
