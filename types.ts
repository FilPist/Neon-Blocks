
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
  equippedActives?: string[]; // newly added for loadout
  equippedPassives?: string[]; // newly added for toggle passives
  activeCosmetic?: string; // e.g. 'pixel', 'synthwave'
  hasSeenOnboarding?: boolean;
  hasSeenAbilitiesOnboarding?: boolean;
  gamesPlayed?: number;
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

export interface Keybindings {
  moveLeft: string;
  moveRight: string;
  softDrop: string;
  hardDrop: string;
  rotateCW: string;
  rotateCCW: string;
  rotate180: string;
  holdPiece: string;
  pause: string;
}

export type ControlsMode = 'classic' | 'custom';

export interface Settings {
  soundVolume: number; // 0 to 100
  language: Language;
  controlsMode: ControlsMode;
  keybindings: Keybindings;
  sdf: number; // Soft Drop Factor
  screenShake: boolean;
}

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
