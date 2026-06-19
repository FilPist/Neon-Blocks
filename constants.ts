
import { Tetromino, TetrominoType, Keybindings, Settings } from './types';

// Standardized Neon Blocks Palette
const COLORS = {
  CYAN: 'var(--color-p5-cyan, #05d9e8)',    
  BLUE: 'var(--color-p5-blue, #304ffe)',    
  ORANGE: 'var(--color-p5-orange, #ff9100)',  
  YELLOW: 'var(--color-p5-yellow, #fcee0a)',  
  GREEN: 'var(--color-p5-green, #00ff9d)',   
  PURPLE: 'var(--color-p5-purple, #d300c5)',  
  PINK: 'var(--color-p5-pink, #ff2a6d)',    
};

export const STORAGE_KEY = 'neon_blocks_highscores';
export const PROFILE_STORAGE_KEY = 'neon_blocks_profile';
export const SETTINGS_STORAGE_KEY = 'neon_blocks_settings';

export const DEFAULT_KEYBINDINGS: Keybindings = {
  moveLeft: 'a',
  moveRight: 'd',
  softDrop: 's',
  hardDrop: ' ',
  rotateCW: 'e',
  rotateCCW: 'q',
  rotate180: 'w',
  holdPiece: 'Shift',
  pause: 'Escape'
};

export const DEFAULT_SETTINGS: Settings = {
  soundVolume: 50,
  language: 'en',
  controlsMode: 'classic',
  keybindings: DEFAULT_KEYBINDINGS,
  sdf: 5,
  screenShake: true,
};

export const TETROMINOES: Record<TetrominoType, Tetromino> = {
  [TetrominoType.I]: {
    type: TetrominoType.I,
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: COLORS.CYAN,
  },
  [TetrominoType.J]: {
    type: TetrominoType.J,
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: COLORS.BLUE,
  },
  [TetrominoType.L]: {
    type: TetrominoType.L,
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: COLORS.ORANGE,
  },
  [TetrominoType.O]: {
    type: TetrominoType.O,
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: COLORS.YELLOW,
  },
  [TetrominoType.S]: {
    type: TetrominoType.S,
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: COLORS.GREEN,
  },
  [TetrominoType.T]: {
    type: TetrominoType.T,
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: COLORS.PURPLE,
  },
  [TetrominoType.Z]: {
    type: TetrominoType.Z,
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: COLORS.PINK,
  },
};

export const INITIAL_SPEED = 1000;
export const SPEED_DECREMENT = 70; // Increased decrement for faster ramp-up
export const MIN_SPEED = 80;

