
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { BoardGrid, TetrominoType, Popup } from '../types';
import { checkCollision } from '../lib/tetris';

interface BoardProps {
  grid: BoardGrid;
  piece: {
    type: TetrominoType;
    shape: number[][];
    x: number;
    y: number;
    color: string;
  } | null;
  isShaking: boolean;
  popups: Popup[];
  hardDropTrails?: {col: number, color: string, id: number}[];
  lines?: number;
  wrapActive?: boolean;
  extendedGhost?: boolean;
  themeClass?: string;
}

const Board: React.FC<BoardProps> = ({ grid, piece, isShaking, popups, hardDropTrails = [], lines = 0, wrapActive = false, extendedGhost = false, themeClass = '' }) => {
  const [flash, setFlash] = useState(false);
  const prevLines = useRef(lines);

  useEffect(() => {
     if (lines > prevLines.current) {
         setFlash(true);
         setTimeout(() => setFlash(false), 200);
     }
     prevLines.current = lines;
  }, [lines]);

  const { displayGrid } = useMemo(() => {
    const displayGrid = grid.map(row => row.map(cell => ({ ...cell, isGhost: false })));
    let ghostY = -1;

    if (piece) {
        const shape = piece.shape;
        let tempY = piece.y;

        while(!checkCollision(shape, piece.x, tempY + 1, grid, wrapActive)) {
            tempY++;
        }
        ghostY = tempY;

        if (ghostY > piece.y) {
            shape.forEach((row, r) => {
                row.forEach((value, c) => {
                    if (value) {
                        const gy = ghostY + r;
                        let gx = piece.x + c;
                        if (wrapActive) {
                            while (gx < 0) gx += 10;
                            while (gx >= 10) gx -= 10;
                        }
                        if (gy >= 0 && gy < 20 && gx >= 0 && gx < 10 && !displayGrid[gy][gx].value) {
                            displayGrid[gy][gx] = { 
                                value: piece.type, 
                                locked: false, 
                                color: piece.color,
                                isGhost: true
                            };
                        }
                    }
                });
            });
        }

        piece.shape.forEach((row, r) => {
            row.forEach((value, c) => {
                if (value !== 0) {
                    const y = piece.y + r;
                    let x = piece.x + c;
                    if (wrapActive) {
                        while (x < 0) x += 10;
                        while (x >= 10) x -= 10;
                    }
                    if (y >= 0 && y < displayGrid.length && x >= 0 && x < displayGrid[0].length) {
                        displayGrid[y][x] = { 
                            value: piece.type, 
                            locked: false, 
                            color: piece.color,
                            isGhost: false
                        };
                    }
                }
            });
        });
    }
    return { displayGrid };
  }, [grid, piece, wrapActive]);

  return (
    <div className={`relative mx-auto transition-transform ${isShaking ? 'animate-shake' : ''} ${themeClass}`}>
        <div className="absolute -inset-6 bg-gradient-to-tr from-p5-purple to-p5-blue transform rotate-1 skew-x-2 opacity-50 z-0 blur-2xl transition-opacity duration-300" style={{ opacity: isShaking ? 0.9 : 0.4 }} />
        <div className="absolute -inset-3 bg-black transform -rotate-1 z-0 border-4 border-p5-blue shadow-hard-black" />
        
        <div 
            className="relative board-face z-10 overflow-hidden shadow-hard-black border-2 border-white/20 mx-auto"
            style={{ 
                background: 'var(--board-background, #0a0a1f)',
                aspectRatio: '10 / 20', 
                height: 'min(80vh, 150vw)', 
                maxHeight: '850px' 
            }}
        >
            
            <div className="absolute inset-0 z-20 pointer-events-none scanlines opacity-30" />
            
            {flash && (
                <div className="absolute inset-0 z-30 pointer-events-none bg-white mix-blend-overlay animate-flash-row" />
            )}

            <div className="grid grid-rows-[repeat(20,minmax(0,1fr))] h-full w-full relative z-10 p-1 gap-[1px] bg-black/40">
                {displayGrid.map((row, y) => 
                    <div key={y} className="grid grid-cols-[repeat(10,minmax(0,1fr))] gap-[1px]">
                        {row.map((cell, x) => (
                            <div 
                                key={`${x}-${y}`} 
                                className={`relative w-full h-full transition-all duration-75 overflow-hidden`}
                            >
                                {cell.value && !cell.isGhost && (
                                    <div 
                                        className={`w-full h-full animate-zoom-in duration-100 relative ${isShaking ? 'animate-flash-row' : ''}`}
                                        style={{ 
                                            backgroundColor: cell.color,
                                            border: '2px solid rgba(255,255,255,0.8)',
                                            boxShadow: `0 0 15px ${cell.color}`
                                        }}
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent" />
                                    </div>
                                )}

                                {cell.isGhost && (
                                    <div 
                                        className="w-full h-full border-2 opacity-30 flex items-center justify-center bg-transparent"
                                        style={{ 
                                            borderColor: cell.color,
                                            boxShadow: `inset 0 0 5px ${cell.color}`
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden z-[15] p-[1px]">
                {hardDropTrails.map((trail) => (
                    <div 
                        key={trail.id}
                        className="absolute top-0 h-full animate-fade-out"
                        style={{
                            left: `${trail.col * 10}%`,
                            width: '10%',
                            background: `linear-gradient(to top, ${trail.color} 0%, transparent 100%)`,
                            opacity: 0.6
                        }}
                    />
                ))}
            </div>

            {popups.map(popup => (
                <div 
                    key={popup.id}
                    className="absolute z-50 pointer-events-none animate-popup whitespace-nowrap"
                    style={{
                        left: `${Math.min(Math.max(popup.x * 10, 10), 80)}%`,
                        top: `${popup.y * 5}%`,
                    }}
                >
                    <span 
                        className="font-p5-display text-4xl xl:text-6xl text-white italic tracking-tighter drop-shadow-[4px_4px_0_rgba(0,0,0,1)] text-outline"
                        style={{ color: popup.color, textShadow: `3px 3px 0px #000, 0 0 20px ${popup.color}` }}
                    >
                        {popup.text}
                    </span>
                </div>
            ))}
        </div>
        
        <div className="absolute -bottom-8 -left-32 bg-black text-white font-p5-display text-4xl px-4 py-1 xl:px-6 xl:py-2 transform rotate-3 border-2 border-p5-cyan z-20 shadow-neon-cyan">
            <span className="text-glitch tracking-widest text-p5-cyan" data-text="ACTIVE">ACTIVE</span>
        </div>
    </div>
  );
};

export default Board;
