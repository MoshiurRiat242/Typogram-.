import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Zap, Trophy, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { TypingEngine } from '../components/TypingEngine';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const { profile, user, updateStats, login, isSigningIn, error } = useAuthStore();
  const navigate = useNavigate();

  const handleComplete = (stats: { wpm: number; accuracy: number; duration: number }) => {
    if (user) {
      updateStats(stats.wpm, stats.accuracy);
    }
  };

  return (
    <div className="relative min-h-screen pt-20 pb-20 px-4 overflow-hidden cyber-grid">
      {/* Auth Error Notification */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[70] w-full max-w-md px-4"
          >
            <div className="bg-[#FF4D6D] text-white p-4 rounded-2xl shadow-[0_0_30px_rgba(255,77,109,0.3)] border border-white/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-widest">{error}</div>
              </div>
              <button 
                onClick={() => useAuthStore.getState().setError(null)}
                className="p-1 hover:bg-white/10 rounded transition-all"
              >
                <ArrowRight className="w-4 h-4 rotate-45" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#00F3FF]/5 via-transparent to-transparent blur-[120px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto text-center space-y-12 mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#00F3FF] text-xs font-mono tracking-widest uppercase mb-4">
            <Zap className="w-3 h-3 fill-current" /> Next-Gen Typing Arena
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            MASTER YOUR <br /> 
            <span className="text-[#00F3FF] glow-cyan">RHYTHM</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/60 font-light leading-relaxed">
            Enterprise-grade real-time typing contest platform. Practice with precision, 
            compete in high-stakes arenas, and claim your digital legacy.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {!user ? (
              <button 
                onClick={() => login()}
                disabled={isSigningIn}
                className="px-8 py-4 bg-[#00F3FF] text-[#0B0F19] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all flex items-center gap-2 group disabled:opacity-50"
              >
                {isSigningIn ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B0F19]" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
                {isSigningIn ? 'Connecting...' : 'Join the Network'}
              </button>
            ) : (
              <div className="flex gap-4">
                 <div className="px-8 py-4 bg-white/5 border border-[#00F3FF]/30 rounded-xl flex flex-col items-start min-w-[160px]">
                    <div className="text-[10px] text-white/40 uppercase font-mono">Current WPM</div>
                    <div className="text-2xl font-black text-[#00F3FF]">{profile?.stats.highestWpm || 0}</div>
                 </div>
                 <button 
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-4 bg-[#8B5CF6] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all flex items-center gap-2 transition-all active:scale-95"
                  >
                    Dashboard <Zap className="w-4 h-4" />
                 </button>
              </div>
            )}
            <button 
              onClick={() => navigate('/leaderboard')}
              className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all active:scale-95"
            >
              Leaderboard
            </button>
          </div>
        </motion.div>

        {/* Live Demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative pt-12"
        >
          <div className="absolute inset-0 bg-[#00F3FF]/5 blur-[100px] rounded-full scale-75 -z-10" />
          <TypingEngine onComplete={handleComplete} />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 px-4">
        {[
          { icon: <Keyboard />, title: "Precision Engine", desc: "Proprietary zero-latency calculation for real-time WPM diagnostics.", color: "text-[#00F3FF]", path: '/' },
          { icon: <Trophy />, title: "Elite Contests", desc: "Live multiplayer events with instant rankings and high-stakes arenas.", color: "text-[#8B5CF6]", path: '/contests' },
          { icon: <Zap />, title: "Campaign Mode", desc: "Progress through 100+ neural levels and unlock legendary badges.", color: "text-[#FF4D6D]", path: '/game' },
          { icon: <Shield />, title: "Neural Hosting", desc: "Initialize private instances for organizations or local events.", color: "text-[#00FF95]", path: '/host' }
        ].map((f, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -8 }}
            onClick={() => navigate(f.path)}
            className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-4 hover:border-white/20 transition-all group cyber-grid cursor-pointer"
          >
            <div className={cn("w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10", f.color)}>
              {/* @ts-ignore */}
              {React.cloneElement(f.icon as React.ReactElement, { className: 'w-7 h-7' })}
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tight">{f.title}</h3>
            <p className="text-white/40 leading-relaxed text-xs font-medium uppercase tracking-wide">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Stats Banner */}
      <section className="max-w-7xl mx-auto mt-32 py-16 border-y border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Scribes", value: "12K+" },
            { label: "Tests Taken", value: "1.4M" },
            { label: "Top Speed", value: "248 WPM" },
            { label: "XP Distributed", value: "450M" }
          ].map((s, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-xs uppercase tracking-widest text-white/30 font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
