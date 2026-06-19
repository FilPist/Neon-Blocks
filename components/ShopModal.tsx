import React, { useState } from 'react';
import { Profile } from '../types';
import { ABILITIES, TRANSLATIONS } from '../constants';
import * as Icons from 'lucide-react';
import { playSound } from '../lib/sound';

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: Profile;
    onPurchase: (abilityId: string, cost: number) => void;
    language: 'en' | 'it';
}

const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose, profile, onPurchase, language }) => {
    const t = TRANSLATIONS[language];
    const [activeTab, setActiveTab] = useState<'active' | 'passive'>('active');

    const handlePurchase = (abilityId: string, cost: number) => {
        if (profile.coins >= cost && !profile.unlockedAbilities.includes(abilityId)) {
            onPurchase(abilityId, cost);
        }
    };

    if (!isOpen) return null;

    const displayedItems = ABILITIES.filter(a => a.type === activeTab);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-p5-ui p-4">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose} />
             <div className="absolute inset-0 pointer-events-none scanlines opacity-30 mix-blend-overlay" />
             
             <div className="relative z-10 animate-slam-in max-w-4xl w-full">
                 <div className="absolute -inset-2 bg-gradient-to-r from-p5-red via-p5-purple to-p5-cyan shadow-neon-pink transform rotate-1 pointer-events-none opacity-40 blur-sm" />
                 
                 <div className="relative bg-[#050510] border-4 border-p5-purple p-6 sm:p-10 shadow-hard-black flex flex-col">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 border-b-4 border-p5-purple/30 pb-4">
                        <h2 className="font-p5-display text-5xl sm:text-7xl text-white transform -rotate-2 text-glitch tracking-tighter drop-shadow-[4px_4px_0_#d300c5]" data-text={t.shop}>
                            {t.shop}
                        </h2>
                        
                        <div className="text-right flex flex-col items-end">
                            <div className="bg-black border-2 border-p5-cyan px-4 py-2 transform skew-x-12 shadow-[4px_4px_0_#05d9e8] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-p5-cyan/10 blur-xl group-hover:bg-p5-cyan/20 transition-colors" />
                                <div className="relative z-10 flex items-center gap-3 transform -skew-x-12">
                                    <Icons.Coins className="text-p5-yellow animate-pulse" size={24} />
                                    <span className="text-p5-cyan flex items-baseline gap-1">
                                        <span className="text-3xl font-p5-display font-bold glitch-text" data-text={profile.coins}>
                                            {profile.coins}
                                        </span>
                                        <span className="text-p5-cyan/60 font-p5-ui text-sm mb-1">C</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-6 font-p5-display tracking-widest text-lg sm:text-xl">
                        <button
                            onClick={() => {
                                playSound('hover', 50);
                                setActiveTab('active');
                            }}
                            className={`flex-1 py-3 transition-colors uppercase border-b-4 ${activeTab === 'active' ? 'border-p5-red text-p5-red bg-p5-red/10' : 'border-white/20 text-white/50 hover:bg-white/5'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Icons.Zap size={20} />
                                {language === 'it' ? 'ABILITÀ ATTIVE' : 'ACTIVE ABILITIES'}
                            </div>
                        </button>
                        <button
                            onClick={() => {
                                playSound('hover', 50);
                                setActiveTab('passive');
                            }}
                            className={`flex-1 py-3 transition-colors uppercase border-b-4 ${activeTab === 'passive' ? 'border-p5-purple text-p5-purple bg-p5-purple/10' : 'border-white/20 text-white/50 hover:bg-white/5'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Icons.Compass size={20} />
                                {language === 'it' ? 'MODULI PASSIVI' : 'PASSIVE MODULES'}
                            </div>
                        </button>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar pb-4">
                        {displayedItems.map(ability => {
                            const isUnlocked = profile.unlockedAbilities.includes(ability.id);
                            const canAfford = profile.coins >= ability.cost;
                            // @ts-ignore
                            const IconComponent = Icons[ability.icon] || Icons.Code;
                            
                            const themeColor = ability.type === 'active' ? '#ff2a6d' : '#d300c5';
                            const borderColor = ability.type === 'active' ? 'border-p5-red' : 'border-p5-purple';
                            const bgColor = ability.type === 'active' ? 'bg-p5-red/10' : 'bg-p5-purple/10';
                            const textColor = ability.type === 'active' ? 'text-p5-red' : 'text-p5-purple';
                            const hoverBg = ability.type === 'active' ? 'hover:bg-p5-red hover:text-white' : 'hover:bg-p5-purple hover:text-white';
                            const shadowColor = ability.type === 'active' ? 'shadow-[4px_4px_0_#ff2a6d]' : 'shadow-[4px_4px_0_#d300c5]';
                            const shadowNeon = ability.type === 'active' ? 'shadow-neon-pink' : 'shadow-neon-purple';

                            return (
                                <div key={ability.id} className={`flex flex-col border-2 ${isUnlocked ? `${borderColor} ${bgColor}` : 'border-white/10 bg-black/40'} p-5 transition-all group hover:bg-white/5 relative overflow-hidden clip-jagged`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 bg-black border-2 ${isUnlocked ? borderColor : 'border-white/20'} transform -skew-x-12`}>
                                                <div className="transform skew-x-12">
                                                    <IconComponent className={isUnlocked ? textColor : 'text-white/40'} size={24} />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className={`font-p5-display tracking-widest text-xl ${isUnlocked ? 'text-white' : 'text-white/60'}`}>{ability.name}</h3>
                                                {ability.cooldown && (
                                                    <span className="text-white/40 font-p5-ui text-xs flex items-center gap-1 uppercase tracking-widest">
                                                        <Icons.Timer size={12} /> {ability.cooldown}s {language === 'it' ? 'RICARICA' : 'COOLDOWN'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-white/70 font-p5-ui text-lg mb-6 flex-1 pr-4 leading-relaxed">
                                        {ability.desc}
                                    </p>
                                    
                                    <button 
                                        onClick={() => {
                                            playSound('click', 50);
                                            handlePurchase(ability.id, ability.cost);
                                        }}
                                        disabled={isUnlocked || !canAfford}
                                        className={`
                                            w-full py-3 font-p5-display text-xl tracking-widest transition-all uppercase flex items-center justify-center gap-2 transform -skew-x-6 border-2
                                            ${isUnlocked 
                                                ? `bg-black/50 ${textColor} ${borderColor} cursor-default` 
                                                : !canAfford 
                                                    ? 'bg-black/50 text-white/30 border-white/10 cursor-not-allowed'
                                                    : `bg-black text-white ${borderColor} ${hoverBg} ${shadowColor} active:scale-95`}
                                        `}
                                    >
                                        <span className="transform skew-x-6 flex items-center gap-2">
                                            {isUnlocked ? (
                                                <>
                                                    <Icons.CheckCircle2 size={20} />
                                                    {language === 'it' ? 'INSTALLATO' : 'INSTALLED'}
                                                </>
                                            ) : (
                                                <>
                                                    {ability.cost} COINS
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                        {displayedItems.length === 0 && (
                            <div className="col-span-full py-12 text-center text-white/50 font-p5-ui text-xl italic uppercase tracking-widest border-2 border-dashed border-white/20">
                                {language === 'it' ? 'NESSUN MODULO DISPONIBILE IN QUESTA CATEGORIA' : 'NO MODULES AVAILABLE IN THIS CATEGORY'}
                            </div>
                        )}
                    </div>

                    
                    {/* Footer Close */}
                    <div className="flex justify-center mt-4">
                        <button 
                            onClick={() => {
                                try {
                                    const val = localStorage.getItem('neon_blocks_settings');
                                    let vol = 50;
                                    if (val) vol = JSON.parse(val).soundVolume ?? 50;
                                    playSound('click', vol);
                                } catch(e) {}
                                onClose();
                            }} 
                            onMouseEnter={() => {
                                try {
                                    const val = localStorage.getItem('neon_blocks_settings');
                                    let vol = 50;
                                    if (val) vol = JSON.parse(val).soundVolume ?? 50;
                                    playSound('hover', vol);
                                } catch(e) {}
                            }}
                            className="group relative bg-[#050510] text-p5-cyan border-2 border-p5-cyan px-8 py-3 font-p5-display text-2xl hover:bg-p5-cyan hover:text-black transition-all duration-300 transform -skew-x-12 shadow-[4px_4px_0_#05d9e8] flex items-center justify-center overflow-hidden"
                        >
                            <span className="relative z-10 transform skew-x-12 tracking-widest uppercase">
                                {language === 'it' ? 'CHIUDI NEGOZIO' : 'CLOSE SHOP'}
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </div>

                 </div>
             </div>
        </div>
    );
};

export default ShopModal;
