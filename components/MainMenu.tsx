
import React, { useEffect, useState } from 'react';
import { MenuButton, RecordsModal } from './P5UI';
import { Settings, HighScore, Profile, GameMode } from '../types';
import { TRANSLATIONS } from '../constants';

interface MainMenuProps {
    onStart: (mode: GameMode) => void;
    settings: Settings;
    onUpdateSettings: (s: Settings) => void;
    isExiting: boolean;
    highScores: HighScore[];
    profile: Profile;
    onOpenShop: () => void;
    onOpenSettings?: () => void;
    isSettingsOpen?: boolean;
    isControlsOpen?: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, settings, onUpdateSettings, isExiting, highScores, profile, onOpenShop, onOpenSettings, isSettingsOpen, isControlsOpen }) => {
    const [mounted, setMounted] = useState(false);
    const [showRecords, setShowRecords] = useState(false);
    const [showPatchNotes, setShowPatchNotes] = useState(false);
    const t = TRANSLATIONS[settings.language] as any;

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={`absolute inset-0 z-50 flex overflow-hidden bg-[#050510] transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            {/* Ambient Background Grid & Glows */}
            <div className="absolute inset-0 bg-p5-pattern opacity-20 pointer-events-none" style={{ backgroundSize: '60px 60px' }} />
            <div className={`absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-p5-purple/20 blur-[120px] rounded-full transition-transform duration-1000 ${isExiting ? 'translate-x-full' : ''}`} />
            <div className={`absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-p5-blue/20 blur-[120px] rounded-full transition-transform duration-1000 ${isExiting ? '-translate-x-full' : ''}`} />
            
            <div className={`absolute top-0 bottom-0 left-[40%] w-[200%] bg-black transform -skew-x-12 origin-top-left z-0 border-l-4 border-p5-cyan shadow-neon-cyan hidden lg:block transition-transform duration-700 ${isExiting ? 'translate-x-[200%]' : ''}`} />

            {/* Left Content */}
            <div className={`
                absolute inset-0 lg:static lg:w-[45%] lg:flex-none
                flex flex-col items-center justify-center 
                transition-all duration-1000 z-10
                ${mounted && !isExiting ? (
                    isControlsOpen ? 'opacity-100 lg:-translate-x-[40vw]' : 
                    isSettingsOpen ? 'opacity-100 lg:-translate-x-[30vw]' : 
                    'opacity-100 translate-x-0'
                ) : 'opacity-0 -translate-x-40'}
                ${showPatchNotes ? 'lg:-translate-x-[40vw] opacity-0 lg:opacity-100' : ''}
            `}>
                <div className="relative p-4 sm:p-8 text-center flex flex-col items-center">
                    <div className="relative bg-black border-4 border-white px-10 py-6 shadow-neon-pink transform -rotate-2 animate-float-glitch">
                        <h1 className="font-p5-display text-5xl md:text-8xl text-white tracking-tighter uppercase leading-none text-left">
                            NEON
                        </h1>
                        <h1 className="font-p5-display text-5xl md:text-8xl text-p5-red tracking-tighter uppercase mt-[-10px] leading-none text-left">
                            BLOCKS
                        </h1>
                    </div>
                    
                    <div className="mt-8 sm:mt-12 transform rotate-2">
                         <div className="bg-p5-cyan text-black px-4 sm:px-6 py-1 sm:py-2 tracking-[0.4em] font-black text-sm sm:text-xl animate-pulse border-2 border-white shadow-hard-black transform -skew-x-12">
                             RUNNING PROTOCOL 1.0.9.
                         </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <div className="w-12 h-2 bg-p5-purple transform -skew-x-12" />
                        <div className="w-24 h-2 bg-white transform -skew-x-12" />
                        <div className="w-12 h-2 bg-p5-cyan transform -skew-x-12" />
                    </div>

                    <div className="mt-12 transform -skew-x-12 rotate-[-2deg] transition-transform hover:scale-105">
                        <div className="inline-flex items-center gap-3 bg-black/80 border-l-4 border-l-p5-purple border-y border-r border-white/10 px-6 py-3 shadow-[4px_4px_0_rgba(211,0,197,0.3)]">
                            <span className="text-p5-cyan font-black font-p5-display tracking-widest animate-pulse">{"//"} ORIGIN</span>
                            <span className="text-white font-bold font-p5-ui tracking-[0.2em] text-sm group-hover:text-p5-cyan transition-colors">FILIPPO PISTAFFA</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Content */}
            <div className={`
                absolute bottom-20 left-0 right-0 lg:static lg:w-[55%] lg:flex-none
                flex flex-col justify-center items-center lg:items-start pl-0 lg:pl-32
                z-20
                transition-all duration-1000 delay-100
                ${mounted && !isExiting ? (
                    isControlsOpen ? 'opacity-100 lg:translate-x-[45vw]' : 
                    isSettingsOpen ? 'opacity-100 lg:translate-x-[30vw]' : 
                    'opacity-100 translate-y-0'
                ) : 'opacity-0 translate-y-40'}
                ${showPatchNotes ? 'lg:-translate-x-[40vw] opacity-0 lg:opacity-100' : ''}
            `}>
                <div className="w-full max-w-md relative z-10 p-4 lg:p-0">
                     <div className="flex flex-col gap-4 lg:gap-6 w-full transform rotate-1">
                        <div className="text-white/80 font-p5-ui text-sm tracking-widest mb-2 lg:mb-4 border-b-2 border-p5-cyan/50 pb-2 flex justify-between items-end">
                             <div className="flex flex-col">
                                <span className="text-[10px] opacity-50 uppercase">User Interface</span>
                                <span className="text-p5-cyan font-bold tracking-widest">RUNNER_CORE.v5</span>
                             </div>
                             <span className="bg-p5-purple text-white px-3 py-1 text-xs font-bold animate-pulse">SYSTEM LIVE</span>
                        </div>

                        <MenuButton label={t.start} onClick={() => onStart('classic')} primary small />
                        { (profile.gamesPlayed || 0) >= 3 ? (
                            <div className="relative group w-full">
                                <MenuButton label={t.abilitiesMode || "ABILITIES MODE"} onClick={() => onStart('abilities')} small />
                                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-2 rotate-12 bg-p5-red text-white text-[10px] font-bold px-2 py-0.5 shadow-neon-pink z-20 animate-pulse pointer-events-none">
                                    WIP / BETA
                                </div>
                            </div>
                        ) : (
                            <MenuButton label={(t.abilitiesMode || "ABILITIES MODE") + ` [LOCKED - PLAY ${3 - (profile.gamesPlayed || 0)} MORE]`} onClick={() => {}} small active={false} />
                        )}
                        <div className="relative group w-full">
                            <MenuButton label={t.shop || "SHOP"} onClick={onOpenShop} active={true} small />
                            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-2 rotate-12 bg-p5-purple text-white text-[10px] font-bold px-2 py-0.5 shadow-neon-pink z-20 animate-pulse pointer-events-none">
                                WIP / BETA
                            </div>
                        </div>
                        <MenuButton label={t.options} onClick={onOpenSettings} active={true} small />
                        <MenuButton label={t.records} onClick={() => setShowRecords(true)} active={true} small />
                        
                        <div className="mt-2 flex justify-between text-p5-cyan font-p5-ui text-[10px] tracking-[0.2em] bg-white/5 backdrop-blur-sm p-3 border-l-4 border-p5-purple">
                            <span>REVISION // 1.0.9</span>
                            <span>ENCRYPTED_NEURAL_LINK</span>
                        </div>
                     </div>
                </div>

                <div className={`hidden lg:block absolute right-32 top-1/4 w-48 h-64 bg-black border-4 border-white animate-card-float shadow-neon-blue transform rotate-12 z-0 transition-all duration-700 ${isExiting || showPatchNotes ? 'translate-x-80 opacity-0 rotate-[60deg]' : ''}`}>
                    <div className="absolute inset-0 bg-p5-pattern opacity-20" />
                    <div className="absolute inset-4 border-2 border-p5-cyan flex items-center justify-center overflow-hidden">
                         <div className="text-p5-cyan font-p5-display text-6xl opacity-20 transform -rotate-45">NB</div>
                    </div>
                </div>
            </div>
            
            <div className={`absolute bottom-0 left-0 right-0 h-12 bg-p5-cyan text-black font-p5-display text-2xl tracking-[0.1em] flex items-center overflow-hidden border-t-4 border-white z-40 transform origin-bottom-left transition-all duration-500 ${isExiting ? 'scale-y-0 opacity-0' : 'scale-110 -skew-x-6'} shadow-[0_-10px_30px_rgba(5,217,232,0.3)]`}>
                <div className="whitespace-nowrap animate-ticker pl-full">
                    {t.ticker} {t.ticker}
                </div>
            </div>

            {/* Patch Notes Small Box Trigger */}
            <button
                onClick={() => setShowPatchNotes(true)}
                className={`absolute bottom-16 right-4 lg:right-12 z-40 bg-[#050510] border-2 border-p5-cyan px-4 py-2 font-p5-display text-p5-cyan tracking-widest text-sm xl:text-lg hover:bg-p5-cyan hover:text-black transition-all duration-300 transform -skew-x-12 cursor-pointer shadow-neon-cyan
                ${showPatchNotes || isExiting ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}
            >
                <div className="transform skew-x-12">
                    {t.patchNotes || "PATCH NOTES"}
                </div>
            </button>

            {/* Patch Notes Sliding Panel */}
            <div className={`
                fixed top-0 right-0 h-full w-full lg:w-[45vw] bg-[#050510]/95 border-l-4 border-p5-cyan
                z-[110] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                flex flex-col shadow-[-10px_0_30px_rgba(5,217,232,0.1)]
                ${showPatchNotes ? 'translate-x-0' : 'translate-x-full pointer-events-none'}
            `}>
                <div className="flex justify-between items-center p-6 border-b-2 border-p5-cyan/30">
                    <h2 className="text-3xl font-p5-display text-white tracking-widest uppercase transform rotate-1">
                        {t.patchNotes || "PATCH NOTES"}
                    </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 text-left font-p5-ui custom-scrollbar pb-24">
                    <div className="border-l-4 border-p5-cyan bg-p5-cyan/5 p-6 mb-8 transform -skew-x-2">
                        <div className="transform skew-x-2">
                            <h3 className="text-2xl font-p5-display text-p5-cyan mb-3 tracking-widest outline-text">VERSION 1.0.9 (CURRENT)</h3>
                            <ul className="list-disc list-inside space-y-3 text-white/90 text-sm lg:text-base">
                                <li><span className="text-p5-purple font-bold">NEW:</span> Upgraded Shop interface with dual modules (Active/Passive).</li>
                                <li><span className="text-p5-purple font-bold">NEW:</span> Redesigned Pause Menu aligning with sleek modal aesthetics.</li>
                                <li><span className="text-p5-yellow font-bold">IMPROVED:</span> Updated onboarding tutorial modal UI readability.</li>
                                <li><span className="text-p5-red font-bold">NEW:</span> Added Factory Reset option in Settings to permanently wipe all stored data.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-l-4 border-p5-purple bg-p5-purple/5 p-6 mb-8 transform -skew-x-2 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="transform skew-x-2">
                            <h3 className="text-xl font-p5-display text-p5-purple mb-3 tracking-widest outline-text">VERSION 1.0.8</h3>
                            <ul className="list-disc list-inside space-y-3 text-white/90 text-sm lg:text-base">
                                <li><span className="text-p5-purple font-bold">NEW:</span> Dynamic Background Music (Chill Menu / Upbeat Game).</li>
                                <li><span className="text-p5-purple font-bold">NEW:</span> Muffled background music in pause menu.</li>
                                <li><span className="text-p5-yellow font-bold">IMPROVED:</span> Hover and click sounds added to main buttons and modals.</li>
                                <li><span className="text-p5-yellow font-bold">IMPROVED:</span> Updated Leaderboard UI to be clearer and centered.</li>
                                <li><span className="text-p5-cyan font-bold">IMPROVED:</span> Main title logo size fixed for start menu and gameplay layout.</li>
                                <li><span className="text-white font-bold">FIXED:</span> Game Over "Return" button behavior now correctly exits the game.</li>
                                <li><span className="text-white font-bold">UPDATE:</span> Added WIP disclaimer to Abilities Mode.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-l-4 border-p5-purple bg-p5-purple/5 p-6 mb-8 transform -skew-x-2 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="transform skew-x-2">
                            <h3 className="text-xl font-p5-display text-p5-purple mb-3 tracking-widest outline-text">VERSION 1.0.7</h3>
                            <ul className="list-disc list-inside space-y-2 text-white/70 text-sm">
                                <li>Custom Keybindings and Controls Mode (Classic & Custom).</li>
                                <li>Super Rotation System (SRS) kicks explicitly added.</li>
                                <li>Soft Drop Factor (SDF) implemented.</li>
                                <li>Fast 180° Rotation.</li>
                                <li>Screen Shake toggle and Privacy options in Settings.</li>
                                <li>Game Exit confirmation saves score to Leaderboard.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-l-4 border-p5-cyan bg-p5-cyan/5 p-6 mb-8 transform -skew-x-2">
                        <div className="transform skew-x-2">
                            <h3 className="text-2xl font-p5-display text-p5-cyan mb-3 tracking-widest outline-text">VERSION 1.0.6</h3>
                            <ul className="list-disc list-inside space-y-3 text-white/90 text-sm lg:text-base">
                                <li><span className="text-p5-yellow font-bold">NEW:</span> Added HOLD PIECE functionality (Press C / Shift).</li>
                                <li><span className="text-p5-yellow font-bold">NEW:</span> Playtime timer added to game view.</li>
                                <li><span className="text-p5-purple font-bold">IMPROVED:</span> Responsive design for smaller screens (13" laptops).</li>
                                <li><span className="text-p5-purple font-bold">IMPROVED:</span> Visual effects for hard drops (Vertical lines).</li>
                                <li><span className="text-white font-bold">FIXED:</span> Leaderboard now saves correctly for all game modes.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-l-4 border-p5-purple bg-p5-purple/5 p-6 transform -skew-x-2 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="transform skew-x-2">
                            <h3 className="text-xl font-p5-display text-p5-purple mb-3 tracking-widest outline-text">VERSION 1.0.5 (GITHUB RELEASE)</h3>
                            <ul className="list-disc list-inside space-y-2 text-white/70 text-sm">
                                <li>Initial release on GitHub Pages.</li>
                                <li>Added Abilities game mode with coin economy.</li>
                                <li>Shop system implementation.</li>
                                <li>Gamepad support & advanced sound effects.</li>
                                <li>Onboarding tutorial added.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setShowPatchNotes(false)}
                    className="absolute bottom-4 right-4 lg:right-12 z-50 bg-[#050510] border-2 border-p5-red px-4 py-2 font-p5-display text-p5-red tracking-widest text-sm xl:text-lg hover:bg-p5-red hover:text-white transition-all duration-300 transform -skew-x-12 cursor-pointer shadow-neon-pink"
                >
                    <div className="transform skew-x-12">CLOSE [X]</div>
                </button>
            </div>
            
            <RecordsModal 
                isOpen={showRecords}
                onClose={() => setShowRecords(false)}
                scores={highScores}
                title={t.recordsTitle}
            />
        </div>
    );
};

export default MainMenu;
