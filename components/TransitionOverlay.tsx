import React from 'react';
import { Language } from '../types';

export type TransitionStage = 'idle' | 'in' | 'out';

interface TransitionOverlayProps {
  stage: TransitionStage;
  language: Language;
}

const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ stage }) => {
  return (
    <div className={`fixed inset-0 z-[150] pointer-events-none overflow-hidden ${stage === 'idle' ? 'invisible' : 'visible'}`}>
      <div 
        className={`absolute inset-0 bg-black/80 transition-opacity duration-300 ${stage === 'in' ? 'opacity-100' : 'opacity-0'}`}
      />

      <div 
        className="absolute inset-0 bg-p5-purple transform ease-in-out z-40"
        style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            transform: stage === 'in' ? 'translateX(0)' : stage === 'out' ? 'translateX(-100%)' : 'translateX(100%)',
            transitionProperty: 'transform',
            transitionDuration: stage === 'idle' ? '0ms' : '500ms',
            transitionTimingFunction: 'cubic-bezier(0.7, 0, 0.3, 1)'
        }}
      />

      <div 
        className="absolute inset-0 bg-p5-cyan transform ease-in-out z-50 shadow-[0_0_50px_#05d9e8]"
        style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            transform: stage === 'in' ? 'translateX(0)' : stage === 'out' ? 'translateX(-100%)' : 'translateX(100%)',
            transitionProperty: 'transform',
            transitionDuration: stage === 'idle' ? '0ms' : '500ms',
            transitionDelay: stage === 'idle' ? '0ms' : '100ms',
            transitionTimingFunction: 'cubic-bezier(0.7, 0, 0.3, 1)'
        }}
      />
    </div>
  );
};

export default TransitionOverlay;
