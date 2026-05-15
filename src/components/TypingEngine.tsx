import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, Share2, Trophy, Zap, Loader2, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { sounds } from '../lib/sounds';

interface TypingEngineProps {
  onComplete?: (stats: { wpm: number; accuracy: number; duration: number }) => void;
  onUpdate?: (stats: { wpm: number; accuracy: number; progress: number }) => void;
  text?: string;
  duration?: number; // in seconds
  mode?: 'timer' | 'words';
}

const DEFAULT_TEXT = "In a world of neon light, every keystroke counts. Speed is power, accuracy is precision. Master the machine, dominate the rankings. Typogram is the ultimate arena for the modern digital scribe. Push your limits, claim your throne, and let the algorithm hear your rhythm.";

export const TypingEngine: React.FC<TypingEngineProps> = ({
  onComplete,
  onUpdate,
  text = DEFAULT_TEXT,
  duration = 30,
  mode = 'timer'
}) => {
  const { profile, updateStats, login } = useAuthStore();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(duration);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const words = text.split(' ');

  const calculateStats = useCallback(() => {
    if (!startTime) return { wpm: 0, accuracy: 100 };

    const now = endTime || Date.now();
    const timeElapsed = (now - startTime) / 1000 / 60; // in minutes
    
    // Correct characters count
    let correctChars = 0;
    const inputChars = userInput.split('');
    const targetChars = text.split('');
    
    inputChars.forEach((char, i) => {
      if (char === targetChars[i]) correctChars++;
    });

    const wordsTyped = correctChars / 5;
    const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
    const currentAccuracy = Math.round((correctChars / userInput.length) * 100) || 100;

    return { wpm: currentWpm, accuracy: currentAccuracy };
  }, [startTime, endTime, userInput, text]);

  useEffect(() => {
    if (userInput.length > 0 && !startTime) {
      setStartTime(Date.now());
    }

    if (userInput.length === text.length || (mode === 'timer' && timeLeft === 0)) {
      finishTest();
    }

    const { wpm, accuracy } = calculateStats();
    setWpm(wpm);
    setAccuracy(accuracy);

    if (onUpdate) {
      onUpdate({ wpm, accuracy, progress: (userInput.length / text.length) * 100 });
    }
  }, [userInput, timeLeft, mode, text.length, calculateStats, onUpdate, startTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isFinished && mode === 'timer') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isFinished, mode]);

  const finishTest = () => {
    if (isFinished) return;
    setIsFinished(true);
    setEndTime(Date.now());
    
    // Final stats
    const { wpm, accuracy } = calculateStats();
    if (onComplete) {
      onComplete({ wpm, accuracy, duration: (Date.now() - (startTime || Date.now())) / 1000 });
    }
    
    sounds.playFinish();

    if (wpm > 50) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F3FF', '#8B5CF6', '#00FF95']
      });
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    const val = e.target.value;
    if (val.length <= text.length) {
      const isCorrect = val[val.length - 1] === text[val.length - 1];
      if (isCorrect) {
        if (text[val.length - 1] === ' ') {
          sounds.playComplete();
        } else {
          sounds.playCorrect();
        }
      } else {
        sounds.playIncorrect();
      }
      setUserInput(val);
    }
  };

  const handleSave = async () => {
    if (isSaved || isSaving || !profile) return;
    setIsSaving(true);
    try {
      await updateStats(wpm, accuracy);
      setIsSaved(true);
      sounds.playNotification();
    } catch (error) {
      console.error('Failed to save stats:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsFinished(false);
    setIsSaved(false);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(duration);
    inputRef.current?.focus();
  };

  const renderText = () => {
    return targetChars.map((char, i) => {
      let colorClass = "text-gray-500";
      let isCurrent = userInput.length === i;
      
      if (i < userInput.length) {
        colorClass = userInput[i] === char ? "text-[#00F3FF] glow-cyan" : "text-[#FF4D6D] glow-red underline";
      }

      return (
        <span key={i} className={cn("relative transition-colors duration-150", colorClass)}>
          {char}
          {isCurrent && (
            <motion.span 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute left-0 bottom-0 w-full h-[2px] bg-[#00F3FF] shadow-[0_0_10px_#00F3FF]"
            />
          )}
        </span>
      );
    });
  };

  const targetChars = text.split('');

  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8 bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#8B5CF6]/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00F3FF]/10 blur-[100px] rounded-full" />

      {/* Stats Header */}
      <div className="flex justify-between items-center text-sm font-mono tracking-widest text-[#00F3FF]">
        <div className="space-y-1">
          <div className="opacity-50 uppercase">Speed</div>
          <div className="text-3xl font-bold flex items-center gap-2">
            {wpm} <span className="text-xs font-normal">WPM</span>
          </div>
        </div>
        <div className="space-y-1 text-center">
          <div className="opacity-50 uppercase">Time</div>
          <AnimatePresence mode="wait">
            <motion.div 
              key={timeLeft}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn("text-3xl font-bold", timeLeft < 10 && "text-[#FF4D6D] animate-pulse")}
            >
              {timeLeft}s
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="space-y-1 text-right">
          <div className="opacity-50 uppercase">Accuracy</div>
          <div className="text-3xl font-bold">
            {accuracy}%
          </div>
        </div>
      </div>

      {/* Text Display */}
      <div 
        className="relative text-2xl leading-relaxed text-left font-mono break-words cursor-text min-h-[160px] select-none"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="z-10 relative">
          {renderText()}
        </div>
        
        {/* Hidden Input */}
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInput}
          className="absolute inset-0 opacity-0 cursor-default resize-none"
          autoFocus
          spellCheck={false}
          disabled={isFinished}
        />
      </div>

      {/* Controls / Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-widest text-white/50 hover:text-white transition-colors group"
        >
          <RefreshCcw className="w-4 h-4 group-active:rotate-180 transition-transform duration-300" />
          Restart Test
        </button>
        
        <div className="flex gap-4">
          <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/40 uppercase">
            Tab + Enter to restart
          </kbd>
        </div>
      </div>

      {/* Finish Overlay */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-[#0B0F19]/95 backdrop-blur-md rounded-2xl border border-[#00F3FF]/30"
          >
            <div className="text-center space-y-6 max-w-sm">
              <div className="w-20 h-20 bg-[#00F3FF]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00F3FF]/50 shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                <Trophy className="w-10 h-10 text-[#00F3FF]" />
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tighter">Test Complete</h2>
              {!profile && (
                <div className="bg-[#00F3FF]/10 border border-[#00F3FF]/30 p-3 rounded-lg text-xs text-[#00F3FF] animate-pulse">
                  REGISTER TO SAVE STATS & UNLOCK REWARDS
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-xs text-white/40 uppercase mb-1">Raw Speed</div>
                  <div className="text-2xl font-bold text-[#00F3FF]">{wpm} WPM</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-xs text-white/40 uppercase mb-1">Accuracy</div>
                  <div className="text-2xl font-bold text-[#00FF95]">{accuracy}%</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={reset}
                  className="flex-1 px-4 py-3 bg-[#0B0F19] text-white border border-white/10 font-bold rounded-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" /> Reset
                </button>
                {profile ? (
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={handleSave}
                      disabled={isSaved || isSaving}
                      className={cn(
                        "flex-1 p-3 rounded-lg transition-all flex items-center justify-center gap-2",
                        isSaved ? "bg-[#00FF95]/20 text-[#00FF95] border border-[#00FF95]/30 cursor-default" : "bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/80"
                      )}
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isSaved ? <Zap className="w-4 h-4" /> : <Trophy className="w-4 h-4" />)}
                      {isSaving ? 'Saving...' : (isSaved ? 'Saved' : 'Save')}
                    </button>
                    <button 
                      onClick={() => navigate('/certificate')}
                      className="flex-1 p-3 bg-white/5 border border-white/10 text-[#00F3FF] rounded-lg hover:bg-[#00F3FF]/10 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
                    >
                      <Award className="w-4 h-4" /> Certificate
                    </button>
                  </div>
                ) : (
                  <button onClick={() => login()} className="flex-1 p-3 bg-[#00F3FF] text-[#0B0F19] rounded-lg hover:bg-[#00D8FF] transition-all px-6 font-bold">
                    Join Typogram
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
