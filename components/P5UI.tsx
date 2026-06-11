
import React, { useState, useEffect } from 'react';
import { TetrominoType, HighScore } from '../types';
import { TETROMINOES } from '../constants';
import { Trophy, Clock } from 'lucide-react';

export const NeonContainer: React.FC<{ 
    children: React.ReactNode; 
    className?: string; 
    rotated?: boolean;
    black?: boolean;
    glass?: boolean;
    pSize?: 'compact' | 'normal';
}> = ({ children, className = '', rotated = true, black = false, glass = false, pSize = 'normal' }) => {
    return (
        <div className={`relative group ${className}`}>
            <div className={`
                absolute inset-0 clip-jagged
                ${glass ? 'bg-black/85 backdrop-blur-xl border border-white/30' : 
                  black ? 'bg-black border-2 border-p5-cyan' : 
                  'bg-white border-4 border-black'} 
                ${glass ? 'shadow-neon-cyan' : 'shadow-hard-black'}
                transition-all duration-300
                ${rotated ? 'transform -rotate-1' : ''}
            `} />
            
            <div className={`relative z-10 ${pSize === 'compact' ? 'p-3 xl:p-6' : 'p-6'}`}>
                {children}
            </div>
        </div>
    );
};

export const ScoreBoard: React.FC<{ score: number; level: number; lines: number; speedRatio: number; highScore: number }> = ({ score, level, lines, speedRatio, highScore }) => {
    return (
        <div className="relative w-full max-w-[260px] xl:max-w-[320px]">
            <div className="absolute -top-5 -left-2 z-30 transform -rotate-3">
                <div className="bg-p5-cyan text-black px-3 py-0.5 font-p5-display text-lg xl:text-2xl border-2 border-white shadow-hard-black skew-x-[-10deg]">
                    CORE_DIAGNOSTICS
                </div>
            </div>

            <NeonContainer glass rotated={false} className="w-full mt-2" pSize="compact">
                <div className="flex flex-col font-p5-ui text-white space-y-2 xl:space-y-4">
                    {/* Main Score */}
                    <div className="flex flex-col border-b border-white/20 pb-2 xl:pb-4">
                         <span className="text-sm xl:text-xl text-p5-cyan uppercase font-bold tracking-[0.2em] mb-0.5 xl:mb-1 drop-shadow-md">Data Extracted</span>
                         <span className="text-3xl xl:text-6xl font-p5-display tracking-tight leading-none text-white drop-shadow-[2px_2px_0_#ff2a6d] xl:drop-shadow-[3px_3px_0_#ff2a6d]">
                            {score.toLocaleString()}
                         </span>
                         {/* Best Score Mini */}
                         <div className="flex justify-between items-center mt-1 xl:mt-2 opacity-70 text-[10px] xl:text-xs tracking-widest uppercase">
                             <span>Best Record</span>
                             <span className="text-p5-yellow font-bold">{Math.max(score, highScore).toLocaleString()}</span>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 xl:gap-4">
                        <div className="flex flex-col">
                            <span className="text-p5-purple uppercase tracking-widest text-[10px] xl:text-xs font-bold opacity-80">Complexity</span>
                            <span className="text-2xl xl:text-4xl font-p5-display text-p5-yellow drop-shadow-md">{level}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-p5-blue uppercase tracking-widest text-[10px] xl:text-xs font-bold opacity-80">Optimized</span>
                            <span className="text-2xl xl:text-4xl font-p5-display text-white drop-shadow-md">{lines}</span>
                        </div>
                    </div>

                    {/* Velocity Gauge */}
                    <div className="pt-1">
                        <div className="flex justify-between items-end mb-0.5">
                            <span className="text-p5-red uppercase tracking-widest text-[10px] xl:text-xs font-bold animate-pulse">Velocity</span>
                            <span className="text-white text-[10px] xl:text-xs font-mono">{(speedRatio * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-2 xl:h-3 bg-black border border-white/30 skew-x-[-15deg] overflow-hidden relative">
                             {/* Gradient Bar */}
                             <div 
                                className="h-full bg-gradient-to-r from-p5-blue via-p5-purple to-p5-red transition-all duration-300 ease-out"
                                style={{ width: `${Math.max(5, speedRatio * 100)}%` }}
                             />
                             {/* Glitch Overlay */}
                             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-30"></div>
                        </div>
                    </div>
                </div>
            </NeonContainer>
        </div>
    );
};

export const NextPiece: React.FC<{ type: TetrominoType }> = ({ type }) => {
    const piece = TETROMINOES[type];
    
    return (
        <div className="relative w-32 h-32 xl:w-48 xl:h-48 transform rotate-2">
            <div className="absolute -top-4 -right-2 xl:-right-4 z-30 bg-black text-p5-cyan px-3 py-0.5 xl:px-4 xl:py-1 font-p5-display text-base xl:text-xl border-2 border-p5-cyan shadow-neon-cyan whitespace-nowrap transform skew-x-12">
                BUFFER_LOAD
            </div>
            
            <div className="absolute inset-0 bg-black/80 border-4 border-p5-blue clip-jagged shadow-neon-blue flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-p5-pattern opacity-10"></div>
                <div className="relative z-10 grid gap-1 transform scale-100 xl:scale-125" style={{ 
                     gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)`,
                 }}>
                    {piece.shape.map((row, y) => 
                        row.map((cell, x) => (
                            <div key={`${x}-${y}`} className={`w-4 h-4 xl:w-6 xl:h-6 ${cell ? '' : 'transparent'}`} 
                                 style={{ 
                                     backgroundColor: cell ? piece.color : 'transparent',
                                     border: cell ? '2px solid rgba(255,255,255,0.8)' : 'none',
                                     boxShadow: cell ? `0 0 15px ${piece.color}` : 'none'
                                 }}>
                            </div>
                        ))
                    )}
                 </div>
            </div>
        </div>
    );
};

export const HoldPiece: React.FC<{ type: TetrominoType | null }> = ({ type }) => {
    const [animate, setAnimate] = useState(false);
    
    useEffect(() => {
        if(type) {
            setAnimate(true);
            const t = setTimeout(() => setAnimate(false), 300);
            return () => clearTimeout(t);
        }
    }, [type]);

    return (
        <div className="relative w-24 h-24 xl:w-32 xl:h-32 transform -rotate-2">
            <div className="absolute -top-3 -left-2 xl:-left-4 z-30 bg-black text-p5-purple px-2 py-0.5 xl:px-3 xl:py-1 font-p5-display text-sm xl:text-lg border-2 border-p5-purple shadow-neon-purple whitespace-nowrap transform skew-x-[-12deg]">
                HOLD_BUFFER
            </div>
            
            <div className={`absolute inset-0 bg-black/80 border-2 border-p5-purple clip-jagged shadow-neon-purple flex items-center justify-center overflow-hidden transition-transform duration-100 ${animate ? 'scale-110 brightness-150' : 'scale-100'}`}>
                <div className="absolute inset-0 bg-p5-pattern opacity-10"></div>
                {type && (
                    <div className="relative z-10 grid gap-1 transform scale-75 xl:scale-90" style={{ 
                         gridTemplateColumns: `repeat(${TETROMINOES[type].shape[0].length}, 1fr)`,
                     }}>
                        {TETROMINOES[type].shape.map((row, y) => 
                            row.map((cell, x) => (
                                <div key={`${x}-${y}`} className={`w-3 h-3 xl:w-4 xl:h-4 ${cell ? '' : 'transparent'}`} 
                                     style={{ 
                                         backgroundColor: cell ? TETROMINOES[type].color : 'transparent',
                                         border: cell ? '1px solid rgba(255,255,255,0.8)' : 'none',
                                         boxShadow: cell ? `0 0 10px ${TETROMINOES[type].color}` : 'none'
                                     }}>
                                </div>
                            ))
                        )}
                     </div>
                )}
                {!type && (
                    <div className="text-white/20 font-p5-display text-xs xl:text-sm tracking-widest">[EMPTY]</div>
                )}
            </div>
        </div>
    );
};

import { playSound } from '../lib/sound';

export const MenuButton: React.FC<{ onClick: () => void; label: string; active?: boolean; primary?: boolean; small?: boolean }> = ({ onClick, label, active = true, primary = false, small = false }) => {
    // Read from localStorage to avoid prop drilling for volume, or just pass a default 50. Since settings might not be available here directly, let's read from localStorage or use a default.
    // However, it's a UI component, so maybe it's better to read settings from localStorage inside playSound.
    // Actually, I can just use a fixed 50 here, or read it. Let's read from local storage if possible.
    const getVol = () => {
        try {
            const val = localStorage.getItem('neon_blocks_settings');
            if (val) {
                const s = JSON.parse(val);
                return s.soundVolume ?? 50;
            }
        } catch(e) {}
        return 50;
    };

    return (
        <button 
            onClick={() => {
                playSound('click', getVol());
                onClick();
            }}
            onMouseEnter={() => {
                if (active) playSound('hover', getVol());
            }}
            disabled={!active}
            className={`
                relative group w-full ${small ? 'py-2 xl:py-3 px-4 xl:px-6' : 'py-3 xl:py-5 px-4 xl:px-8'} 
                font-p5-display ${small ? 'text-base xl:text-2xl' : 'text-lg xl:text-3xl'} tracking-widest uppercase
                transition-all duration-100 active:scale-95
                ${active ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}
            `}
        >
            <div className={`
                absolute inset-0 transform -skew-x-12 border-2 clip-jagged
                ${primary ? 'bg-white border-black' : 'bg-p5-dark border-p5-cyan'}
                shadow-hard-black group-hover:shadow-neon-pink transition-all duration-300
                group-hover:scale-105 group-hover:-rotate-1
            `} />
            
            <span className={`
                relative z-10 block transform skew-x-12
                ${primary ? 'text-black' : 'text-white'}
                group-hover:text-p5-red transition-colors duration-200
                drop-shadow-sm
            `}>
                {label}
            </span>
        </button>
    );
};

export const RecordsModal: React.FC<{ isOpen: boolean; onClose: () => void; scores: HighScore[]; title: string }> = ({ isOpen, onClose, scores, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-p5-ui p-4">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose} />
             <div className="absolute inset-0 pointer-events-none scanlines opacity-30 mix-blend-overlay" />
             
             <div className="relative z-10 animate-slam-in max-w-2xl w-full">
                 <div className="absolute -inset-2 bg-gradient-to-r from-p5-teal via-p5-cyan to-p5-purple shadow-neon-cyan transform -rotate-1 pointer-events-none opacity-50 blur-sm" />
                 <div className="relative bg-[#050510] border-4 border-p5-cyan p-6 sm:p-10 shadow-hard-black flex flex-col">
                      <div className="flex justify-between items-start mb-8 border-b-4 border-p5-cyan/30 pb-4">
                          <h2 className="font-p5-display text-4xl sm:text-6xl text-white transform -rotate-2 text-glitch tracking-tighter drop-shadow-[4px_4px_0_#05d9e8]" data-text={title}>
                              {title}
                          </h2>
                          <div className="text-right text-p5-cyan font-mono text-xs tracking-widest uppercase opacity-70">
                              <span className="block">Global</span>
                              <span className="block animate-pulse text-white">Records</span>
                          </div>
                      </div>

                      <div className="flex flex-col gap-3 mb-8 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                          {scores.length === 0 ? (
                              <div className="text-center text-white/50 py-12 tracking-widest bg-white/5 border-2 border-dashed border-white/20">
                                  [ NO DATA ARCHIVED ]
                              </div>
                          ) : (
                              scores.map((s, i) => (
                                  <div key={i} className={`flex items-center justify-between p-4 border-l-4 sm:border-l-8 transition-all duration-300 group ${
                                      i === 0 ? 'bg-p5-yellow/10 border-p5-yellow shadow-[inset_0_0_20px_rgba(252,238,10,0.1)]' : 
                                      i === 1 ? 'bg-p5-purple/10 border-p5-purple' : 
                                      i === 2 ? 'bg-p5-red/10 border-p5-red' : 
                                      'bg-white/5 border-white/20 hover:bg-white/10 hover:border-p5-cyan'
                                  }`}>
                                      <div className="flex items-center gap-4 sm:gap-6">
                                          <div className={`w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center font-p5-display text-2xl sm:text-4xl transform -skew-x-12 bg-black border-2 ${
                                              i === 0 ? 'text-p5-yellow border-p5-yellow shadow-[4px_4px_0_#fcee0a]' : 
                                              i === 1 ? 'text-p5-purple border-p5-purple shadow-[4px_4px_0_#d300c5]' : 
                                              i === 2 ? 'text-p5-red border-p5-red shadow-[3px_3px_0_#ff2a6d]' : 
                                              'text-white/50 border-white/20'
                                          }`}>
                                              {i === 0 ? <Trophy className="w-5 h-5 sm:w-8 sm:h-8" /> : i + 1}
                                          </div>
                                          <div className="flex flex-col">
                                              <span className={`text-3xl sm:text-5xl font-p5-display tracking-tighter transition-colors ${
                                                  i === 0 ? 'text-p5-yellow group-hover:text-white' : 
                                                  i === 1 ? 'text-p5-purple group-hover:text-white' : 
                                                  i === 2 ? 'text-p5-red group-hover:text-white' : 
                                                  'text-white group-hover:text-p5-cyan'
                                              }`}>
                                                  {s.score.toLocaleString()}
                                              </span>
                                          </div>
                                      </div>
                                      <div className="text-right flex flex-col items-end opacity-60 text-[10px] sm:text-xs font-mono tracking-wider">
                                          <span className="flex items-center gap-1.5 text-p5-cyan"><Clock size={12} /> {new Date(s.date).toLocaleDateString()}</span>
                                          <span className="text-white/70">{new Date(s.date).toLocaleTimeString()}</span>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>

                      <div className="flex justify-center mt-4">
                          <button 
                              onClick={() => {
                                  try {
                                      const val = localStorage.getItem('neon_blocks_settings');
                                      let vol = 50;
                                      if (val) vol = JSON.parse(val).soundVolume ?? 50;
                                      playSound('click', vol);
                                  } catch(e) {}
                                  onClose();
                              }} 
                              onMouseEnter={() => {
                                  try {
                                      const val = localStorage.getItem('neon_blocks_settings');
                                      let vol = 50;
                                      if (val) vol = JSON.parse(val).soundVolume ?? 50;
                                      playSound('hover', vol);
                                  } catch(e) {}
                              }}
                              className="group relative bg-[#050510] text-p5-red border-2 border-p5-red px-8 py-3 font-p5-display text-2xl hover:bg-p5-red hover:text-white transition-all duration-300 transform -skew-x-12 shadow-neon-pink flex items-center justify-center overflow-hidden"
                          >
                              <span className="relative z-10 transform skew-x-12 tracking-widest">CLOSE_ARCHIVE</span>
                              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                          </button>
                      </div>
                 </div>
             </div>
        </div>
    );
};

export const Modal: React.FC<{ 
    title: string; 
    children: React.ReactNode; 
    isOpen: boolean;
    onClose?: () => void;
    maxWidth?: string;
}> = ({ title, children, isOpen, onClose, maxWidth = 'max-w-lg' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center scanlines">
            <div className={`absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in ${onClose ? 'cursor-pointer' : ''}`} onClick={onClose} />
            
            <div className={`relative z-10 animate-slam-in ${maxWidth} w-full p-4`}>
                <div className="absolute -inset-1 bg-gradient-to-r from-p5-cyan to-p5-blue clip-jagged shadow-neon-cyan transform rotate-1" />
                
                <div className="relative bg-black p-8 md:p-12 text-center clip-jagged border-2 border-white/20 transform -rotate-1">
                     <h2 className="font-p5-display text-5xl md:text-7xl text-white mb-6 text-glitch tracking-tighter drop-shadow-[4px_4px_0_#ff2a6d]" data-text={title}>{title}</h2>
                     <div className="w-full h-2 bg-p5-cyan transform -skew-x-12 mb-8" />
                     
                     <div className="font-p5-ui text-xl text-gray-200 mb-8 font-bold text-left">
                        {children}
                     </div>

                     {onClose && (
                         <div className="flex justify-center mt-8">
                             <button onClick={onClose} className="text-white hover:text-p5-red underline tracking-widest uppercase font-bold text-xl">
                                 CLOSE
                             </button>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
}
