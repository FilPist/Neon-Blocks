let audioCtx: AudioContext | null = null;

export type SoundType = 'move' | 'rotate' | 'lock' | 'clear' | 'gameover' | 'tetris';

export const playSound = (type: SoundType, volume: number = 50) => {
    if (volume <= 0) return;
    
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const masterVolume = (volume / 100) * 0.3;

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
            playOsc('triangle', 300, 200, 0.05, masterVolume * 0.5);
            break;
        case 'rotate':
            playOsc('sine', 500, 800, 0.1, masterVolume * 0.6);
            break;
        case 'lock':
            playOsc('square', 100, 40, 0.15, masterVolume * 0.7);
            break;
        case 'clear':
            playOscAt('square', 440, now, 0.1, masterVolume * 0.5);   // A4
            playOscAt('square', 554, now + 0.1, 0.1, masterVolume * 0.5); // C#5
            playOscAt('square', 659, now + 0.2, 0.3, masterVolume * 0.5); // E5
            break;
        case 'tetris':
            playOscAt('square', 440, now, 0.1, masterVolume * 0.5);   // A4
            playOscAt('square', 554, now + 0.1, 0.1, masterVolume * 0.5); // C#5
            playOscAt('square', 659, now + 0.2, 0.1, masterVolume * 0.5); // E5
            playOscAt('square', 880, now + 0.3, 0.4, masterVolume * 0.6); // A5
            break;
        case 'gameover':
            playOsc('sawtooth', 300, 50, 1.5, masterVolume * 0.8);
            break;
    }
};
