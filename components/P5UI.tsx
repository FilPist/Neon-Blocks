
import React from 'react';
import { TetrominoType, HighScore } from '../types';
import { TETROMINOES } from '../constants';
import { Trophy, Clock } from 'lucide-react';

export const NeonContainer: React.FC<{ 
    children: React.ReactNode; 
    className?: string; 
    rotated?: boolean;
    black?: boolean;
    glass?: boolean;
}> = ({ children, className = '', rotated = true, black = false, glass = false }) => {
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
            
            <div className="relative z-10 p-6">
                {children}
            </div>
        </div>
    );
};

export const ScoreBoard: React.FC<{ score: number; level: number; lines: number; speedRatio: number; highScore: number }> = ({ score, level, lines, speedRatio, highScore }) => {
    return (
        <div className="relative mb-8 w-full max-w-[320px]">
            <div className="absolute -top-6 -left-2 z-30 transform -rotate-3">
                <div className="bg-p5-cyan text-black px-4 py-1 font-p5-display text-2xl border-2 border-white shadow-hard-black skew-x-[-10deg]">
                    CORE_DIAGNOSTICS
                </div>
            </div>

            <NeonContainer glass rotated={false} className="w-full mt-4">
                <div className="flex flex-col font-p5-ui text-white space-y-4">
                    {/* Main Score */}
                    <div className="flex flex-col border-b border-white/20 pb-4">
                         <span className="text-xl text-p5-cyan uppercase font-bold tracking-[0.2em] mb-1 drop-shadow-md">Data Extracted</span>
                         <span className="text-6xl font-p5-display tracking-tight leading-none text-white drop-shadow-[3px_3px_0_#ff2a6d]">
                            {score.toLocaleString()}
                         </span>
                         {/* Best Score Mini */}
                         <div className="flex justify-between items-center mt-2 opacity-70 text-xs tracking-widest uppercase">
                             <span>Best Record</span>
                             <span className="text-p5-yellow font-bold">{Math.max(score, highScore).toLocaleString()}</span>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <span className="text-p5-purple uppercase tracking-widest text-xs font-bold opacity-80">Complexity</span>
                            <span className="text-4xl font-p5-display text-p5-yellow drop-shadow-md">{level}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-p5-blue uppercase tracking-widest text-xs font-bold opacity-80">Optimized</span>
                            <span className="text-4xl font-p5-display text-white drop-shadow-md">{lines}</span>
                        </div>
                    </div>

                    {/* Velocity Gauge */}
                    <div className="pt-2">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-p5-red uppercase tracking-widest text-xs font-bold animate-pulse">Velocity</span>
                            <span className="text-white text-xs font-mono">{(speedRatio * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-3 bg-black border border-white/30 skew-x-[-15deg] overflow-hidden relative">
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
        <div className="relative w-48 h-48 mb-8 transform rotate-2">
            <div className="absolute -top-4 -right-4 z-30 bg-black text-p5-cyan px-4 py-1 font-p5-display text-xl border-2 border-p5-cyan shadow-neon-cyan whitespace-nowrap transform skew-x-12">
                BUFFER_LOAD
            </div>
            
            <div className="absolute inset-0 bg-black/80 border-4 border-p5-blue clip-jagged shadow-neon-blue flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-p5-pattern opacity-10"></div>
                <div className="relative z-10 grid gap-1 transform scale-125" style={{ 
                     gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)`,
                 }}>
                    {piece.shape.map((row, y) => 
                        row.map((cell, x) => (
                            <div key={`${x}-${y}`} className={`w-6 h-6 ${cell ? '' : 'transparent'}`} 
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

export const MenuButton: React.FC<{ onClick: () => void; label: string; active?: boolean; primary?: boolean }> = ({ onClick, label, active = true, primary = false }) => {
    return (
        <button 
            onClick={onClick}
            disabled={!active}
            className={`
                relative group w-full py-5 px-8 
                font-p5-display text-3xl tracking-widest uppercase
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center scanlines font-p5-ui">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={onClose} />
             
             <div className="relative z-10 animate-slam-in max-w-lg w-full p-4">
                 <div className="absolute -inset-1 bg-gradient-to-r from-p5-yellow to-p5-red clip-jagged shadow-neon-pink transform -rotate-1" />
                 
                 <div className="relative bg-black p-10 clip-jagged border-2 border-white/20">
                      <h2 className="font-p5-display text-6xl text-center text-white mb-8 text-glitch tracking-tighter" data-text={title}>
                          {title}
                      </h2>

                      <div className="flex flex-col gap-4 mb-8">
                          {scores.length === 0 ? (
                              <div className="text-center text-white/50 py-8 tracking-widest">NO DATA ARCHIVED</div>
                          ) : (
                              scores.map((s, i) => (
                                  <div key={i} className="flex items-center justify-between bg-white/5 p-4 border-l-4 border-p5-cyan hover:bg-white/10 transition-colors group">
                                      <div className="flex items-center gap-4">
                                          <div className={`w-8 h-8 flex items-center justify-center font-bold text-xl ${i === 0 ? 'text-p5-yellow' : 'text-white/50'}`}>
                                              {i === 0 ? <Trophy size={20} /> : `#${i + 1}`}
                                          </div>
                                          <div className="flex flex-col">
                                              <span className="text-2xl font-p5-display text-white group-hover:text-p5-cyan transition-colors">{s.score.toLocaleString()}</span>
                                          </div>
                                      </div>
                                      <div className="text-right flex flex-col items-end opacity-50 text-xs">
                                          <span className="flex items-center gap-1"><Clock size={10} /> {new Date(s.date).toLocaleDateString()}</span>
                                          <span>{new Date(s.date).toLocaleTimeString()}</span>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>

                      <div className="flex justify-center">
                          <button onClick={onClose} className="text-white hover:text-p5-red underline tracking-widest uppercase font-bold text-xl">
                              CLOSE ARCHIVE
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
