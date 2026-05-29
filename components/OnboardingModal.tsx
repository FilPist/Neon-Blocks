import React, { useState } from 'react';
import { Modal } from './P5UI';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    
    if (!isOpen) return null;

    return (
        <Modal title={step === 1 ? "SYSTEM INITIALIZATION" : "ABILITIES MODE"} isOpen={isOpen} maxWidth="max-w-3xl">
            {step === 1 && (
                <div className="flex flex-col gap-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white font-p5-ui text-xl">
                        <div className="bg-white/5 p-4 border-l-4 border-p5-cyan">
                            <span className="text-p5-cyan block font-bold mb-2">MOVEMENT</span>
                            Arrows / WASD to move and rotate.
                        </div>
                        <div className="bg-white/5 p-4 border-l-4 border-p5-cyan">
                            <span className="text-p5-cyan block font-bold mb-2">HARD DROP</span>
                            Spacebar to instantly drop.
                        </div>
                        <div className="bg-white/5 p-4 border-l-4 border-p5-cyan">
                            <span className="text-p5-cyan block font-bold mb-2">SOFT DROP</span>
                            Down Arrow / S to speed up falling.
                        </div>
                        <div className="bg-white/5 p-4 border-l-4 border-p5-cyan">
                            <span className="text-p5-cyan block font-bold mb-2">PAUSE</span>
                            Escape or click Pause to halt system.
                        </div>
                    </div>
                    <button 
                        onClick={() => setStep(2)}
                        className="mt-4 bg-white text-black font-p5-display text-3xl py-3 hover:bg-p5-cyan transition-colors"
                    >
                        NEXT: ABILITIES
                    </button>
                </div>
            )}
            {step === 2 && (
                <div className="flex flex-col gap-8 text-left">
                    <p className="text-white text-xl">
                        In <strong>ABILITIES MODE</strong>, you earn COINS by clearing lines. 
                        Use these coins in the SHOP to buy powerful upgrades.
                    </p>
                    <div className="bg-p5-purple/20 border-2 border-p5-purple p-6 shadow-[4px_4px_0_#d300c5] transform -skew-x-6">
                        <div className="transform skew-x-6">
                            <span className="text-p5-purple block font-bold mb-2 text-2xl font-p5-display glitch-text">ROW WIPE (UNLOCKED!)</span>
                            <p className="text-white font-p5-ui text-xl">
                                We've granted you the <strong>ROW WIPE</strong> ability to start. 
                                It instantly clears the bottom row when triggered!
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/5 p-4 border-l-4 border-p5-purple font-p5-ui text-xl">
                        <span className="text-p5-cyan block font-bold mb-2">HOW TO USE</span>
                        Press the number key (<strong>1, 2, 3...</strong>) matching the ability slot on the right, or click its icon during gameplay.
                    </div>
                    <button 
                        onClick={onClose}
                        className="mt-4 bg-p5-purple text-white font-p5-display text-3xl py-3 border-4 border-black shadow-[4px_4px_0_#fff] hover:bg-white hover:text-p5-purple transition-colors active:scale-95 transform -skew-x-2"
                    >
                        START SYSTEM
                    </button>
                </div>
            )}
        </Modal>
    );
};

export default OnboardingModal;
