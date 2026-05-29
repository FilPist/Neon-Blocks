import React, { useState } from 'react';
import { Modal } from './P5UI';
import { TRANSLATIONS } from '../constants';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: 'en' | 'it';
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, language }) => {
    const [step, setStep] = useState(1);
    
    if (!isOpen) return null;
    const t = TRANSLATIONS[language] as any; // Cast to any to avoid strict typescript issues with new keys for now or just trust the shape

    return (
        <Modal title={step === 1 ? t.onboardingStep1 : t.onboardingStep2} isOpen={isOpen} maxWidth="max-w-3xl">
            {step === 1 && (
                <div className="flex flex-col gap-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white font-p5-ui text-xl">
                        <div className="bg-white/5 p-4 border-l-4 border-p5-cyan">
                            <span className="text-p5-cyan block font-bold mb-2">{t.onboardingMovementBase}</span>
                            {t.onboardingMovementDesc}
                        </div>
                        <div className="bg-white/5 p-4 border-l-4 border-p5-cyan">
                            <span className="text-p5-cyan block font-bold mb-2">{t.onboardingHardDropBase}</span>
                            {t.onboardingHardDropDesc}
                        </div>
                        <div className="bg-white/5 p-4 border-l-4 border-p5-cyan">
                            <span className="text-p5-cyan block font-bold mb-2">{t.onboardingSoftDropBase}</span>
                            {t.onboardingSoftDropDesc}
                        </div>
                        <div className="bg-white/5 p-4 border-l-4 border-p5-cyan">
                            <span className="text-p5-cyan block font-bold mb-2">{t.onboardingPauseBase}</span>
                            {t.onboardingPauseDesc}
                        </div>
                    </div>
                    <button 
                        onClick={() => setStep(2)}
                        className="mt-4 bg-white text-black font-p5-display text-3xl py-3 hover:bg-p5-cyan transition-colors"
                    >
                        {t.onboardingNext}
                    </button>
                </div>
            )}
            {step === 2 && (
                <div className="flex flex-col gap-8 text-left">
                    <p className="text-white text-xl">
                        {t.onboardingModeDesc}
                    </p>
                    <div className="bg-p5-purple/20 border-2 border-p5-purple p-6 shadow-[4px_4px_0_#d300c5] transform -skew-x-6">
                        <div className="transform skew-x-6">
                            <span className="text-p5-purple block font-bold mb-2 text-2xl font-p5-display glitch-text">{t.onboardingAbilityTitle}</span>
                            <p className="text-white font-p5-ui text-xl">
                                {t.onboardingAbilityDesc}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/5 p-4 border-l-4 border-p5-purple font-p5-ui text-xl">
                        <span className="text-p5-cyan block font-bold mb-2">{t.onboardingHowToTitle}</span>
                        {t.onboardingHowToDesc}
                    </div>
                    <button 
                        onClick={onClose}
                        className="mt-4 bg-p5-purple text-white font-p5-display text-3xl py-3 border-4 border-black shadow-[4px_4px_0_#fff] hover:bg-white hover:text-p5-purple transition-colors active:scale-95 transform -skew-x-2"
                    >
                        {t.onboardingStart}
                    </button>
                </div>
            )}
        </Modal>
    );
};

export default OnboardingModal;
