
import React from 'react';
import { Settings, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onUpdate: (newSettings: Settings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
    if (!isOpen) return null;

    const t = TRANSLATIONS[settings.language];

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...settings, soundVolume: parseInt(e.target.value) });
    };

    const setLang = (l: Language) => onUpdate({ ...settings, language: l });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center scanlines font-p5-ui">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={onClose} />
            
            <div className="relative z-10 animate-slam-in max-w-2xl w-full p-4">
                {/* Decorative Borders - Cyber Gradient */}
                <div className="absolute -inset-10 bg-gradient-to-tr from-p5-purple to-p5-cyan clip-jagged transform rotate-1 shadow-[0_0_100px_rgba(211,0,197,0.4)]" />
                <div className="absolute -inset-2 bg-black transform -rotate-1 border-4 border-p5-blue shadow-neon-blue" />
                
                {/* Content */}
                <div className="relative bg-black p-12 border-2 border-white/20">
                     <h2 className="font-p5-display text-7xl text-white mb-8 transform -rotate-2 text-glitch tracking-tighter drop-shadow-[4px_4px_0_#d300c5]" data-text={t.settingsTitle}>
                        {t.settingsTitle}
                     </h2>
                     
                     <div className="w-full h-2 bg-gradient-to-r from-transparent via-p5-purple to-transparent mb-12 transform -skew-x-12" />
                     
                     <div className="grid gap-12">
                         {/* Sound Slider */}
                         <div className="flex flex-col gap-4 group opacity-0 animate-[slideInRight_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]" style={{ animationDelay: '100ms' }}>
                             <div className="flex justify-between items-end">
                                <span className="text-3xl text-white font-bold group-hover:text-p5-cyan transition-colors shadow-black drop-shadow-sm">{t.sound}</span>
                                <span className="text-p5-cyan font-mono text-xl">{settings.soundVolume}%</span>
                             </div>
                             
                             <div className="relative h-12 flex items-center gap-4 bg-white/5 p-4 border-l-4 border-p5-cyan transform -skew-x-12">
                                <button onClick={() => onUpdate({ ...settings, soundVolume: 0 })} className="transform skew-x-12 hover:text-p5-red transition-colors">
                                    {settings.soundVolume === 0 ? <VolumeX /> : <Volume2 />}
                                </button>
                                
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={settings.soundVolume} 
                                    onChange={handleVolumeChange}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer transform skew-x-12 accent-p5-cyan hover:accent-p5-white transition-all"
                                />
                             </div>
                         </div>

                         {/* Language Toggle */}
                         <div className="flex items-center justify-between group opacity-0 animate-[slideInRight_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]" style={{ animationDelay: '200ms' }}>
                             <span className="text-3xl text-white font-bold group-hover:text-p5-blue transition-colors shadow-black drop-shadow-sm">{t.language}</span>
                             <div className="flex gap-4">
                                <button 
                                    onClick={() => setLang('en')}
                                    className={`
                                        px-6 py-2 border-4 font-p5-display text-xl transform -skew-x-12 transition-all
                                        ${settings.language === 'en' ? 'bg-p5-blue text-white border-white shadow-neon-blue scale-110' : 'text-white/50 border-white/30 hover:border-white hover:text-white'}
                                    `}
                                >
                                    <span className="transform skew-x-12 block">ENG</span>
                                </button>
                                <button 
                                    onClick={() => setLang('it')}
                                    className={`
                                        px-6 py-2 border-4 font-p5-display text-xl transform -skew-x-12 transition-all
                                        ${settings.language === 'it' ? 'bg-p5-blue text-white border-white shadow-neon-blue scale-110' : 'text-white/50 border-white/30 hover:border-white hover:text-white'}
                                    `}
                                >
                                    <span className="transform skew-x-12 block">ITA</span>
                                </button>
                             </div>
                         </div>
                     </div>

                     <div className="mt-16 flex justify-center opacity-0 animate-[zoomIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]" style={{ animationDelay: '400ms' }}>
                         <button 
                            onClick={onClose}
                            className="bg-white text-black font-p5-display text-3xl px-12 py-4 transform hover:scale-105 active:scale-95 transition-transform border-4 border-black shadow-[8px_8px_0_#d300c5]"
                         >
                             {t.back}
                         </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
