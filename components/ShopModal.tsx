import React from 'react';
import { Modal } from './P5UI';
import { Profile } from '../types';
import { ABILITIES, TRANSLATIONS } from '../constants';
import * as Icons from 'lucide-react';

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: Profile;
    onPurchase: (abilityId: string, cost: number) => void;
    language: 'en' | 'it';
}

const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose, profile, onPurchase, language }) => {
    const t = TRANSLATIONS[language];

    const handlePurchase = (abilityId: string, cost: number) => {
        if (profile.coins >= cost && !profile.unlockedAbilities.includes(abilityId)) {
            onPurchase(abilityId, cost);
        }
    };

    return (
        <Modal title={t.shop} isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
            <div className="flex justify-between items-center bg-black border-2 border-p5-cyan p-4 mb-6 shadow-[4px_4px_0_#05d9e8] transform -skew-x-12">
                <span className="text-white text-xl font-p5-display">COINS</span>
                <span className="text-p5-cyan text-3xl font-p5-ui font-bold animate-pulse">{profile.coins}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {ABILITIES.map(ability => {
                    const isUnlocked = profile.unlockedAbilities.includes(ability.id);
                    const canAfford = profile.coins >= ability.cost;
                    // @ts-ignore
                    const IconComponent = Icons[ability.icon] || Icons.Code;

                    return (
                        <div key={ability.id} className={`flex flex-col border-2 ${isUnlocked ? 'border-p5-purple bg-p5-purple/10' : 'border-white/20 bg-black/50'} p-4 transform transition-all group`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <IconComponent className={isUnlocked ? 'text-p5-purple' : 'text-white/50'} size={24} />
                                    <h3 className={`font-p5-display text-xl ${isUnlocked ? 'text-white' : 'text-white/50'}`}>{ability.name}</h3>
                                </div>
                                <span className={`text-xs px-2 py-1 uppercase font-bold tracking-widest ${ability.type === 'active' ? 'bg-p5-red text-white' : 'bg-p5-cyan text-black'}`}>
                                    {ability.type}
                                </span>
                            </div>
                            <p className="text-white/70 font-p5-ui text-sm mb-4 flex-1">
                                {ability.desc}
                            </p>
                            
                            <button 
                                onClick={() => handlePurchase(ability.id, ability.cost)}
                                disabled={isUnlocked || !canAfford}
                                className={`
                                    w-full py-2 font-p5-display text-lg tracking-widest transition-all uppercase
                                    ${isUnlocked 
                                        ? 'bg-transparent text-p5-purple border-2 border-p5-purple cursor-default' 
                                        : !canAfford 
                                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                            : 'bg-white text-black hover:bg-p5-cyan hover:shadow-neon-cyan active:scale-95'}
                                `}
                            >
                                {isUnlocked ? 'OWNED' : `${ability.cost} COINS`}
                            </button>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #05d9e8;
                }
            `}</style>
        </Modal>
    );
};

export default ShopModal;