export const ABILITIES = [
  // Modes
  { id: 'mode_abilities', name: 'ABILITIES MODE', type: 'mode', cost: 100, desc: 'Unlocks the Abilities Game Mode with coin economy.', icon: 'Gamepad2' },
  
  // Slot Upgrades
  { id: 'slot_1', name: 'SLOT UPGRADE I', type: 'upgrade', cost: 200, desc: 'Increases max equipped active abilities to 2.', icon: 'PlusSquare' },
  { id: 'slot_2', name: 'SLOT UPGRADE II', type: 'upgrade', cost: 500, desc: 'Increases max equipped active abilities to 3. Requires Slot Upgrade I.', icon: 'PlusSquare' },

  // Actives
  { id: 'wipe', name: 'ROW WIPE', type: 'active', cost: 100, desc: 'Clears the bottom-most row of blocks.', icon: 'Zap', cooldown: 30 },
  { id: 'bomb', name: 'BOMB', type: 'active', cost: 250, desc: 'Clears a 5x5 area around the lowest point.', icon: 'Bomb', cooldown: 45 },
  { id: 'swap', name: 'PIECE SWAP', type: 'active', cost: 150, desc: 'Swaps the current piece with the next one.', icon: 'RefreshCcw', cooldown: 20 },
  { id: 'collapse', name: 'GRAVITY WELL', type: 'active', cost: 600, desc: 'Forces all blocks to fall down, filling gaps.', icon: 'ArrowDownToLine', cooldown: 120 },
  { id: 'wrap', name: 'WRAP AROUND', type: 'active', cost: 350, desc: 'For 10 seconds, pieces wrap through horizontal edges.', icon: 'MoveHorizontal', cooldown: 60 },

  // Passives (Always on)
  { id: 'magnet', name: 'COIN MAGNET', type: 'passive', cost: 1000, desc: 'Doubles all coins earned from playing.', icon: 'Magnet' },
  { id: 'score_boost', name: 'SCORE BOOSTER', type: 'passive', cost: 750, desc: 'Increases all points gained by 25%.', icon: 'TrendingUp' },
  { id: 'slow_start', name: 'CALM START', type: 'passive', cost: 500, desc: 'Initial drop speed is 20% slower.', icon: 'Turtle' },

  // Toggles (Toggleable passives)
  { id: 'clairvoyance', name: 'CLAIRVOYANCE', type: 'toggle', cost: 800, desc: 'See up to 3 next pieces instead of 1.', icon: 'Eye' },
  { id: 'extended_ghost', name: 'EXTENDED GHOST', type: 'toggle', cost: 400, desc: 'Enhances ghost piece visibility and trails.', icon: 'Ghost' },

  // Cosmetics
  { id: 'cosmetic_pixel', name: 'PIXEL ART THEME', type: 'cosmetic', cost: 1200, desc: 'Changes the game aesthetic to retro pixel art.', icon: 'Palette' },
  { id: 'cosmetic_synth', name: 'SYNTHWAVE THEME', type: 'cosmetic', cost: 1200, desc: 'Changes the game aesthetic to 80s outrun synthwave.', icon: 'Palette' }
];

