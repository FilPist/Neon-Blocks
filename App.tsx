
import React, { useState, useCallback, useEffect } from 'react';
import { useTetris } from './hooks/useTetris';
import Board from './components/Board';
import { ScoreBoard, NextPiece, MenuButton, Modal } from './components/P5UI';
import P5Background from './components/P5Background';
import MainMenu from './components/MainMenu';
import TransitionOverlay, { TransitionStage } from './components/TransitionOverlay';
import IntroSequence from './components/IntroSequence';
import PauseMenu from './components/PauseMenu';
import ShopModal from './components/ShopModal';
import OnboardingModal from './components/OnboardingModal';
import { Settings, Profile, GameMode, HighScore } from './types';
import { TRANSLATIONS, PROFILE_STORAGE_KEY, ABILITIES } from './constants';
import * as Icons from 'lucide-react';
import { Volume2, VolumeX } from 'lucide-react';

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
      soundVolume: 50,
      language: 'en'
  });

  const [profile, setProfile] = useState<Profile>({
      coins: 0,
      level: 1,
      xp: 0,
      unlockedAbilities: ['wipe'],
      hasSeenOnboarding: false
  });

  useEffect(() => {
      try {
          const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
          if (savedProfile) {
              const parsed = JSON.parse(savedProfile);
              if (!parsed.unlockedAbilities || parsed.unlockedAbilities.length === 0) {
                  parsed.unlockedAbilities = ['wipe'];
              }
              if (parsed.hasSeenOnboarding === undefined) {
                  parsed.hasSeenOnboarding = false;
              }
              setProfile(parsed);
          } else {
              localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
                  coins: 0, level: 1, xp: 0, unlockedAbilities: ['wipe'], hasSeenOnboarding: false
              }));
          }
      } catch (e) {
          console.error("Failed to load profile", e);
      }
  }, []);

  const saveProfile = (newProfile: Profile) => {
      setProfile(newProfile);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
  };
  
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [showShop, setShowShop] = useState(false);

  const handleCoinsEarned = useCallback((coins: number) => {
      setProfile(prev => {
          const hasMagnet = prev.unlockedAbilities.includes('magnet');
          const finalCoins = hasMagnet ? coins * 2 : coins;
          const newProfile = { ...prev, coins: prev.coins + finalCoins };
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
          return newProfile;
      });
  }, []);

  const {
    grid,
    piece,
    score,
    lines,
    level,
    gameOver,
    isPaused,
    isPlaying,
    isShaking,
    nextPieceType,
    popups,
    highScores,
    speedRatio,
    startGame,
    quitGame,
    setIsPaused,
    triggerAbility
  } = useTetris(settings.soundVolume, handleCoinsEarned);

  const t = TRANSLATIONS[settings.language];
  const [transitionStage, setTransitionStage] = useState<TransitionStage>('idle');
  const [showGame, setShowGame] = useState(false);
  const [isMenuExiting, setIsMenuExiting] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
      if (!showGame || isPaused || gameOver) return;
      const interval = setInterval(() => {
          setCooldowns(prev => {
              const next = { ...prev };
              let changed = false;
              for (const key in next) {
                  if (next[key] > 0) {
                      next[key] -= 1;
                      changed = true;
                  }
              }
              return changed ? next : prev;
          });
      }, 1000);
      return () => clearInterval(interval);
  }, [showGame, isPaused, gameOver]);

  const handleTriggerAbility = useCallback((id: string) => {
      if (cooldowns[id] > 0) return;
      
      const ab = ABILITIES.find(a => a.id === id);
      if (ab && ab.cooldown) {
          setCooldowns(prev => ({ ...prev, [id]: ab.cooldown }));
      }
      triggerAbility(id);
  }, [cooldowns, triggerAbility]);

  // Ability Hotkeys
  useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
         if (gameMode !== 'abilities' || isPaused || gameOver || !showGame) return;
         
         const activeAbilities = profile.unlockedAbilities.filter(id => {
             const ab = ABILITIES.find(a => a.id === id);
             return ab && ab.type === 'active';
         });
         
         const key = e.key;
         if (['1', '2', '3', '4', '5', '6'].includes(key)) {
             const index = parseInt(key) - 1;
             if (index >= 0 && index < activeAbilities.length) {
                 handleTriggerAbility(activeAbilities[index]);
             }
         }
     };
     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameMode, profile.unlockedAbilities, handleTriggerAbility, isPaused, gameOver, showGame]);

  // Highest score from storage
  const bestScore = highScores.length > 0 ? highScores[0].score : 0;

  const handleStart = useCallback((mode: GameMode = 'classic') => {
      setGameMode(mode);
      setCooldowns({});
      setIsMenuExiting(true); 
      setTimeout(() => {
          setTransitionStage('in'); 
          setTimeout(() => {
              setShowGame(true);
              startGame();
              setTransitionStage('out'); 
              setTimeout(() => {
                  setTransitionStage('idle');
                  setIsMenuExiting(false);
              }, 700); 
          }, 1000); 
      }, 500); 
  }, [startGame]);

  const handleQuit = useCallback(() => {
      setTransitionStage('in');
      setTimeout(() => {
        quitGame();
        setShowGame(false);
        setTransitionStage('out');
        setTimeout(() => setTransitionStage('idle'), 700);
      }, 1000);
  }, [quitGame]);

  // Quick mute toggle for game UI
  const toggleMute = () => {
      setSettings(s => ({ ...s, soundVolume: s.soundVolume > 0 ? 0 : 50 }));
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-p5-ui select-none bg-[#050510]">
      {/* Dynamic Background Intensity based on Speed/Level */}
      <P5Background intensity={speedRatio} />
      
      {!introComplete && <IntroSequence onComplete={() => setIntroComplete(true)} />}

      <TransitionOverlay stage={transitionStage} language={settings.language} />

      {introComplete && !showGame && profile.hasSeenOnboarding === false && (
          <OnboardingModal 
              isOpen={true} 
              language={settings.language}
              onClose={() => {
                  setProfile(p => {
                      const np = { ...p, hasSeenOnboarding: true };
                      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(np));
                      return np;
                  });
              }} 
          />
      )}

      <div className={`transition-opacity duration-1000 ${introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {!showGame ? (
            <MainMenu 
                onStart={handleStart} 
                settings={settings}
                onUpdateSettings={setSettings}
                isExiting={isMenuExiting}
                highScores={highScores}
                profile={profile}
                onOpenShop={() => setShowShop(true)}
            />
        ) : (
            <div className="relative z-10 w-full h-screen grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 items-center justify-items-center perspective-1000">
              
              {/* Left Column: Stats */}
              <div className={`
                    hidden lg:flex flex-col items-end justify-center h-full w-full pr-16 space-y-16 relative z-20 
                    transition-all duration-700 ease-out-expo origin-right
                    ${isPaused && !gameOver ? '-translate-x-[100vw] rotate-[-5deg] opacity-0' : 'translate-x-0 rotate-0 opacity-100 animate-slam-in'}
              `}>
                  <div className="relative group cursor-default transform scale-75 origin-right animate-float-glitch">
                      <div className="bg-p5-dark text-white font-p5-display text-6xl px-6 py-3 border-4 border-white shadow-neon-pink relative z-10">
                          NEON<span className="text-p5-red">BLOCKS</span>
                      </div>
                  </div>
                  <ScoreBoard score={score} level={level} lines={lines} speedRatio={speedRatio} highScore={bestScore} />
              </div>

              {/* Center: The Board */}
              <div className={`
                    relative flex items-center justify-center h-full py-4 lg:py-8 z-10 
                    transition-all duration-700 ease-out-expo
                    ${isPaused && !gameOver ? 'scale-75 opacity-20 blur-sm brightness-50 translate-y-10' : 'scale-100 opacity-100 animate-slam-in'}
              `}>
                  <Board 
                    grid={grid} 
                    piece={piece} 
                    isShaking={isShaking} 
                    popups={popups} 
                  />
              </div>

              {/* Right Column: Next & Controls */}
              <div className={`
                    hidden lg:flex flex-col items-start justify-center h-full w-full pl-16 space-y-12 relative z-20 
                    transition-all duration-700 ease-out-expo origin-left
                    ${isPaused && !gameOver ? 'translate-x-[100vw] rotate-[5deg] opacity-0' : 'translate-x-0 rotate-0 opacity-100 animate-slam-in'}
              `}>
                  <NextPiece type={nextPieceType} />
                  
                  {gameMode === 'abilities' && (
                      <div className="flex flex-col gap-2 w-full max-w-[280px]">
                          <div className="text-white font-p5-display text-2xl flex justify-between">
                              <span>COINS</span>
                              <span className="text-p5-cyan">{profile.coins}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                              {profile.unlockedAbilities.map(id => {
                                  const ab = ABILITIES.find(a => a.id === id);
                                  if (!ab) return null;
                                  // @ts-ignore
                                  const IconComponent = Icons[ab.icon] || Icons.Zap;
                                  
                                  if (ab.type === 'passive') {
                                      return (
                                          <div key={id} className="bg-black/50 border-2 border-white/10 p-2 flex flex-col items-center justify-center gap-1 text-white/40">
                                              <IconComponent size={20} className="mt-2" />
                                              <span className="text-[10px] uppercase font-bold tracking-wider text-center leading-tight">{ab.name}</span>
                                          </div>
                                      );
                                  }

                                  const activeAbilities = profile.unlockedAbilities.filter(uId => {
                                      const uAb = ABILITIES.find(a => a.id === uId);
                                      return uAb && uAb.type === 'active';
                                  });
                                  const hotkeyNumber = activeAbilities.indexOf(id) + 1;

                                  return (
                                      <button 
                                          key={id}
                                          className={`bg-black border-2 border-white/20 p-2 flex flex-col items-center justify-center gap-1 transition-colors relative group ${cooldowns[id] > 0 ? 'opacity-50 pointer-events-none' : 'hover:border-p5-cyan hover:text-p5-cyan active:scale-95 text-white/70'}`}
                                          onClick={() => handleTriggerAbility(id)}
                                      >
                                          <div className="absolute top-0 right-1 text-p5-cyan/50 font-p5-display text-sm group-hover:text-p5-cyan transition-colors">[{hotkeyNumber}]</div>
                                          <IconComponent size={20} className={`mt-2 ${cooldowns[id] > 0 ? '' : 'group-hover:animate-pulse'}`} />
                                          <span className="text-[10px] uppercase font-bold tracking-wider text-center leading-tight">{ab.name}</span>
                                          {cooldowns[id] > 0 && (
                                              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                                  <span className="text-p5-red font-p5-display text-2xl animate-pulse">{cooldowns[id]}</span>
                                              </div>
                                          )}
                                      </button>
                                  );
                              })}
                          </div>
                      </div>
                  )}

                  <div className="flex flex-col gap-6 w-full max-w-[280px]">
                      <MenuButton label={isPaused ? t.resume : t.paused} onClick={() => setIsPaused()} active={!gameOver} primary />
                      <div className="flex gap-4 w-full">
                            <button onClick={toggleMute} className="flex-1 bg-p5-dark text-white p-4 border-2 border-p5-cyan hover:bg-p5-cyan hover:text-black transition-all transform hover:rotate-3 shadow-neon-cyan flex items-center justify-center">
                              {settings.soundVolume > 0 ? <Volume2 size={28} /> : <VolumeX size={28} />}
                            </button>
                            <button onClick={handleQuit} className="flex-1 bg-p5-dark text-p5-red p-4 border-2 border-p5-red hover:bg-p5-red hover:text-white transition-all transform hover:-rotate-3 shadow-neon-pink font-bold flex items-center justify-center uppercase tracking-widest">{t.quit}</button>
                      </div>
                  </div>
              </div>

              {isPaused && !gameOver && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center">
                    <PauseMenu 
                        onResume={() => setIsPaused()} 
                        onQuit={handleQuit} 
                        settings={settings}
                        onUpdateSettings={setSettings}
                    />
                  </div>
              )}
            </div>
        )}
      </div>

      <Modal title={t.gameOver} isOpen={gameOver}>
          <div className="flex flex-col gap-8 items-center">
              <div className="text-4xl font-black bg-white text-black px-6 py-2 transform -skew-x-12 inline-block border-2 border-p5-dark shadow-hard-black">
                {t.score}: {score.toLocaleString()}
              </div>
              <div className="w-full h-px bg-white/30" />
              <div className="flex flex-col w-full gap-4">
                  <MenuButton label={t.retry} onClick={() => handleStart(gameMode)} primary />
                  <button onClick={handleQuit} className="text-white/70 hover:text-white underline underline-offset-4 decoration-p5-red decoration-2 uppercase tracking-widest font-bold">
                      {t.back}
                  </button>
              </div>
          </div>
      </Modal>

      <ShopModal 
        isOpen={showShop} 
        onClose={() => setShowShop(false)} 
        profile={profile} 
        language={settings.language}
        onPurchase={(abilityId, cost) => {
            setProfile(prev => {
                const newProfile = {
                    ...prev,
                    coins: prev.coins - cost,
                    unlockedAbilities: [...prev.unlockedAbilities, abilityId]
                };
                localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
                return newProfile;
            });
        }} 
      />
    </div>
  );
};

export default App;
