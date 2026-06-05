
import React, { useState } from 'react';
import { Play, LogOut, Volume2, VolumeX, Settings as SettingsIcon } from 'lucide-react';
import { Settings } from '../types';
import { TRANSLATIONS } from '../constants';

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

    const handleResume = () => {
        setIsExiting(true);
        setTimeout(() => {
            onResume();
        }, 400); // Wait for the exit animation duration before unmounting
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
                      {!showConfirm ? (
                          <>
                              <button onClick={handleResume} className="group relative w-full h-20 transform -skew-x-12 transition-transform hover:scale-105 active:scale-95">
                                  <div className="absolute inset-0 bg-white border-4 border-black shadow-hard-black group-hover:bg-p5-cyan transition-colors" />
                                  <div className="absolute inset-0 flex items-center justify-center gap-4 text-4xl font-p5-display text-black transform skew-x-12">
                                       <Play className="fill-black w-8 h-8" /> {t.resume}
                                  </div>
                              </button>
                              
                              {onOpenSettings && (
                                  <button onClick={onOpenSettings} className="group relative w-full h-16 transform -skew-x-12 transition-transform hover:scale-105 active:scale-95">
                                      <div className="absolute inset-0 bg-black border-4 border-white shadow-hard-black group-hover:bg-p5-purple transition-colors" />
                                      <div className="absolute inset-0 flex items-center justify-center gap-4 text-3xl font-p5-display text-white transform skew-x-12">
                                           <SettingsIcon className="w-6 h-6" /> {t.options}
                                      </div>
                                  </button>
                              )}

                              <button onClick={() => setShowConfirm(true)} className="group relative w-full h-20 transform -skew-x-12 transition-transform hover:scale-105 active:scale-95">
                                  <div className="absolute inset-0 bg-black border-4 border-white shadow-hard-black group-hover:bg-p5-red transition-colors" />
                                  <div className="absolute inset-0 flex items-center justify-center gap-4 text-4xl font-p5-display text-white transform skew-x-12">
                                       <LogOut className="w-8 h-8" /> {t.quit}
                                  </div>
                              </button>
                          </>
                      ) : (
                          <div className="flex flex-col gap-4 p-6 bg-black border-4 border-p5-red transform -skew-x-12 shadow-neon-pink">
                              <span className="text-white text-center font-bold text-lg mb-2 uppercase transform skew-x-12 block leading-snug">
                                  Are you sure?
                                  <br/>
                                  <span className="text-p5-cyan text-sm">This game will be saved to leaderboard.</span>
                              </span>
                              <div className="flex gap-4">
                                  <button onClick={onQuit} className="flex-1 py-3 bg-p5-red text-white font-p5-display text-xl border-2 border-white hover:bg-white hover:text-p5-red transition-colors">
                                      <span className="transform skew-x-12 block">YES</span>
                                  </button>
                                  <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-black text-white font-p5-display text-xl border-2 border-white hover:bg-white hover:text-black transition-colors">
                                      <span className="transform skew-x-12 block">CANCEL</span>
                                  </button>
                              </div>
                          </div>
                      )}
                 </div>
            </div>
        </div>
    );
};

export default PauseMenu;
