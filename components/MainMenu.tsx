
import React, { useEffect, useState } from 'react';
import { MenuButton, RecordsModal } from './P5UI';
import SettingsModal from './SettingsModal';
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
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, settings, onUpdateSettings, isExiting, highScores, profile, onOpenShop }) => {
    const [mounted, setMounted] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showRecords, setShowRecords] = useState(false);
    const t = TRANSLATIONS[settings.language];

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
                ${mounted && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-40'}
            `}>
                <div className="relative p-8 text-center flex flex-col items-center">
                    <div className="bg-p5-dark text-white font-p5-display text-7xl lg:text-9xl px-8 py-4 border-8 border-white shadow-neon-pink relative z-10 transform -rotate-3 animate-float-glitch">
                        NEON<span className="text-p5-red">BLOCKS</span>
                        <div className="absolute top-2 left-2 right-2 h-[2px] bg-white/20" />
                    </div>
                    
                    <div className="mt-12 transform rotate-2">
                         <div className="bg-p5-cyan text-black px-6 py-2 tracking-[0.4em] font-black text-xl animate-pulse border-2 border-white shadow-hard-black transform -skew-x-12">
                             PROTOCOL // OVERRIDE
                         </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <div className="w-12 h-2 bg-p5-purple transform -skew-x-12" />
                        <div className="w-24 h-2 bg-white transform -skew-x-12" />
                        <div className="w-12 h-2 bg-p5-cyan transform -skew-x-12" />
                    </div>
                </div>
            </div>

            {/* Right Content */}
            <div className={`
                absolute bottom-20 left-0 right-0 lg:static lg:w-[55%] lg:flex-none
                flex flex-col justify-center items-center lg:items-start pl-0 lg:pl-32
                z-20
                transition-all duration-1000 delay-100
                ${mounted && !isExiting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-40'}
            `}>
                <div className="w-full max-w-md relative z-10 p-4 lg:p-0">
                     <div className="flex flex-col gap-8 w-full transform rotate-1">
                        <div className="text-white/80 font-p5-ui text-sm tracking-widest mb-4 border-b-2 border-p5-cyan/50 pb-2 flex justify-between items-end">
                             <div className="flex flex-col">
                                <span className="text-[10px] opacity-50 uppercase">User Interface</span>
                                <span className="text-p5-cyan font-bold tracking-widest">RUNNER_CORE.v5</span>
                             </div>
                             <span className="bg-p5-purple text-white px-3 py-1 text-xs font-bold animate-pulse">SYSTEM LIVE</span>
                        </div>

                        <MenuButton label={t.start} onClick={() => onStart('classic')} primary />
                        <MenuButton label={t.abilitiesMode || "ABILITIES MODE"} onClick={() => onStart('abilities')} />
                        <MenuButton label={t.shop || "SHOP"} onClick={onOpenShop} active={true} />
                        <MenuButton label={t.options} onClick={() => setShowSettings(true)} active={true} />
                        <MenuButton label={t.records} onClick={() => setShowRecords(true)} active={true} />
                        
                        <div className="mt-4 flex justify-between text-p5-cyan font-p5-ui text-[10px] tracking-[0.2em] bg-white/5 backdrop-blur-sm p-3 border-l-4 border-p5-purple">
                            <span>REVISION // 2024.X</span>
                            <span>ENCRYPTED_NEURAL_LINK</span>
                        </div>
                     </div>
                </div>

                <div className={`hidden lg:block absolute right-32 top-1/4 w-48 h-64 bg-black border-4 border-white animate-card-float shadow-neon-blue transform rotate-12 z-0 transition-all duration-700 ${isExiting ? 'translate-x-80 opacity-0 rotate-[60deg]' : ''}`}>
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
            
            <SettingsModal 
                isOpen={showSettings} 
                onClose={() => setShowSettings(false)}
                settings={settings}
                onUpdate={onUpdateSettings}
            />

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
