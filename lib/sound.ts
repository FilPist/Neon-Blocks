let audioCtx: AudioContext | null = null;
let bgMusicOscillator: OscillatorType | null = null;
let bgMusicGain: GainNode | null = null;
let masterFilter: BiquadFilterNode | null = null;
let masterGain: GainNode | null = null;
let isBgMusicPlaying = false;
let nextNoteTime = 0;
let current16thNote = 0;
let timerID: number | null = null;
let bgVolume = 50;
let currentState: 'menu' | 'game' | 'pause' = 'menu';

export type SoundType = 'move' | 'rotate' | 'lock' | 'clear' | 'gameover' | 'tetris' | 'hover' | 'click' | 'purchase' | 'slash' | 'open_menu' | 'close_menu';

// Arpeggiator pattern (A minor chord chill)
const menuPattern = [
  220.00, // A3
  261.63, // C4
  329.63, // E4
  440.00, // A4
  220.00, // A3
  329.63, // E4
  440.00, // A4
  523.25, // C5
];

// Upbeat pattern (A minor fast bass + arpeggio)
const gamePattern = [
  440.00, // A4
  329.63, // E4
  523.25, // C5
  659.25, // E5
  440.00, // A4
  880.00, // A5
  659.25, // E5
  1046.50, // C6
];

const bassPattern = [
  110.00, // A2
  110.00,
  130.81, // C3
  130.81,
  146.83, // D3
  146.83,
  164.81, // E3
  164.81
];

function nextNote() {
    const tempo = currentState === 'menu' ? 90 : 130;
    const secondsPerBeat = 60.0 / tempo; 
    nextNoteTime += 0.25 * secondsPerBeat; // 16th note
    current16thNote++;
    if (current16thNote === 16) {
        current16thNote = 0;
    }
}

function initAudioNodes() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        masterFilter = audioCtx.createBiquadFilter();
        masterGain = audioCtx.createGain();
        
        // Setup master chain
        masterFilter.type = 'lowpass';
        masterFilter.frequency.value = 20000; // Open by default
        masterFilter.connect(masterGain);
        masterGain.connect(audioCtx.destination);
    }
}

function playNote(time: number, freq: number, isBass: boolean = false) {
    if (!audioCtx || bgVolume <= 0 || !masterFilter) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = isBass ? 'square' : (currentState === 'menu' ? 'sine' : 'sawtooth');
    osc.frequency.value = freq;
    
    osc.connect(gain);
    gain.connect(masterFilter); // Connect to master filter instead of destination
    
    // Mix volumes based on state
    const volMod = isBass ? 0.08 : 0.05;
    const masterVolAmount = (bgVolume / 100) * volMod;
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(masterVolAmount, time + 0.01);
    
    // Longer sustain for chill menu, choppy for game
    const duration = currentState === 'menu' ? 0.3 : 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    
    osc.start(time);
    osc.stop(time + duration);
}

function scheduler() {
    while (nextNoteTime < audioCtx!.currentTime + 0.1) {
        if (currentState === 'game' || currentState === 'pause') {
            // Play upbeat track
            if (current16thNote % 4 === 0 && audioCtx && bgVolume > 0 && masterFilter) {
               const kick = audioCtx.createOscillator();
               const kickGain = audioCtx.createGain();
               kick.connect(kickGain);
               kickGain.connect(masterFilter);
               kick.frequency.setValueAtTime(150, nextNoteTime);
               kick.frequency.exponentialRampToValueAtTime(0.01, nextNoteTime + 0.2);
               const kickVol = (bgVolume / 100) * 0.2;
               kickGain.gain.setValueAtTime(kickVol, nextNoteTime);
               kickGain.gain.exponentialRampToValueAtTime(0.01, nextNoteTime + 0.2);
               kick.start(nextNoteTime);
               kick.stop(nextNoteTime + 0.2);
            }
            // Bassline
            if (current16thNote % 2 === 0) {
               playNote(nextNoteTime, bassPattern[(current16thNote/2) % bassPattern.length], true);
            }
            // Arp
            playNote(nextNoteTime, gamePattern[current16thNote % gamePattern.length]);
        } else {
            // Menu: just chill arp and soft bass
            if (current16thNote % 8 === 0 && audioCtx && bgVolume > 0 && masterFilter) {
                // deep soft pad
                playNote(nextNoteTime, 110.0, true);
            }
            playNote(nextNoteTime, menuPattern[current16thNote % menuPattern.length]);
        }
        
        nextNote();
    }
    timerID = window.setTimeout(scheduler, 25.0);
}

