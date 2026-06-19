
import React, { useState, useEffect } from 'react';
import { Settings, Language, Keybindings } from '../types';
import { TRANSLATIONS } from '../constants';
import { Volume2, VolumeX, X } from 'lucide-react';
import { playSound } from '../lib/sound';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onUpdate: (newSettings: Settings) => void;
    onControlsOpenChange?: (isOpen: boolean) => void;
}

const SegmentedSlider = ({ value, onChange, max, segments, label }: { value: number, onChange: (v: number) => void, max: number, segments: number, label?: string }) => {
    const step = max / segments;
    const activeSegments = Math.ceil(value / step);

    return (
        <div className="flex gap-1 h-6 w-full transform -skew-x-12">
            {Array.from({ length: segments }).map((_, i) => {
                const isActive = i < activeSegments;
                return (
                    <div 
                        key={i}
                        onClick={() => onChange(Math.min(max, Math.max(step, (i + 1) * step)))}
                        className={`flex-1 border-2 cursor-pointer transition-colors ${isActive ? 'bg-p5-cyan border-p5-cyan shadow-[0_0_10px_#05d9e8]' : 'bg-transparent border-white/20 hover:border-white/50'}`}
                    />
                );
            })}
        </div>
    );
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdate, onControlsOpenChange }) => {
    const [listeningKey, setListeningKey] = useState<keyof Keybindings | null>(null);
    const [showControlsPopup, setShowControlsPopup] = useState(false);
    
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    useEffect(() => {
        let t: any;
        if (isOpen) {
            setMounted(true);
             setShowResetConfirm(false); // Reset when opening
            playSound('open_menu', settings.soundVolume);
            t = setTimeout(() => setVisible(true), 50);
        } else {
            if (mounted) playSound('close_menu', settings.soundVolume);
            setVisible(false);
            t = setTimeout(() => {
                setMounted(false);
            }, 600); // match transition
        }
        return () => clearTimeout(t);
    }, [isOpen]);

    useEffect(() => {
        if (onControlsOpenChange) {
            onControlsOpenChange(showControlsPopup);
        }
    }, [showControlsPopup, onControlsOpenChange]);

    useEffect(() => {
        if (!isOpen) {
            setShowControlsPopup(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!listeningKey) return;
        
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            const newSettings = { ...settings };
            newSettings.keybindings = { ...newSettings.keybindings, [listeningKey]: e.key };
            onUpdate(newSettings);
            setListeningKey(null);
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [listeningKey, settings, onUpdate]);

    if (!mounted) return null;

    const t = TRANSLATIONS[settings.language] as any;

    const setLang = (l: Language) => onUpdate({ ...settings, language: l });
    
    const setMode = (m: 'classic' | 'custom') => onUpdate({ ...settings, controlsMode: m });

    const formatKey = (k: string) => {
        if (k === ' ') return 'SPACE';
        if (k === 'ArrowUp') return 'UP';
        if (k === 'ArrowDown') return 'DOWN';
        if (k === 'ArrowLeft') return 'LEFT';
        if (k === 'ArrowRight') return 'RIGHT';
        return k.toUpperCase();
    };

    const classicKeys: Record<keyof Keybindings, string> = {
        moveLeft: 'A / Left Arrow',
        moveRight: 'D / Right Arrow',
        softDrop: 'S / Down Arrow',
        hardDrop: 'SPACE',
        rotateCW: 'E / Up Arrow',
        rotateCCW: 'Q',
        rotate180: 'W',
        holdPiece: 'Shift / 2',
        pause: 'P / Escape'
    };

    const displayKeys = settings.controlsMode === 'classic' ? classicKeys : settings.keybindings;

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center scanlines font-p5-ui pointer-events-none">
            {/* Transparent/Dimmed Backdrop */}
            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-500 ${!visible ? 'opacity-0' : 'opacity-100'}`} onClick={onClose} />
            
            <div className={`relative z-10 p-2 sm:p-4 pointer-events-none transition-all duration-700 ease-out-expo w-full sm:w-auto h-full sm:h-auto flex items-center justify-center ${!visible ? 'scale-90 opacity-0 -translate-y-20' : 'scale-100 opacity-100 translate-y-0'} ${showControlsPopup ? 'sm:-translate-x-[15%]' : 'translate-x-0'}`}>
                
                {/* Main Settings Panel */}
                <div className="relative w-full sm:w-[600px] lg:w-[650px] max-w-full h-full max-h-[85vh] sm:h-auto shrink-0 bg-black p-6 sm:p-8 border-2 border-white/20 flex flex-col pointer-events-auto shadow-hard-black">
                    <div className="absolute -inset-2 border-4 border-p5-blue shadow-neon-blue transform -rotate-1 pointer-events-none z-0 hidden sm:block" />
                    
                    <div className="relative z-10 flex-1 flex flex-col min-h-0">
                         <h2 className="font-p5-display text-4xl sm:text-5xl text-white mb-6 sm:mb-8 transform -rotate-2 text-glitch tracking-tighter drop-shadow-[4px_4px_0_#d300c5] shrink-0" data-text={t.settingsTitle || "SYSTEM SETTINGS"}>
                            {t.settingsTitle || "SYSTEM SETTINGS"}
                         </h2>
                         
                         <div className="w-full h-1 bg-gradient-to-r from-transparent via-p5-purple to-transparent mb-10 transform -skew-x-12 shrink-0" />
                         
                         <div className="flex-1 overflow-y-auto px-4 custom-scrollbar space-y-10">
                             {/* Sound Segmented */}
                             <div className="flex flex-col gap-4 group">
                                 <div className="flex justify-between items-end">
                                    <span className="text-2xl text-white font-bold group-hover:text-p5-cyan transition-colors">{t.sound || "MASTER VOLUME"}</span>
                                    <span className="text-p5-cyan font-mono">{settings.soundVolume}%</span>
                                 </div>
                                 <div className="flex items-center gap-4">
                                     <button onClick={() => onUpdate({ ...settings, soundVolume: 0 })} className="text-white hover:text-p5-red transition-colors w-6">
                                        {settings.soundVolume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                     </button>
                                     <SegmentedSlider 
                                         value={settings.soundVolume} 
                                         onChange={(v) => onUpdate({ ...settings, soundVolume: v })} 
                                         max={100} 
                                         segments={10} 
                                     />
                                 </div>
                             </div>

                             {/* Language Toggle */}
                             <div className="flex flex-col gap-3 group">
                                 <span className="text-xl text-white font-bold group-hover:text-p5-blue transition-colors">{t.language || "INTERFACE LANG"}</span>
                                 <div className="flex gap-4">
                                    <button 
                                        onClick={() => setLang('en')}
                                        className={`flex-1 py-1 border-2 font-p5-display text-lg transform -skew-x-12 transition-all ${settings.language === 'en' ? 'bg-p5-blue text-white shadow-neon-blue' : 'text-white/50 border-white/30 hover:border-white'}`}
                                    >
                                        <span className="transform skew-x-12 block">ENG</span>
                                    </button>
                                    <button 
                                        onClick={() => setLang('it')}
                                        className={`flex-1 py-1 border-2 font-p5-display text-lg transform -skew-x-12 transition-all ${settings.language === 'it' ? 'bg-p5-blue text-white shadow-neon-blue' : 'text-white/50 border-white/30 hover:border-white'}`}
                                    >
                                        <span className="transform skew-x-12 block">ITA</span>
                                    </button>
                                 </div>
                             </div>

                             {/* SDF Slider */}
                             <div className="flex flex-col gap-3 group">
                                 <div className="flex justify-between items-end">
                                    <span className="text-xl text-white font-bold group-hover:text-p5-purple transition-colors">SOFT DROP FACTOR (SDF)</span>
                                    <span className="text-p5-purple font-mono">{settings.sdf}x</span>
                                 </div>
                                 <div className="pl-10">
                                     <SegmentedSlider 
                                         value={settings.sdf} 
                                         onChange={(v) => onUpdate({ ...settings, sdf: v })} 
                                         max={40} 
                                         segments={8} 
                                     />
                                 </div>
                             </div>

                             {/* Controls Section */}
                             <div className="flex flex-col gap-3">
                                 <span className="text-xl text-white font-bold">CONTROLS MODE</span>
                                 <div className="flex gap-4">
                                    <button 
                                        onClick={() => setMode('classic')}
                                        className={`flex-1 py-2 border-2 font-p5-display text-lg transform -skew-x-12 transition-all ${settings.controlsMode === 'classic' ? 'bg-white text-black border-p5-cyan shadow-[4px_4px_0_#05d9e8]' : 'text-white/50 border-white/30 hover:text-white'}`}
                                    >
                                        <span className="transform skew-x-12 block">CLASSIC</span>
                                    </button>
                                    <button 
                                        onClick={() => setMode('custom')}
                                        className={`flex-1 py-2 border-2 font-p5-display text-lg transform -skew-x-12 transition-all ${settings.controlsMode === 'custom' ? 'bg-white text-black border-p5-red shadow-[4px_4px_0_#ff2a6d]' : 'text-white/50 border-white/30 hover:text-white'}`}
                                    >
                                        <span className="transform skew-x-12 block">CUSTOM</span>
                                    </button>
                                 </div>
                                 <button 
                                     onClick={() => setShowControlsPopup(!showControlsPopup)}
                                     className="mt-2 bg-white/5 border-2 border-white/30 py-2 text-white font-bold hover:bg-white/10 transition-colors transform -skew-x-12"
                                 >
                                     <span className="transform skew-x-12 block uppercase tracking-widest">{showControlsPopup ? "HIDE CONTROLS" : "VIEW CONTROLS / EDIT"}</span>
                                 </button>
                             </div>

                             {/* Screen Shake Mode */}
                             <div className="flex flex-col gap-3">
                                 <span className="text-xl text-white font-bold">SCREEN SHAKE</span>
                                 <div className="flex gap-4">
                                    <button 
                                        onClick={() => onUpdate({ ...settings, screenShake: true })}
                                        className={`flex-1 py-1 border-2 font-p5-display text-lg transform -skew-x-12 transition-all ${settings.screenShake ? 'bg-white text-black border-p5-cyan shadow-[4px_4px_0_#05d9e8]' : 'text-white/50 border-white/30 hover:text-white'}`}
                                    >
                                        <span className="transform skew-x-12 block">ON</span>
                                    </button>
                                    <button 
                                        onClick={() => onUpdate({ ...settings, screenShake: false })}
                                        className={`flex-1 py-1 border-2 font-p5-display text-lg transform -skew-x-12 transition-all ${!settings.screenShake ? 'bg-white text-black border-p5-red shadow-[4px_4px_0_#ff2a6d]' : 'text-white/50 border-white/30 hover:text-white'}`}
                                    >
                                        <span className="transform skew-x-12 block">OFF</span>
                                    </button>
                                 </div>
                             </div>

                              {/* Danger Zone */}
                              <div className="mt-8 border-2 border-p5-red p-4 bg-p5-red/5 relative overflow-hidden group">
                                  <div className="absolute inset-0 bg-p5-red/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <div className="relative z-10 flex flex-col gap-3 text-center">
                                      <span className="text-p5-red font-p5-display text-xl uppercase tracking-widest flex items-center justify-center gap-2">
                                          <X size={20} />
                                          {t.resetData || "FACTORY RESET"}
                                      </span>
                                      
                                        <button 
                                            onClick={() => {
                                                playSound('click', settings.soundVolume);
                                                setShowResetConfirm(true);
                                            }}
                                            className="bg-black border-2 border-p5-red text-white font-p5-display text-lg py-2 transform -skew-x-6 hover:bg-p5-red hover:text-black transition-colors"
                                        >
                                            <span className="transform skew-x-6 block tracking-widest">{t.resetData || "FACTORY RESET"}</span>
                                        </button>
                                  </div>
                              </div>
                         </div>

                         <div className="mt-6 pt-4 flex justify-center shrink-0 border-t-2 border-white/10">
                             <button 
                                onClick={onClose}
                                className="bg-white text-black font-p5-display text-2xl px-10 py-2 transform hover:scale-105 active:scale-95 transition-transform border-4 border-black shadow-[4px_4px_0_#d300c5]"
                             >
                                 {t.back || "RETURN"}
                             </button>
                         </div>
                    </div>
                </div>

                {/* Controls Popup */}
                <div className={`absolute inset-0 sm:inset-auto sm:left-full sm:ml-4 sm:top-4 h-full sm:h-auto sm:max-h-[80vh] w-full sm:w-[500px] bg-black border-2 border-p5-cyan p-4 sm:p-6 flex flex-col pointer-events-auto shadow-neon-cyan transition-all duration-500 ease-out-expo z-[200] opacity-0 ${showControlsPopup ? 'opacity-100 sm:translate-x-0 scale-100' : 'sm:-translate-x-[150px] scale-90 sm:scale-100 pointer-events-none'}`}>
                    <div className="flex justify-between items-center mb-4 sm:mb-6 border-b-2 border-white/20 pb-2 shrink-0">
                             <span className="text-xl text-p5-cyan font-bold font-p5-display">
                                 {settings.controlsMode === 'classic' ? 'BASE CONTROLS' : 'CUSTOM KEYBINDS'}
                             </span>
                             <button onClick={() => setShowControlsPopup(false)} className="text-white hover:text-p5-red"><X /></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                             {Object.entries(displayKeys).map(([actionName, currentKey]) => {
                                 const isCustom = settings.controlsMode === 'custom';
                                 const isListening = listeningKey === actionName;
                                 
                                 return (
                                      <div key={actionName} className="flex flex-col gap-1">
                                          <span className="text-white/60 text-xs font-bold uppercase">{actionName.replace(/([A-Z])/g, ' $1').trim()}</span>
                                          {isCustom ? (
                                              <button 
                                                  onClick={() => setListeningKey(actionName as keyof Keybindings)}
                                                  className={`
                                                      w-full text-left px-3 py-2 transform -skew-x-12 font-p5-display transition-all border
                                                      ${isListening ? 'bg-p5-red text-white border-p5-red animate-pulse shadow-neon-pink' : 'bg-white/5 text-white border-white/30 hover:border-white hover:bg-white/20'}
                                                  `}
                                              >
                                                  <span className="transform skew-x-12 block">{isListening ? 'PRESS ANY KEY' : formatKey(currentKey)}</span>
                                              </button>
                                          ) : (
                                              <div className="w-full text-left px-3 py-2 transform -skew-x-12 bg-white/5 border border-white/10 text-white/80 font-p5-display">
                                                  <span className="transform skew-x-12 block">{currentKey}</span>
                                              </div>
                                          )}
                                      </div>
                                 );
                             })}
                        </div>
                    </div>

            </div>

            {showResetConfirm && (
                <div className="absolute inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
                    <div className="bg-[#050510] border-4 border-p5-red p-6 sm:p-8 max-w-md w-full shadow-neon-pink transform rotate-1 flex flex-col gap-6 text-center animate-slam-in clip-jagged">
                        <X className="text-p5-red w-16 h-16 mx-auto animate-pulse" />
                        <h3 className="text-3xl font-p5-display text-white transform -rotate-2 -skew-x-6 tracking-widest text-glitch" data-text={t.resetConfirmTitle || "DANGER: COMPLETE ERASURE"}>
                            {t.resetConfirmTitle || "DANGER: COMPLETE ERASURE"}
                        </h3>
                        <p className="text-white/80 font-p5-ui text-lg leading-relaxed transform -skew-x-2">
                            {t.resetConfirmDesc || "This will permanently delete all high scores, coins, unlocked abilities, and settings. Are you absolutely sure?"}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <button 
                                onClick={() => {
                                    playSound('slash', settings.soundVolume);
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                                className="flex-1 bg-p5-red text-white py-3 border-2 border-p5-red font-p5-display text-xl tracking-widest transform -skew-x-6 shadow-[4px_4px_0_#fff] hover:bg-white hover:text-p5-red hover:border-white transition-colors"
                            >
                                <span className="transform skew-x-6 block">{t.resetYes || "CONFIRM ERASURE"}</span>
                            </button>
                            <button 
                                onClick={() => {
                                    playSound('click', settings.soundVolume);
                                    setShowResetConfirm(false);
                                }}
                                className="flex-1 bg-black text-white py-3 border-2 border-white font-p5-display text-xl tracking-widest transform -skew-x-6 shadow-[4px_4px_0_#fff] hover:bg-white hover:text-black transition-colors"
                            >
                                <span className="transform skew-x-6 block">{t.resetNo || "ABORT"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsModal;
