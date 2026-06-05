import React from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

export type TransitionStage = 'idle' | 'in' | 'out';

interface TransitionOverlayProps {
  stage: TransitionStage;
  language: Language;
}

const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ stage, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className={`fixed inset-0 z-[150] pointer-events-none overflow-hidden ${stage === 'idle' ? 'invisible' : 'visible'}`}>
      {/* Bar 1: Deep Blue Base */}
      <div 
        className="absolute inset-0 bg-p5-blue transform ease-out-expo z-30"
        style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            transform: stage === 'in' ? 'translateX(0)' : stage === 'out' ? 'translateX(-100%)' : 'translateX(100%)',
            transitionProperty: 'transform',
            transitionDuration: stage === 'idle' ? '0ms' : '400ms',
            transitionDelay: stage === 'in' ? '0ms' : stage === 'out' ? '150ms' : '0ms'
        }}
      />

      {/* Bar 2: Purple Slash */}
      <div 
        className="absolute inset-0 bg-p5-purple transform ease-out-expo z-40"
        style={{ 
            clipPath: 'polygon(0 0, 120% 0, 80% 100%, -20% 100%)',
            transform: stage === 'in' ? 'translateX(0)' : stage === 'out' ? 'translateX(-130%)' : 'translateX(130%)',
            transitionProperty: 'transform',
            transitionDuration: stage === 'idle' ? '0ms' : '400ms',
            transitionDelay: stage === 'in' ? '50ms' : stage === 'out' ? '75ms' : '0ms'
        }}
      />

      {/* Bar 3: Cyan Base */}
      <div 
        className="absolute inset-0 bg-p5-cyan transform ease-out-expo z-50"
        style={{ 
            clipPath: 'polygon(0 0, 150% 0, 100% 100%, -50% 100%)',
            transform: stage === 'in' ? 'translateX(0)' : stage === 'out' ? 'translateX(-160%)' : 'translateX(160%)',
            transitionProperty: 'transform',
            transitionDuration: stage === 'idle' ? '0ms' : '400ms',
            transitionDelay: stage === 'in' ? '100ms' : stage === 'out' ? '0ms' : '0ms'
        }}
      >
          {/* High Impact Loading Text */}
          <div className="absolute bottom-20 right-20 flex flex-col items-end">
              <div className="flex gap-2 mb-2">
                 {t.loading.split('').map((char, i) => (
                    <span 
                        key={i} 
                        className="font-p5-display text-7xl text-black inline-block opacity-0"
                        style={{ 
                            animationName: stage === 'in' ? 'letterReveal' : 'none',
                            animationDuration: '0.2s',
                            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                            animationFillMode: 'both',
                            animationDelay: `${0.1 + (i * 0.02)}s`
                        }}
                    >
                        {char}
                    </span>
                 ))}
              </div>
              <div className={`h-1 bg-black transition-all ease-out-expo`}
                   style={{
                       transitionDuration: stage === 'idle' ? '0ms' : '300ms',
                       transitionDelay: stage === 'in' ? '100ms' : '0ms',
                       width: stage === 'in' ? '100%' : '0%',
                       opacity: stage === 'in' ? 1 : 0
                   }} 
              />
          </div>
      </div>
    </div>
  );
};

export default TransitionOverlay;