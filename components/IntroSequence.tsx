
import React, { useEffect, useState } from 'react';

interface IntroSequenceProps {
    onComplete: () => void;
}

const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
    const [phase, setPhase] = useState<'start' | 'reveal' | 'exit'>('start');

    useEffect(() => {
        const startDelay = 200;
        const holdTime = 2200;
        const exitTime = 500;

        const t1 = setTimeout(() => setPhase('reveal'), startDelay);
        const t2 = setTimeout(() => setPhase('exit'), startDelay + holdTime);
        const t3 = setTimeout(onComplete, startDelay + holdTime + exitTime);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onComplete]);

    return (
        <div className={`
            fixed inset-0 z-[200] bg-[#02020a] flex items-center justify-center
            transition-opacity duration-700
            ${phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}>
            <div className="relative p-12">
                <div className={`absolute top-1/2 left-0 h-[2px] bg-p5-cyan transition-all duration-1000 ease-out transform -translate-y-1/2 shadow-neon-cyan ${phase === 'reveal' ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                
                <div className={`flex flex-col items-center transform transition-all duration-700 ${phase === 'reveal' ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                    
                    <span className="font-p5-ui text-p5-cyan tracking-[0.6em] text-[10px] mb-6 uppercase font-black opacity-80">
                        Initializing Neon Core Connection
                    </span>

                    <div className="relative bg-black border-4 border-white px-10 py-6 shadow-neon-pink transform -rotate-2">
                        <h1 className="font-p5-display text-5xl md:text-8xl text-white tracking-tighter uppercase leading-none">
                            NEON
                        </h1>
                        <h1 className="font-p5-display text-5xl md:text-8xl text-p5-red tracking-tighter uppercase mt-[-10px] leading-none">
                            BLOCKS
                        </h1>
                    </div>
                    
                    <div className="mt-8 flex gap-3">
                        <div className="w-12 h-1 bg-p5-cyan animate-pulse" />
                        <div className="w-4 h-1 bg-white animate-pulse delay-75" />
                        <div className="w-4 h-1 bg-p5-purple animate-pulse delay-150" />
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 pointer-events-none scanlines opacity-60" />
        </div>
    );
};

export default IntroSequence;