export const setBgState = (state: 'menu' | 'game' | 'pause') => {
    currentState = state;
    if (masterFilter && audioCtx) {
        const now = audioCtx.currentTime;
        if (state === 'pause') {
            // Muffle (lowpass)
            masterFilter.frequency.setTargetAtTime(800, now, 0.5);
        } else {
            // Open filter
            masterFilter.frequency.setTargetAtTime(20000, now, 0.5);
        }
    }
};

export const startBgMusic = (volume: number) => {
    bgVolume = volume;
    if (isBgMusicPlaying || volume <= 0) return;
    initAudioNodes();
    if (audioCtx?.state === 'suspended') {
        audioCtx.resume();
    }
    isBgMusicPlaying = true;
    nextNoteTime = audioCtx!.currentTime + 0.05;
    scheduler();
};

export const updateBgVolume = (volume: number) => {
    bgVolume = volume;
    if (volume > 0 && !isBgMusicPlaying) {
        startBgMusic(volume);
    } else if (volume <= 0 && isBgMusicPlaying) {
        stopBgMusic();
    }
};

export const stopBgMusic = () => {
    isBgMusicPlaying = false;
    if (timerID) window.clearTimeout(timerID);
};

export const playSound = (type: SoundType, volume: number = 50) => {
    updateBgVolume(volume);
    
    if (volume <= 0) return;
    
    initAudioNodes();
    
    if (audioCtx?.state === 'suspended') {
        audioCtx.resume();
        if (!isBgMusicPlaying && volume > 0) startBgMusic(volume);
    }

    const now = audioCtx!.currentTime;
    const masterVol = (volume / 100) * 0.3;

    const playOsc = (
        wave: OscillatorType,
        freq1: number,
        freq2: number,
        duration: number,
        vol: number
    ) => {
        const osc = audioCtx!.createOscillator();
        const gainNode = audioCtx!.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx!.destination);
        
        osc.type = wave;
        osc.frequency.setValueAtTime(freq1, now);
        if (freq1 !== freq2) {
            osc.frequency.exponentialRampToValueAtTime(freq2, now + duration);
        }
        
        gainNode.gain.setValueAtTime(vol, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        osc.start(now);
        osc.stop(now + duration);
    };

    const playOscAt = (
        wave: OscillatorType,
        freq: number,
        startTime: number,
        duration: number,
        vol: number
    ) => {
        const osc = audioCtx!.createOscillator();
        const gainNode = audioCtx!.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx!.destination);
        
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, startTime);
        
        gainNode.gain.setValueAtTime(vol, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, Math.max(startTime + duration, startTime + 0.05));
        
        osc.start(startTime);
        osc.stop(startTime + duration);
    };

    switch (type) {
        case 'move':
            playOsc('triangle', 300, 200, 0.05, masterVol * 0.5);
            break;
        case 'rotate':
            playOsc('sine', 500, 800, 0.1, masterVol * 0.6);
            break;
        case 'lock':
            playOsc('square', 100, 40, 0.15, masterVol * 0.7);
            break;
        case 'click':
            playOsc('square', 800, 400, 0.05, masterVol * 0.4);
            break;
        case 'hover':
            playOsc('sine', 400, 450, 0.04, masterVol * 0.15);
            break;
        case 'purchase':
            playOscAt('sine', 600, now, 0.1, masterVol * 0.6);
            playOscAt('sine', 800, now + 0.1, 0.1, masterVol * 0.6);
            playOscAt('square', 1200, now + 0.2, 0.2, masterVol * 0.8);
            break;
        case 'open_menu':
            playOsc('sawtooth', 200, 800, 0.2, masterVol * 0.4);
            playOsc('sine', 400, 1200, 0.25, masterVol * 0.3);
            break;
        case 'close_menu':
            playOsc('sawtooth', 800, 200, 0.2, masterVol * 0.4);
            playOsc('sine', 1200, 400, 0.25, masterVol * 0.3);
            break;
        case 'slash':
            playOsc('square', 1500, 50, 0.4, masterVol * 0.7);
            playOsc('sawtooth', 1000, 100, 0.5, masterVol * 0.5);
            break;
        case 'clear':
            playOscAt('square', 440, now, 0.1, masterVol * 0.5);
            playOscAt('square', 554, now + 0.1, 0.1, masterVol * 0.5);
            playOscAt('square', 659, now + 0.2, 0.3, masterVol * 0.5);
            break;
        case 'tetris':
            playOscAt('square', 440, now, 0.1, masterVol * 0.5);
            playOscAt('square', 554, now + 0.1, 0.1, masterVol * 0.5);
            playOscAt('square', 659, now + 0.2, 0.1, masterVol * 0.5);
            playOscAt('square', 880, now + 0.3, 0.4, masterVol * 0.6);
            break;
        case 'gameover':
            playOsc('sawtooth', 300, 50, 1.5, masterVol * 0.8);
            break;
    }
};
