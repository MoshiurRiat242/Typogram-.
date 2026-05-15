import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { TypingEngine } from '../components/TypingEngine';
import { Trophy, Sword, Zap, Shield, ChevronRight, Lock, Star, Coins } from 'lucide-react';
import { cn } from '../lib/utils';

export const GameArena: React.FC = () => {
    const { profile, updateStats } = useAuthStore();
    const [gameState, setGameState] = useState<'map' | 'playing' | 'result'>('map');
    const [currentLevel, setCurrentLevel] = useState(1);
    const [lastScore, setLastScore] = useState<{ wpm: number, accuracy: number } | null>(null);

    const levels = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Protocol ${i + 1}`,
        difficulty: i < 3 ? 'Novice' : i < 7 ? 'Advanced' : 'Elite',
        requiredWpm: 15 + (i * 10),
        reward: 150 + (i * 50)
    }));

    const handleLevelSelect = (lvl: number) => {
        setCurrentLevel(lvl);
        setGameState('playing');
    };

    const handleComplete = (stats: { wpm: number, accuracy: number, duration: number }) => {
        const levelData = levels.find(l => l.id === currentLevel);
        if (levelData && stats.wpm >= levelData.requiredWpm) {
            updateStats(stats.wpm, stats.accuracy);
            setLastScore(stats);
            setGameState('result');
        } else {
            // Failed to meet WPM requirement
            setLastScore(stats);
            setGameState('result');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto overflow-hidden cyber-grid">
            <AnimatePresence mode="wait">
                {gameState === 'map' && (
                    <motion.div 
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="space-y-12"
                    >
                        <header className="flex flex-col items-center text-center space-y-4">
                            <Sword className="w-12 h-12 text-[#FF4D6D] animate-pulse" />
                            <h1 className="text-6xl font-black italic tracking-tighter uppercase">
                                NEURAL <span className="text-[#8B5CF6]">CAMPAIGN</span>
                            </h1>
                            <p className="text-white/40 max-w-lg text-sm">
                                Conquer 100+ precision-calibrated neural nodes. Unlock legendary artifacts and dominate the global hierarchy.
                            </p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            {levels.map((lvl) => {
                                const isUnlocked = (profile?.stats.level || 1) >= Math.floor(lvl.id / 2) + 1;
                                return (
                                    <motion.div 
                                        key={lvl.id}
                                        whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
                                        onClick={() => isUnlocked && handleLevelSelect(lvl.id)}
                                        className={cn(
                                            "relative p-6 rounded-3xl border transition-all cursor-pointer group overflow-hidden",
                                            isUnlocked 
                                                ? "bg-white/5 border-white/10 hover:border-[#00F3FF]/40" 
                                                : "bg-[#0B0F19] border-white/5 opacity-50 grayscale pointer-events-none"
                                        )}
                                    >
                                        {!isUnlocked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-[#0B0F19]/60 z-10">
                                                <Lock className="w-8 h-8 text-white/20" />
                                            </div>
                                        )}
                                        
                                        <div className="relative z-0">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-[#00F3FF]">
                                                    {lvl.id}
                                                </div>
                                                <Star className={cn("w-4 h-4", lvl.id % 2 === 0 ? "text-[#00F3FF]" : "text-white/10")} />
                                            </div>
                                            <h3 className="font-bold text-sm mb-1">{lvl.title}</h3>
                                            <div className="text-[10px] text-white/40 font-mono uppercase mb-4">{lvl.difficulty}</div>
                                            
                                            <div className="space-y-2 pt-4 border-t border-white/5">
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-white/20 uppercase font-bold">Goal</span>
                                                    <span className="text-[#00F3FF] font-black">{lvl.requiredWpm} WPM</span>
                                                </div>
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-white/20 uppercase font-bold">Reward</span>
                                                    <span className="text-[#EAB308] font-black">{lvl.reward} CR</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {isUnlocked && (
                                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#00F3FF]/10 blur-2xl rounded-full group-hover:bg-[#00F3FF]/20 transition-all" />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {gameState === 'playing' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="py-12"
                    >
                        <div className="flex items-center justify-between mb-12 max-w-4xl mx-auto">
                            <button 
                                onClick={() => setGameState('map')}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10"
                            >
                                Abort Mission
                            </button>
                            <div className="text-center">
                                <div className="text-[10px] text-white/40 uppercase font-black tracking-[0.3em]">Neural Node</div>
                                <div className="text-2xl font-black text-[#00F3FF] italic">LEVEL {currentLevel}</div>
                            </div>
                            <div className="w-[100px]" />
                        </div>
                        <TypingEngine 
                            duration={30}
                            onComplete={handleComplete}
                        />
                    </motion.div>
                )}

                {gameState === 'result' && lastScore && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto text-center space-y-8 py-12"
                    >
                        <div className={cn(
                            "w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-lg transform rotate-45",
                            lastScore.wpm >= levels[currentLevel-1].requiredWpm 
                                ? "bg-[#00FF95]/20 border-2 border-[#00FF95] shadow-[#00FF95]/20" 
                                : "bg-[#FF4D6D]/20 border-2 border-[#FF4D6D] shadow-[#FF4D6D]/20"
                        )}>
                            <Trophy className={cn("w-12 h-12 -rotate-45", lastScore.wpm >= levels[currentLevel-1].requiredWpm ? "text-[#00FF95]" : "text-[#FF4D6D]")} />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                                {lastScore.wpm >= levels[currentLevel-1].requiredWpm ? 'Node Captured' : 'Upload Failed'}
                            </h2>
                            <p className="text-white/40 font-mono text-xs uppercase tracking-widest">
                                Required: {levels[currentLevel-1].requiredWpm} WPM | Actual: {lastScore.wpm} WPM
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="text-[10px] text-white/40 uppercase font-bold mb-1">XP Gained</div>
                                <div className="text-2xl font-black text-[#8B5CF6]">+{Math.floor(lastScore.wpm * 2)}</div>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="text-[10px] text-white/40 uppercase font-bold mb-1">Coins Looted</div>
                                <div className="text-2xl font-black text-[#EAB308]">+{lastScore.wpm >= levels[currentLevel-1].requiredWpm ? levels[currentLevel-1].reward : 0}</div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {lastScore.wpm >= levels[currentLevel-1].requiredWpm ? (
                                <button 
                                    onClick={() => handleLevelSelect(currentLevel + 1)}
                                    className="w-full py-4 bg-[#00F3FF] text-[#0B0F19] font-black rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] flex items-center justify-center gap-2"
                                >
                                    Proceed to Next Node <ChevronRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleLevelSelect(currentLevel)}
                                    className="w-full py-4 bg-white/10 text-white font-black rounded-xl hover:bg-white/20 flex items-center justify-center gap-2"
                                >
                                    Retry Calibration <Zap className="w-5 h-5 text-[#00F3FF]" />
                                </button>
                            )}
                            <button 
                                onClick={() => setGameState('map')}
                                className="w-full py-4 bg-transparent border border-white/10 text-white/40 font-bold rounded-xl hover:text-white transition-colors"
                            >
                                Return to Map
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
