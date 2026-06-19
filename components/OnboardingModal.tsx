import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import * as Icons from 'lucide-react';
import { playSound } from '../lib/sound';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: 'en' | 'it';
    type: 'basic' | 'abilities';
}

const Kbd = ({ children }: { children: React.ReactNode }) => (
    <kbd className="inline-flex items-center justify-center min-w-[28px] h-8 px-2 bg-black border-2 border-white/20 shadow-[2px_2px_0_rgba(255,255,255,0.2)] text-white font-p5-ui font-bold text-lg mx-1 align-middle whitespace-nowrap transform -skew-x-6">
        <span className="transform skew-x-6 block">{children}</span>
    </kbd>
);

const ControlBlock = ({ icon: Icon, title, description, keys }: { icon: any, title: string, description: string, keys: React.ReactNode }) => (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 bg-black/40 border-2 border-white/10 relative group hover:bg-white/5 hover:border-p5-cyan transition-all transform -skew-x-2 clip-jagged">
        <div className="absolute inset-0 bg-p5-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="flex-shrink-0 w-12 h-12 bg-black border-2 border-p5-cyan flex items-center justify-center text-p5-cyan transform skew-x-2">
            <div className="transform -skew-x-2">
                <Icon size={24} />
            </div>
        </div>
        
        <div className="flex-1 text-center md:text-left flex flex-col justify-center transform skew-x-2">
            <h3 className="text-p5-cyan font-p5-display tracking-widest text-xl uppercase mb-1">{title}</h3>
            <p className="text-white/80 font-p5-ui text-base leading-snug">{description}</p>
        </div>
        
        <div className="flex flex-wrap justify-center md:justify-end gap-x-1 gap-y-2 mt-2 md:mt-0 items-center w-full md:w-auto transform skew-x-2">
            {keys}
        </div>
    </div>
);

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, language, type }) => {
    const t = TRANSLATIONS[language] as any;
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsExiting(false);
            try {
                const val = localStorage.getItem('neon_blocks_settings');
                let vol = 50;
                if (val) vol = JSON.parse(val).soundVolume ?? 50;
                playSound('open_menu', vol);
            } catch(e) {}
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        try {
            const val = localStorage.getItem('neon_blocks_settings');
            let vol = 50;
            if (val) vol = JSON.parse(val).soundVolume ?? 50;
            playSound('click', vol);
        } catch(e) {}
        setIsExiting(true);
        setTimeout(onClose, 300);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-p5-ui p-4">
             <div className={`absolute inset-0 bg-black/80 backdrop-blur-md ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose} />
             <div className="absolute inset-0 pointer-events-none scanlines opacity-30 mix-blend-overlay" />
             
             <div className={`relative z-10 w-full max-w-4xl ${isExiting ? 'scale-75 opacity-0 transition-all duration-300' : 'animate-slam-in'}`}>
                 <div className="absolute -inset-2 bg-gradient-to-r from-p5-cyan via-p5-blue to-p5-purple shadow-neon-cyan transform -rotate-1 pointer-events-none opacity-40 blur-sm" />
                 
                 <div className="relative bg-[#050510] border-4 border-p5-cyan p-6 sm:p-10 shadow-hard-black flex flex-col">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 border-b-4 border-p5-cyan/30 pb-4">
                        <h2 className="font-p5-display text-4xl sm:text-6xl text-white transform -rotate-2 text-glitch tracking-tighter drop-shadow-[4px_4px_0_#05d9e8] uppercase" data-text={type === 'basic' ? t.onboardingStep1 : t.onboardingStep2}>
                            {type === 'basic' ? t.onboardingStep1 : t.onboardingStep2}
                        </h2>
                    </div>

                    {type === 'basic' && (
                        <div className="flex flex-col gap-4 text-left">
                            <p className="text-center text-p5-cyan font-p5-display text-xl mb-4 tracking-widest uppercase border-2 border-p5-cyan bg-p5-cyan/10 py-2 transform -skew-x-2">
                                <span className="transform skew-x-2 block">
                                    {language === 'it' ? 'AQUISIZIONE PROTOCOLLI DI CONTROLLO' : 'ACQUIRING CONTROL PROTOCOLS'}
                                </span>
                            </p>
                            
                            <div className="flex flex-col gap-3">
                                <ControlBlock 
                                    icon={Icons.Move} 
                                    title={t.onboardingMovementBase}
                                    description={t.onboardingMovementDesc}
                                    keys={<><Kbd>W</Kbd><Kbd>A</Kbd><Kbd>S</Kbd><Kbd>D</Kbd> <span className="text-white/50 mx-1">/</span> <Kbd>↑</Kbd><Kbd>←</Kbd><Kbd>↓</Kbd><Kbd>→</Kbd></>}
                                />
                                <ControlBlock 
                                    icon={Icons.ArrowDownToLine} 
                                    title={t.onboardingHardDropBase}
                                    description={t.onboardingHardDropDesc}
                                    keys={<Kbd>SPACE</Kbd>}
                                />
                                <ControlBlock 
                                    icon={Icons.ArrowDown} 
                                    title={t.onboardingSoftDropBase}
                                    description={t.onboardingSoftDropDesc}
                                    keys={<><Kbd>S</Kbd> <span className="text-white/50 mx-1">/</span> <Kbd>↓</Kbd></>}
                                />
                                <ControlBlock 
                                    icon={Icons.RotateCcw} 
                                    title="180° ROTATION & HOLD"
                                    description={language === 'it' ? "Usa 'A' o 'V' per ruotare di 180°. Usa 'C' o 'Shift' per mettere il blocco in Hold." : "Use 'A' or 'V' to flip 180°. Use 'C' or Shift to Hold Piece."}
                                    keys={<><Kbd>A</Kbd> <span className="text-white/50 mx-1">/</span> <Kbd>V</Kbd> <span className="text-white/50 inline-block mx-2">|</span> <Kbd>C</Kbd> <span className="text-white/50 mx-1">/</span> <Kbd>SHIFT</Kbd></>}
                                />
                                <ControlBlock 
                                    icon={Icons.Pause} 
                                    title={t.onboardingPauseBase}
                                    description={t.onboardingPauseDesc}
                                    keys={<Kbd>ESC</Kbd>}
                                />
                            </div>
                        </div>
                    )}

                    {type === 'abilities' && (
                        <div className="flex flex-col gap-6 text-left">
                            <p className="text-p5-purple font-p5-display text-xl text-center tracking-widest uppercase mb-2 border-2 border-p5-purple bg-p5-purple/10 py-2 transform -skew-x-2">
                                <span className="transform skew-x-2 block">
                                    {language === 'it' ? 'INIZIALIZZAZIONE SISTEMA ECONOMICO' : 'INITIALIZING ECONOMIC SYSTEM'}
                                </span>
                            </p>
                            
                            <div className="bg-black border-2 border-p5-yellow p-6 font-p5-ui text-lg leading-relaxed text-white transform -skew-x-2 shadow-[4px_4px_0_#ffd700]">
                                <div className="transform skew-x-2 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                    <div className="bg-p5-yellow text-black p-3 shrink-0">
                                        <Icons.Coins size={32} />
                                    </div>
                                    <p>{t.onboardingModeDesc}</p>
                                </div>
                            </div>

                            <div className="bg-black border-2 border-p5-purple p-6 transform skew-x-2 relative overflow-hidden group clip-jagged">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-p5-purple/20 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-p5-purple/30 transition-colors" />
                                <div className="relative z-10 transform -skew-x-2">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="bg-black border-2 border-p5-purple text-p5-purple p-2 transform -skew-x-6">
                                            <div className="transform skew-x-6">
                                                <Icons.AlignVerticalSpaceBetween size={28} />
                                            </div>
                                        </div>
                                        <span className="text-white font-bold text-2xl font-p5-display tracking-widest uppercase text-glitch" data-text={t.onboardingAbilityTitle}>{t.onboardingAbilityTitle}</span>
                                    </div>
                                    <p className="text-white/90 font-p5-ui text-lg leading-relaxed">
                                        {t.onboardingAbilityDesc}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-black border-2 border-p5-cyan p-5 uppercase font-p5-ui transform -skew-x-2 shadow-[4px_4px_0_#05d9e8]">
                                <div className="transform skew-x-2">
                                    <span className="text-p5-cyan flex items-center gap-2 font-bold mb-3 tracking-widest text-lg">
                                        <div className="bg-p5-cyan/20 p-1"><Icons.Gamepad2 size={20} /></div>
                                        {t.onboardingHowToTitle}
                                    </span>
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-base">
                                        <p className="text-white/80 leading-relaxed flex-1 normal-case">
                                            {t.onboardingHowToDesc}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Kbd>1</Kbd>
                                            <Kbd>2</Kbd>
                                            <Kbd>3</Kbd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleClose}
                            className="bg-black text-white font-p5-display text-2xl px-12 py-3 border-2 border-p5-cyan hover:bg-p5-cyan hover:text-black transition-all transform -skew-x-12 shadow-[4px_4px_0_#05d9e8]"
                        >
                            <span className="transform skew-x-12 block tracking-widest uppercase">
                                {type === 'basic' ? (language === 'it' ? 'CHIUDI' : 'CLOSE') : t.onboardingStart}
                            </span>
                        </button>
                    </div>

                 </div>
             </div>
        </div>
    );
};

export default OnboardingModal;
