import React from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

export type TransitionStage = 'idle' | 'in' | 'out';

interface TransitionOverlayProps {
  stage: TransitionStage;
  language: Language;
}

const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ stage, language }) => {
  if (stage === 'idle') return null;
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-[150] pointer-events-none overflow-hidden">
      {/* Bar 1: Deep Blue Base */}
      <div 
        className={`absolute inset-0 bg-p5-blue transform transition-transform duration-600 ease-out-expo z-30`}
        style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            transform: stage === 'in' ? 'translateX(0)' : 'translateX(100%)',
            transitionDelay: stage === 'in' ? '0ms' : '300ms'
        }}
      />

      {/* Bar 2: Purple Slash */}
      <div 
        className={`absolute inset-0 bg-p5-purple transform transition-transform duration-600 ease-out-expo z-40`}
        style={{ 
            clipPath: 'polygon(0 0, 120% 0, 80% 100%, -20% 100%)',
            transform: stage === 'in' ? 'translateX(0)' : 'translateX(130%)',
            transitionDelay: stage === 'in' ? '100ms' : '150ms'
        }}
      />

      {/* Bar 3: Pink Slash (Top) */}
      <div 
        className={`absolute inset-0 bg-p5-red transform transition-transform duration-600 ease-out-expo z-50`}
        style={{ 
            clipPath: 'polygon(0 0, 150% 0, 100% 100%, -50% 100%)',
            transform: stage === 'in' ? 'translateX(0)' : 'translateX(160%)',
            transitionDelay: stage === 'in' ? '200ms' : '0ms'
        }}
      >
          {/* High Impact Loading Text */}
          <div className="absolute bottom-20 right-20 flex flex-col items-end">
              <div className="flex gap-2 mb-2">
                 {t.loading.split('').map((char, i) => (
                    <span 
                        key={i} 
                        className="font-p5-display text-7xl text-white inline-block opacity-0"
                        style={{ 
                            animationName: stage === 'in' ? 'letterReveal' : 'none',
                            animationDuration: '0.4s',
                            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                            animationFillMode: 'both',
                            animationDelay: `${0.4 + (i * 0.03)}s`
                        }}
                    >
                        {char}
                    </span>
                 ))}
              </div>
              <div className={`h-1 bg-white transition-all duration-1000 ease-out-expo ${stage === 'in' ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
          </div>
      </div>
    </div>
  );
};

export default TransitionOverlay;