export const TRANSLATIONS = {
  en: {
    start: "INITIALIZE SEQUENCE",
    abilitiesMode: "ABILITIES MODE",
    shop: "UPGRADE SHOP",
    options: "NEURAL CONFIG",
    records: "LEADERBOARD",
    quit: "TERMINATE",
    settingsTitle: "SYSTEM SETTINGS",
    sound: "MASTER VOLUME",
    language: "INTERFACE LANG",
    back: "RETURN",
    ticker: "ATTENTION: SYSTEM OPTIMIZATION IN PROGRESS // ACCESSING NEON CORE // RUNNING PROTOCOL 1.1.0 // DATA FLOW STABILIZED //",
    system: "CORE NAVIGATOR",
    ready: "READY TO RUN",
    paused: "SIGNAL PAUSED",
    resume: "RECONNECT",
    gameOver: "CORE CRASHED",
    retry: "REBOOT SYSTEM",
    score: "DATA COLLECTED",
    best: "TOP RECORD",
    level: "COMPLEXITY",
    lines: "BLOCKS CLEARED",
    velocity: "VELOCITY",
    next: "QUEUED DATA",
    loading: "SYNCING CORE...",
    recordsTitle: "LEADERBOARD",
    noRecords: "NO DATA FOUND",
    onboardingStep1: "SYSTEM INITIALIZATION",
    onboardingStep2: "ABILITIES MODE",
    onboardingMovementBase: "MOVEMENT",
    onboardingMovementDesc: "Arrows / WASD to move. Q/E or Up Arrow to rotate.",
    onboardingHardDropBase: "HARD DROP",
    onboardingHardDropDesc: "Spacebar to instantly drop.",
    onboardingSoftDropBase: "SOFT DROP",
    onboardingSoftDropDesc: "Down Arrow / S to speed up falling.",
    onboardingPauseBase: "PAUSE",
    onboardingPauseDesc: "Escape or click Pause to halt system.",
    onboardingNext: "NEXT: ABILITIES",
    onboardingModeDesc: "In ABILITIES MODE, you earn COINS by clearing lines. Use these coins in the SHOP to buy powerful upgrades.",
    onboardingAbilityTitle: "ROW WIPE (UNLOCKED!)",
    onboardingAbilityDesc: "We've granted you the ROW WIPE ability to start. It instantly clears the bottom row when triggered!",
    onboardingHowToTitle: "HOW TO USE",
    onboardingHowToDesc: "Press the number key (1, 2, 3...) matching the ability slot on the right, or click its icon during gameplay.",
    onboardingStart: "START SYSTEM",
    patchNotes: "PATCH NOTES",
    resetData: "FACTORY RESET",
    resetConfirmTitle: "DANGER: COMPLETE ERASURE",
    resetConfirmDesc: "This will permanently delete all high scores, coins, unlocked abilities, and settings. Are you absolutely sure?",
    resetYes: "CONFIRM ERASURE",
    resetNo: "ABORT"
  },
  it: {
    start: "INIZIA SEQUENZA",
    abilitiesMode: "MODALITÀ ABILITÀ",
    shop: "NEGOZIO POTENZIAMENTI",
    options: "CONFIG NEURALE",
    records: "CLASSIFICA",
    quit: "TERMINA",
    settingsTitle: "IMPOSTAZIONI SISTEMA",
    sound: "VOLUME MASTER",
    language: "LINGUA INTERFACCIA",
    back: "INDIETRO",
    ticker: "ATTENZIONE: OTTIMIZZAZIONE SISTEMA IN CORSO // ACCESSO AL CORE NEON // PROTOCOLLO 1.1.0 ATTIVO // FLUSSO DATI STABILIZZATO //",
    system: "NAVIGATORE CORE",
    ready: "PRONTO AL LANCIO",
    paused: "SEGNALE IN PAUSA",
    resume: "RICONNETTI",
    gameOver: "CRASH DI SISTEMA",
    retry: "RIAVVIA CORE",
    score: "DATI ESTRATTI",
    best: "RECORD MIGLIORE",
    level: "COMPLESSITÀ",
    lines: "BLOCCHI PULITI",
    velocity: "VELOCITÀ",
    next: "PROSSIMO DATO",
    loading: "SINCRONIZZAZIONE CORE...",
    recordsTitle: "CLASSIFICA",
    noRecords: "NESSUN DATO",
    onboardingStep1: "INIZIALIZZAZIONE SISTEMA",
    onboardingStep2: "MODALITÀ ABILITÀ",
    onboardingMovementBase: "MOVIMENTO",
    onboardingMovementDesc: "Frecce o WASD per muoverti. Q/E o Freccia Su per ruotare.",
    onboardingHardDropBase: "CADUTA RAPIDA",
    onboardingHardDropDesc: "Barra spaziatrice per posizionamento istantaneo.",
    onboardingSoftDropBase: "CADUTA LENTA",
    onboardingSoftDropDesc: "Freccia Giù o S per velocizzare la caduta.",
    onboardingPauseBase: "PAUSA",
    onboardingPauseDesc: "Esc o clicca Pausa per fermare il sistema.",
    onboardingNext: "AVANTI: ABILITÀ",
    onboardingModeDesc: "Nella MODALITÀ ABILITÀ, guadagni MONETE completando le righe. Usa le monete nel NEGOZIO per potenziare le abilità.",
    onboardingAbilityTitle: "PULIZIA RIGA (SBLOCCATA!)",
    onboardingAbilityDesc: "Hai sbloccato l'abilità PULIZIA RIGA. Elimina istantaneamente la riga più in basso quando attivata!",
    onboardingHowToTitle: "COME USARLE",
    onboardingHowToDesc: "Premi il tasto (1, 2, 3...) dello slot dell'abilità a destra, oppure clicca l'icona durante la partita.",
    onboardingStart: "AVVIA SISTEMA",
    patchNotes: "NOTE SULLA PATCH",
    resetData: "RIPRISTINO DI FABBRICA",
    resetConfirmTitle: "PERICOLO: RIMOZIONE TOTALE",
    resetConfirmDesc: "Questo eliminerà permanentemente tutti i punteggi record, monete, abilità sbloccate e impostazioni. Sei assolutamente sicuro?",
    resetYes: "CONFERMA CANCELLAZIONE",
    resetNo: "ANNULLA"
  }
};
