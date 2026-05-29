
export enum TetrominoType {
  I = 'I',
  J = 'J',
  L = 'L',
  O = 'O',
  S = 'S',
  T = 'T',
  Z = 'Z',
}

export type TetrominoShape = number[][];

export interface Tetromino {
  type: TetrominoType;
  shape: TetrominoShape;
  color: string; // Tailwind class or hex
}

export type CellValue = TetrominoType | null;

export type BoardGrid = {
  value: CellValue;
  locked: boolean;
  color?: string;
  isGhost?: boolean;
}[][];

export interface Popup {
  id: number;
  text: string;
  x: number; // grid coords approx
  y: number;
  color: string;
}

export interface HighScore {
  score: number;
  date: string;
}

export interface Profile {
  coins: number;
  level: number;
  xp: number;
  unlockedAbilities: string[];
  hasSeenOnboarding?: boolean;
}

export type GameMode = 'classic' | 'abilities';

export interface GameState {
  grid: BoardGrid;
  currentPiece: {
    type: TetrominoType;
    shape: TetrominoShape;
    x: number;
    y: number;
    color: string;
  } | null;
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  isPaused: boolean;
  nextPiece: TetrominoType;
}

export type Language = 'en' | 'it';

export interface Settings {
  soundVolume: number; // 0 to 100
  language: Language;
}

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
