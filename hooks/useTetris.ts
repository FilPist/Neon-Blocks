
import { useState, useEffect, useCallback, useRef } from 'react';
import { BoardGrid, TetrominoType, BOARD_WIDTH, BOARD_HEIGHT, Popup, HighScore } from '../types';
import { TETROMINOES, INITIAL_SPEED, SPEED_DECREMENT, MIN_SPEED, STORAGE_KEY } from '../constants';
import { playSound } from '../lib/sound';

const createEmptyGrid = (): BoardGrid =>
  Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => ({ value: null, locked: false }))
  );

const getRandomTetromino = () => {
  const types = Object.values(TetrominoType);
  const type = types[Math.floor(Math.random() * types.length)];
  return TETROMINOES[type];
};

export const useTetris = (volume: number = 50, onCoinsEarned?: (coins: number) => void) => {
  const volumeRef = useRef(volume);
  const onCoinsEarnedRef = useRef(onCoinsEarned);
  useEffect(() => {
    volumeRef.current = volume;
    onCoinsEarnedRef.current = onCoinsEarned;
  }, [volume, onCoinsEarned]);

  const [grid, setGrid] = useState<BoardGrid>(createEmptyGrid());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nextPieceType, setNextPieceType] = useState<TetrominoType>(getRandomTetromino().type);
  const [piece, setPiece] = useState<{
    type: TetrominoType;
    shape: number[][];
    x: number;
    y: number;
    color: string;
  } | null>(null);
  
  const [isShaking, setIsShaking] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [speedRatio, setSpeedRatio] = useState(0); // 0 to 1
  const [holdPieceType, setHoldPieceType] = useState<TetrominoType | null>(null);
  const [hasHeld, setHasHeld] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [hardDropTrails, setHardDropTrails] = useState<{col: number, color: string, id: number}[]>([]);

  const comboRef = useRef(0);

  const stateRef = useRef({
    grid: createEmptyGrid(),
    piece: null as { type: TetrominoType; shape: number[][]; x: number; y: number; color: string } | null,
    nextPieceType: getRandomTetromino().type,
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    isPaused: false,
    isPlaying: false,
    holdPieceType: null as TetrominoType | null,
    hasHeld: false,
    playTime: 0
  });

  // Load High Scores
  useEffect(() => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setHighScores(JSON.parse(saved));
        }
    } catch (e) {
        console.error("Failed to load high scores", e);
    }
  }, []);

  useEffect(() => {
    stateRef.current.nextPieceType = nextPieceType;
  }, []);

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dropCounterRef = useRef<number>(0);

  const triggerShake = useCallback(() => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
  }, []);
  
  const addPopup = useCallback((text: string, x: number, y: number, color: string) => {
      const id = Date.now() + Math.random();
      setPopups(prev => [...prev, { id, text, x, y, color }]);
      setTimeout(() => {
          setPopups(prev => prev.filter(p => p.id !== id));
      }, 1500);
  }, []);

  const saveHighScore = useCallback((finalScore: number) => {
      if (finalScore === 0) return;
      
      setHighScores(prev => {
          const newEntry: HighScore = { score: finalScore, date: new Date().toISOString() };
          const newScores = [...prev, newEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newScores));
          return newScores;
      });
  }, []);

  const checkCollision = (shape: number[][], x: number, y: number, currentGrid: BoardGrid) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const newX = x + c;
          const newY = y + r;
          
          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && currentGrid[newY][newX].locked)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const spawnPiece = useCallback(() => {
    const currentState = stateRef.current;
    if (currentState.gameOver || !currentState.isPlaying) return;

    const type = currentState.nextPieceType;
    const newNext = getRandomTetromino().type;
    
    currentState.nextPieceType = newNext;
    setNextPieceType(newNext);

    const newPieceTemplate = TETROMINOES[type];
    const initialX = Math.floor(BOARD_WIDTH / 2) - Math.floor(newPieceTemplate.shape[0].length / 2);

    if (checkCollision(newPieceTemplate.shape, initialX, 0, currentState.grid)) {
        currentState.gameOver = true;
        setGameOver(true);
        saveHighScore(currentState.score);
        playSound('gameover', volumeRef.current);
        return;
    }

    const newPiece = {
        type: newPieceTemplate.type,
        shape: newPieceTemplate.shape,
        x: initialX,
        y: 0,
        color: newPieceTemplate.color,
    };

    currentState.piece = newPiece;
    setPiece(newPiece);
  }, [saveHighScore]);

  const lockPiece = useCallback(() => {
    const s = stateRef.current;
    if (!s.piece) return;

    const newGrid = s.grid.map(row => row.map(cell => ({ ...cell })));
    
    s.piece.shape.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value !== 0) {
          const y = s.piece!.y + r;
          const x = s.piece!.x + c;
          if (y >= 0 && y < BOARD_HEIGHT) {
            newGrid[y][x] = { value: s.piece!.type, locked: true, color: s.piece!.color };
          }
        }
      });
    });

    let linesCleared = 0;
    const finalGrid = newGrid.reduce((acc, row) => {
      if (row.every((cell) => cell.locked)) {
        linesCleared++;
        acc.unshift(Array.from({ length: BOARD_WIDTH }, () => ({ value: null, locked: false })));
      } else {
        acc.push(row);
      }
      return acc;
    }, [] as BoardGrid);

    s.grid = finalGrid;
    
    // Popup and Combo Logic
    if (linesCleared > 0) {
        s.score += linesCleared * 100 * s.level * (comboRef.current + 1);
        s.lines += linesCleared;
        
        comboRef.current += 1; // Increment combo
        
        // Popup Text
        const popupX = s.piece.x + 1;
        const popupY = s.piece.y;
        
        if (linesCleared === 4) {
             addPopup("TETRIS!!", popupX, popupY, '#ff2a6d');
             triggerShake();
             playSound('tetris', volumeRef.current);
        } else if (linesCleared === 3) {
             addPopup("SUPER!", popupX, popupY, '#d300c5');
             playSound('clear', volumeRef.current);
        } else if (linesCleared === 2) {
             addPopup("GREAT", popupX, popupY, '#05d9e8');
             playSound('clear', volumeRef.current);
        } else {
             addPopup("GOOD", popupX, popupY, '#ffffff');
             playSound('clear', volumeRef.current);
        }
        
        if (comboRef.current > 1) {
            setTimeout(() => {
                addPopup(`COMBO x${comboRef.current}`, popupX, popupY - 2, '#fcee0a');
            }, 300);
        }

        // Level up every 10 lines
        if (Math.floor(s.lines / 10) > Math.floor((s.lines - linesCleared) / 10)) {
            s.level += 1;
            // Visual feedback for level up could go here
            addPopup("LEVEL UP!", BOARD_WIDTH / 2, 5, '#05d9e8');
        }

        // Earn coins (base: 10 per line * line modifier)
        let coinsEarned = 0;
        if (linesCleared === 1) coinsEarned = 10;
        else if (linesCleared === 2) coinsEarned = 30;
        else if (linesCleared === 3) coinsEarned = 60;
        else if (linesCleared === 4) coinsEarned = 100;
        
        coinsEarned *= (comboRef.current);
        
        if (coinsEarned > 0 && onCoinsEarnedRef.current) {
            onCoinsEarnedRef.current(coinsEarned);
        }

        setScore(s.score);
        setLines(s.lines);
        setLevel(s.level);
        
        triggerShake(); 
    } else {
        comboRef.current = 0;
        playSound('lock', volumeRef.current);
    }
    
    setGrid(finalGrid);
    s.piece = null;
    s.hasHeld = false;
    setHasHeld(false);
    spawnPiece();
  }, [spawnPiece, triggerShake, addPopup]);

  const holdPiece = useCallback(() => {
    const s = stateRef.current;
    if (!s.piece || s.gameOver || s.isPaused || !s.isPlaying || s.hasHeld) return;

    if (s.holdPieceType === null) {
        s.holdPieceType = s.piece.type;
        setHoldPieceType(s.holdPieceType);
        spawnPiece();
    } else {
        const currentType = s.piece.type;
        const holdType = s.holdPieceType;
        s.holdPieceType = currentType;
        setHoldPieceType(currentType);
        
        const newTemplate = TETROMINOES[holdType];
        const initialX = Math.floor(BOARD_WIDTH / 2) - Math.floor(newTemplate.shape[0].length / 2);
        
        s.piece = {
            type: newTemplate.type,
            shape: newTemplate.shape,
            x: initialX,
            y: 0,
            color: newTemplate.color,
        };
        setPiece({...s.piece});
    }
    
    s.hasHeld = true;
    setHasHeld(true);
    playSound('move', volumeRef.current);
  }, [spawnPiece]);

  const move = useCallback((dirX: number, dirY: number) => {
    const s = stateRef.current;
    if (!s.piece || s.gameOver || s.isPaused || !s.isPlaying) return;

    if (!checkCollision(s.piece.shape, s.piece.x + dirX, s.piece.y + dirY, s.grid)) {
      s.piece = { ...s.piece, x: s.piece.x + dirX, y: s.piece.y + dirY };
      setPiece(s.piece); 
      playSound('move', volumeRef.current);
      return true;
    } else if (dirY > 0) {
      lockPiece();
      return false;
    }
    return false;
  }, [lockPiece]);

  const rotate = useCallback((direction: 1 | -1 = 1) => {
    const s = stateRef.current;
    if (!s.piece || s.gameOver || s.isPaused || !s.isPlaying) return;

    const shape = s.piece.shape;
    const rows = shape.length;
    const cols = shape[0].length;
    let rotatedShape: number[][] = Array.from({length: cols}, () => Array(rows).fill(0));

    if (direction === 1) {
        for(let r = 0; r < rows; r++) {
            for(let c = 0; c < cols; c++) {
                rotatedShape[c][rows - 1 - r] = shape[r][c];
            }
        }
    } else {
        for(let r = 0; r < rows; r++) {
            for(let c = 0; c < cols; c++) {
                rotatedShape[cols - 1 - c][r] = shape[r][c];
            }
        }
    }

    let offset = 0;
    if (checkCollision(rotatedShape, s.piece.x, s.piece.y, s.grid)) {
      offset = s.piece.x > BOARD_WIDTH / 2 ? -1 : 1;
      
      if (checkCollision(rotatedShape, s.piece.x + offset, s.piece.y, s.grid)) {
         offset = -offset;
         if (checkCollision(rotatedShape, s.piece.x + offset, s.piece.y, s.grid)) {
            offset = offset > 0 ? 2 : -2;
             if (checkCollision(rotatedShape, s.piece.x + offset, s.piece.y, s.grid)) {
                 return; 
             }
         }
      }
    }

    s.piece = { ...s.piece, shape: rotatedShape, x: s.piece.x + offset };
    setPiece({...s.piece}); 
    playSound('rotate', volumeRef.current);
  }, []);

  const drop = useCallback(() => {
    move(0, 1);
  }, [move]);

  const hardDrop = useCallback(() => {
    const s = stateRef.current;
    if (!s.piece || s.gameOver || s.isPaused || !s.isPlaying) return;

    const startY = s.piece.y;
    let tempY = s.piece.y;
    while (!checkCollision(s.piece.shape, s.piece.x, tempY + 1, s.grid)) {
      tempY++;
    }

    if (tempY > startY) {
        const pieceGridCols = new Set<number>();
        for (let r = 0; r < s.piece.shape.length; r++) {
            for (let c = 0; c < s.piece.shape[r].length; c++) {
                if (s.piece.shape[r][c] !== 0) {
                    pieceGridCols.add(s.piece.x + c);
                }
            }
        }
        const newTrails = Array.from(pieceGridCols).map(col => ({
            col,
            color: s.piece!.color,
            id: Date.now() + Math.random()
        }));
        setHardDropTrails(prev => [...prev, ...newTrails]);
        setTimeout(() => {
            setHardDropTrails(prev => prev.filter(t => !newTrails.some(nt => nt.id === t.id)));
        }, 300);
    }

    s.piece.y = tempY;
    setPiece({...s.piece}); 
    lockPiece();

  }, [lockPiece]);

  useEffect(() => {
    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const s = stateRef.current;

      if (s.isPlaying && !s.isPaused && !s.gameOver) {
        dropCounterRef.current += deltaTime;
        
        // update playtime state in stateRef
        s.playTime += deltaTime;
        
        // Calculate speed
        const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - (s.level - 1) * SPEED_DECREMENT);
        
        if (dropCounterRef.current > currentSpeed) {
          drop(); 
          dropCounterRef.current = 0;
        }
      }
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [drop]);

  // Sync speed ratio state separately when level changes
  useEffect(() => {
      const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - (level - 1) * SPEED_DECREMENT);
      const ratio = Math.min(1, Math.max(0, (INITIAL_SPEED - currentSpeed) / (INITIAL_SPEED - MIN_SPEED)));
      setSpeedRatio(ratio);
  }, [level]);

  // Sync playtime separately every second to avoid huge rerenders
  useEffect(() => {
      if (!isPlaying || isPaused || gameOver) return;
      const interval = setInterval(() => {
          setPlayTime(Math.floor(stateRef.current.playTime / 1000));
      }, 1000);
      return () => clearInterval(interval);
  }, [isPlaying, isPaused, gameOver]);

  const togglePause = useCallback(() => {
      if (!stateRef.current.isPlaying || stateRef.current.gameOver) return;
      const newVal = !stateRef.current.isPaused;
      stateRef.current.isPaused = newVal;
      setIsPaused(newVal);
  }, []);

  const startGame = useCallback(() => {
     stateRef.current = {
        grid: createEmptyGrid(),
        piece: null,
        nextPieceType: getRandomTetromino().type,
        score: 0,
        lines: 0,
        level: 1,
        gameOver: false,
        isPaused: false,
        isPlaying: true,
        holdPieceType: null,
        hasHeld: false,
        playTime: 0
     };
     setGrid(stateRef.current.grid);
     setScore(0);
     setLines(0);
     setLevel(1);
     setSpeedRatio(0);
     setGameOver(false);
     setPiece(null);
     setIsPaused(false);
     setIsPlaying(true);
     setNextPieceType(stateRef.current.nextPieceType);
     setHoldPieceType(null);
     setHasHeld(false);
     setPlayTime(0);
     setHardDropTrails([]);
     spawnPiece();
     setPopups([]);
     comboRef.current = 0;
  }, [spawnPiece]);

  const quitGame = useCallback(() => {
      stateRef.current.isPlaying = false;
      stateRef.current.isPaused = false;
      setIsPlaying(false);
      setIsPaused(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.gameOver || !stateRef.current.isPlaying) return;
      
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
          e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowLeft': case 'a': case 'A': move(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': move(1, 0); break;
        case 'ArrowDown': case 's': case 'S': move(0, 1); break;
        case 'ArrowUp': case 'w': case 'W': case 'e': case 'E': rotate(1); break;
        case 'q': case 'Q': case 'z': case 'Z': case 'Control': rotate(-1); break;
        case ' ': hardDrop(); break;
        case 'p': case 'P': case 'Escape': togglePause(); break;
        case 'c': case 'C': case 'Shift': holdPiece(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, rotate, hardDrop, togglePause, holdPiece]);

  const triggerAbility = useCallback((abilityId: string) => {
    const s = stateRef.current;
    if (s.gameOver || s.isPaused || !s.isPlaying) return;

    switch (abilityId) {
        case 'wipe':
            // clears bottom row
            const newGridWipe = s.grid.map(row => [...row]);
            newGridWipe.splice(BOARD_HEIGHT - 1, 1);
            newGridWipe.unshift(Array.from({ length: BOARD_WIDTH }, () => ({ value: null, locked: false })));
            
            s.grid = newGridWipe;
            setGrid(s.grid);
            addPopup("ROW WIPED!", BOARD_WIDTH / 2, BOARD_HEIGHT - 1, '#ff2a6d');
            playSound('clear', volumeRef.current);
            triggerShake();
            break;
            
        case 'bomb':
            if (!s.piece) return;
            // Clears 5x5 around the piece
            const cy = s.piece.y + Math.floor(s.piece.shape.length / 2);
            const cx = s.piece.x + Math.floor(s.piece.shape[0].length / 2);
            
            s.grid.forEach((row, ri) => {
                row.forEach((col, ci) => {
                    if (Math.abs(ri - cy) <= 2 && Math.abs(ci - cx) <= 2) {
                        col.value = null;
                        col.locked = false;
                    }
                });
            });
            setGrid([...s.grid]);
            addPopup("BOMB!", cx, cy, '#ff2a6d');
            playSound('clear', volumeRef.current);
            triggerShake();
            break;

        case 'freeze':
            addPopup("TIME FREEZE!", BOARD_WIDTH / 2, 5, '#05d9e8');
            playSound('clear', volumeRef.current);
            const originalSpeed = dropCounterRef.current;
            s.isPaused = true;
            setTimeout(() => {
                s.isPaused = false;
                dropCounterRef.current = originalSpeed;
            }, 8000);
            break;

        case 'swap':
            const currentType = s.piece?.type;
            if (!currentType) return;
            const newType = stateRef.current.nextPieceType;
            stateRef.current.nextPieceType = currentType;
            setNextPieceType(currentType);

            const newPieceTemplate = TETROMINOES[newType];
            s.piece = {
                type: newPieceTemplate.type,
                shape: newPieceTemplate.shape,
                x: s.piece!.x,
                y: s.piece!.y,
                color: newPieceTemplate.color,
            };
            setPiece({...s.piece});
            addPopup("SWAPPED!", s.piece.x, s.piece.y, '#fcee0a');
            playSound('rotate', volumeRef.current);
            break;

        case 'collapse':
            // push all blocks down into holes (gravity well)
            addPopup("GRAVITY WELL!", BOARD_WIDTH / 2, 10, '#d300c5');
            for (let c = 0; c < BOARD_WIDTH; c++) {
               let dropTo = BOARD_HEIGHT - 1;
               for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
                   if (s.grid[r][c].locked) {
                       const temp = s.grid[r][c];
                       s.grid[r][c] = { value: null, locked: false };
                       s.grid[dropTo][c] = temp;
                       dropTo--;
                   }
               }
            }
            // check for clear lines after collapse
            let linesCleared = 0;
            const finalGrid = s.grid.reduce((acc, row) => {
                if (row.every((cell) => cell.locked)) {
                    linesCleared++;
                    acc.unshift(Array.from({ length: BOARD_WIDTH }, () => ({ value: null, locked: false })));
                } else {
                    acc.push(row);
                }
                return acc;
            }, [] as BoardGrid);
            s.grid = finalGrid;
            setGrid(s.grid);
            playSound('clear', volumeRef.current);
            triggerShake();
            break;
    }
  }, [triggerShake, addPopup]);

  return {
    grid,
    piece,
    score,
    lines,
    level,
    gameOver,
    isPaused,
    isPlaying,
    isShaking,
    nextPieceType,
    popups,
    highScores,
    speedRatio,
    startGame,
    quitGame,
    setIsPaused: togglePause,
    triggerAbility,
    holdPieceType,
    holdPiece,
    playTime,
    hardDropTrails
  };
};
