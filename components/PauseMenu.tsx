
import React, { useState } from 'react';
import { Play, LogOut, Volume2, VolumeX } from 'lucide-react';
import { Settings } from '../types';
import { TRANSLATIONS } from '../constants';

interface PauseMenuProps {
    onResume: () => void;
    onQuit: () => void;
    settings: Settings;
    onUpdateSettings: (s: Settings) => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onQuit, settings, onUpdateSettings }) => {
    const [isExiting, setIsExiting] = useState(false);
    const t = TRANSLATIONS[settings.language];

    const handleResume = () => {
        setIsExiting(true);
        setTimeout(() => {
            onResume();
        }, 400); // Wait for the exit animation duration before unmounting
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateSettings({ ...settings, soundVolume: parseInt(e.target.value) });
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-auto">
            <div className={`absolute inset-0 z-0 origin-bottom-left ${isExiting ? 'animate-slash-collapse' : 'animate-slash-expand'}`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-p5-blue via-p5-purple to-p5-red transform -skew-x-12 scale-150 border-r-8 border-white shadow-[0_0_50px_rgba(211,0,197,0.5)]"></div>
            </div>
            
            <div className={`relative z-20 flex flex-col items-center gap-8 transform rotate-[-5deg] transition-all duration-300 ${isExiting ? 'scale-75 opacity-0' : 'animate-slam-in scale-100 opacity-100'}`}>
                 
                 <div className="relative">
                      <h2 className="font-p5-display text-9xl text-white tracking-tighter drop-shadow-[8px_8px_0_#000] text-outline stroke-black" 
                          style={{ WebkitTextStroke: '2px black' }}>
                          {t.paused}
                      </h2>
                      <div className="absolute -bottom-4 -right-8 bg-black text-p5-cyan px-4 py-1 font-p5-ui font-bold text-xl transform skew-x-12 border-2 border-white">
                          SYSTEM HALTED // BUFFERING
                      </div>
                 </div>
                 
                 <div className="flex flex-col gap-6 w-80 mt-8">
                      {/* Volume Slider - added as requested */}
                      <div className="flex flex-col gap-2 transform -skew-x-12 border-4 border-p5-cyan bg-black p-4 shadow-[4px_4px_0_#05d9e8] group">
                          <div className="flex justify-between items-end transform skew-x-12 px-2">
                             <span className="text-xl text-white font-bold group-hover:text-p5-cyan transition-colors uppercase">{t.sound}</span>
                             <span className="text-p5-cyan font-mono text-lg">{settings.soundVolume}%</span>
                          </div>
                          
                          <div className="relative h-10 flex items-center gap-3 bg-white/5 p-2 transform skew-x-12">
                             <button onClick={() => onUpdateSettings({ ...settings, soundVolume: 0 })} className="hover:text-p5-red transition-colors text-white">
                                 {settings.soundVolume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                             </button>
                             
                             <input 
                                 type="range" 
                                 min="0" 
                                 max="100" 
                                 value={settings.soundVolume} 
                                 onChange={handleVolumeChange}
                                 className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-p5-cyan hover:accent-p5-white transition-all"
                             />
                          </div>
                      </div>

                      <button onClick={handleResume} className="group relative w-full h-20 transform -skew-x-12 transition-transform hover:scale-105 active:scale-95">
                          <div className="absolute inset-0 bg-white border-4 border-black shadow-hard-black group-hover:bg-p5-cyan transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center gap-4 text-4xl font-p5-display text-black transform skew-x-12">
                               <Play className="fill-black w-8 h-8" /> {t.resume}
                          </div>
                      </button>

                      <button onClick={onQuit} className="group relative w-full h-20 transform -skew-x-12 transition-transform hover:scale-105 active:scale-95">
                          <div className="absolute inset-0 bg-black border-4 border-white shadow-hard-black group-hover:bg-p5-red transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center gap-4 text-4xl font-p5-display text-white transform skew-x-12">
                               <LogOut className="w-8 h-8" /> {t.quit}
                          </div>
                      </button>
                 </div>
            </div>
        </div>
    );
};

export default PauseMenu;
