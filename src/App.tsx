import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Sword, Trophy, Terminal, Plus, LogOut, MessageSquare, Menu, X as CloseIcon, Settings, Volume2, Zap, Shield, Cpu, Globe, Rocket, HelpCircle } from 'lucide-react';
import { LandingPage } from './pages/Landing';
import { ContestPage } from './pages/Contest';
import { Dashboard } from './pages/Dashboard';
import { HostContest } from './pages/HostContest';
import { GameArena } from './pages/GameArena';
import { Leaderboard } from './pages/Leaderboard';
import { ContestsManager } from './pages/Contests';
import { Certificate } from './pages/Certificate';
import { AIHelpCenter } from './components/AIHelpCenter';
import { TypogramLogo } from './components/TypogramLogo';
import { useAuthStore } from './store/useAuthStore';
import { useSettingsStore } from './store/useSettingsStore';
import { auth } from './lib/firebase';
import { cn } from './lib/utils';

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const { user, profile, login, isSigningIn, isAdmin, logout, error, setError } = useAuthStore();
  const { volume, setVolume } = useSettingsStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const AboutPage = () => (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto space-y-20">
      <header className="text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-6 py-2 bg-[#00F3FF]/10 border border-[#00F3FF]/30 rounded-full text-xs font-black text-[#00F3FF] uppercase tracking-[0.4em] mb-4 shadow-[0_0_30px_rgba(0,243,255,0.2)]"
        >
          Neural Architecture / MiraCore v2.0.4
        </motion.div>
        <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-tight">
          About <span className="text-[#00F3FF] drop-shadow-[0_0_20px_rgba(0,243,255,0.5)]">Typogram</span>
        </h1>
        <p className="text-white/40 text-xl uppercase tracking-[0.3em] max-w-2xl mx-auto font-bold">
          Developed by <span className="text-white">MiraCore Logix</span> / A subsidiary of <span className="text-[#8B5CF6]">M-Square Devs</span>
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: 'The Vision', text: 'Typogram was born from a desire to turn data entry into a high-octane neural experience. We believe your keyboard is your sword in the digital arena.', icon: Rocket, color: 'from-[#00F3FF] to-[#00D8FF]' },
          { title: 'MiraCore Engine', text: 'Our proprietary synchronization protocol ensures that every keystroke is registered and verified across the global grid in under 5ms.', icon: Cpu, color: 'from-[#8B5CF6] to-[#7C3AED]' },
          { title: 'Global Grid', text: 'With nodes spanning across 4 continents, Typogram connects elites from every corner of the globe in a singular, unified stream.', icon: Globe, color: 'from-[#00FF95] to-[#00E686]' }
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="p-10 bg-[#0B0F19] border border-white/10 rounded-[3rem] space-y-6 relative overflow-hidden group shadow-2xl"
          >
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br", card.color)} />
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-[#0B0F19] bg-gradient-to-br shadow-lg", card.color)}>
              <card.icon className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tight">{card.title}</h2>
            <p className="text-white/50 text-sm leading-relaxed font-bold tracking-tight">
              {card.text}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="p-16 bg-white/[0.02] border border-white/5 rounded-[5rem] space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F3FF]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="relative"
          >
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Moshiur" 
              className="w-56 h-56 rounded-[4rem] border-8 border-white/5 shadow-[0_0_80px_rgba(0,243,255,0.2)]"
              alt="Lead Architect"
            />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#00F3FF] rounded-2xl flex items-center justify-center text-[#0B0F19] shadow-xl border-4 border-[#0B0F19]">
              <Sword className="w-8 h-8" />
            </div>
          </motion.div>
          
          <div className="space-y-8 flex-1">
            <div className="space-y-2">
               <div className="text-xs font-black text-[#00F3FF] uppercase tracking-[0.5em]">Lead Neural Architect</div>
               <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-tight text-white">Md Moshiur <br /> Rahaman Riat</h2>
               <p className="text-[#8B5CF6] font-mono text-lg tracking-[0.2em] uppercase font-bold">Founder / M-Square Devs</p>
            </div>
            <p className="text-white/60 text-xl leading-relaxed italic font-medium">
              "Starting as a solo developer with a dream of building the ultimate typing arena, I founded MiraCore Logix to turn that vision into a global protocol. With a history of building complex real-time systems and high-fidelity UIs, Typogram is the culmination of our engineering journey at M-Square Devs."
            </p>
            <div className="flex flex-wrap gap-4">
               {[
                 { label: '50+ Neural Nodes', icon: <Globe className="w-4 h-4" /> },
                 { label: 'Elite Scribe Status', icon: <Terminal className="w-4 h-4" /> },
                 { label: 'Cloud Architect', icon: <Shield className="w-4 h-4" /> }
               ].map(stat => (
                 <div key={stat.label} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2 hover:bg-white/10 hover:text-white transition-all cursor-default">
                   {stat.icon} {stat.label}
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-16 space-y-12">
            <h3 className="text-2xl font-black italic uppercase tracking-[0.4em] text-[#00F3FF] text-center">Neural Timeline / Working History</h3>
            <div className="grid md:grid-cols-4 gap-8">
                {[
                    { year: '2022', title: 'Foundation Node', event: 'M-Square Devs founded. Initial protocol discovery and architectural sketches.' },
                    { year: '2023', title: 'MiraCore Engine', event: 'v1.0 release. High-frequency synchronization stable and ready for scale.' },
                    { year: '2024', title: 'Global Grid', event: 'Typogram Public Beta. Connecting neural frequencies globally for the first time.' },
                    { year: '2025', title: 'Neural Tiers', event: 'Scalable Arenas and Verifiable Certificates globally deployed via the Grid.' }
                ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="space-y-4 group"
                      whileHover={{ y: -5 }}
                    >
                        <div className="flex justify-between items-end">
                            <div className="text-xl font-mono text-[#00F3FF] font-bold group-hover:scale-110 transition-transform origin-left">{item.year}</div>
                            <div className="text-[10px] font-black uppercase text-white/20">{item.title}</div>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                transition={{ duration: 1.5, delay: i * 0.3 }}
                                className="h-full bg-gradient-to-r from-[#00F3FF] to-[#8B5CF6]"
                            />
                        </div>
                        <p className="text-xs text-white/40 font-bold uppercase tracking-wider group-hover:text-white/70 transition-colors leading-relaxed">
                            {item.event}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );

  const SupportPage = () => (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-20">
      <header className="text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-20 h-20 bg-[#FF4D6D]/10 text-[#FF4D6D] rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-[#FF4D6D]/20 shadow-[0_0_40px_rgba(255,77,109,0.1)]"
        >
          <HelpCircle className="w-10 h-10" />
        </motion.div>
        <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-tight text-white">Help <span className="text-[#FF4D6D] drop-shadow-[0_0_20px_rgba(255,77,109,0.5)]">Terminal</span></h1>
        <p className="text-white/40 text-xl uppercase tracking-[0.3em] font-bold">Neural link support & protocol troubleshooting.</p>
      </header>
      <div className="grid gap-8">
        {[
          { q: 'Neural Frequency Mismatch', a: 'Check your internet connection. MiraCore requires a stable 60Hz pulse. Fluctuations in packet stream can cause decoupling.', icon: Zap },
          { q: 'Sync Latency Issues', a: 'Proximity to our edge nodes matters. Try switching your neural gateway or refreshing your global DNS cache.', icon: Volume2 },
          { q: 'Profile Decoupling', a: 'Re-authenticate via the global Sync Profile button. If persistent, your neural handshake might be corrupted.', icon: LogOut },
          { q: 'Arena Credit Mining', a: 'Tokens are mined through consistency. 100% accuracy yields high rewards, while speed increases the mining frequency.', icon: Trophy }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-12 bg-[#0B0F19] border border-white/10 rounded-[3rem] space-y-6 hover:border-[#FF4D6D]/40 transition-all cursor-help group shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#FF4D6D]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-6 relative z-10">
               <div className="p-4 bg-[#FF4D6D]/10 text-[#FF4D6D] rounded-2xl group-hover:rotate-12 transition-transform shadow-lg border border-[#FF4D6D]/20">
                 <item.icon className="w-8 h-8" />
               </div>
               <h3 className="text-3xl font-black uppercase italic tracking-tight text-white group-hover:text-[#FF4D6D] transition-colors">{item.q}</h3>
            </div>
            <p className="text-white/40 text-lg leading-relaxed translate-x-20 font-medium">{item.a}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto space-y-20">
      <header className="text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-[#8B5CF6] text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border-4 border-[#0B0F19] shadow-[0_0_50px_rgba(139,92,246,0.3)] animate-bounce"
        >
          <MessageSquare className="w-12 h-12" />
        </motion.div>
        <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-tight text-white">Initialize <span className="text-[#8B5CF6] drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]">Link</span></h1>
        <p className="text-white/40 text-xl uppercase tracking-[0.3em] font-bold">Direct secure connection for elite nodes.</p>
      </header>
      
      <div className="relative p-1 bg-gradient-to-br from-[#8B5CF6] via-[#00F3FF] to-[#8B5CF6] rounded-[5rem] group overflow-hidden">
        <div className="absolute -inset-10 bg-[#8B5CF6]/30 blur-[120px] opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="bg-[#0B0F19] p-20 rounded-[4.8rem] relative z-10 flex flex-col items-center text-center space-y-16">
            <div className="space-y-6">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">Direct Transmission</h2>
              <p className="text-white/50 max-w-lg mx-auto text-lg leading-relaxed font-medium">Whether you're looking for enterprise neural licensing or want to report a protocol bug, we're listening on the global frequency.</p>
            </div>

            <div className="flex flex-col gap-8 w-full max-w-xl">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:riat.moshiur22@gmail.com" 
                className="w-full py-8 bg-[#8B5CF6] text-white font-black uppercase tracking-[0.4em] rounded-[3rem] shadow-[0_0_60px_rgba(139,92,246,0.4)] flex items-center justify-center gap-6 text-sm relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                <Terminal className="w-6 h-6 animate-pulse" /> Global Node: riat.moshiur22@gmail.com
              </motion.a>
              <div className="flex gap-6">
                 <button className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] text-xs font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 hover:border-[#00F3FF]/40 transition-all flex items-center justify-center gap-2">
                   <Globe className="w-4 h-4" /> Discord Hub
                 </button>
                 <button className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] text-xs font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 hover:border-[#00FF95]/40 transition-all flex items-center justify-center gap-2">
                   <Shield className="w-4 h-4" /> Security PGP
                 </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );

  const DetailsPage = () => (
    <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto space-y-20">
      <header className="text-center space-y-8">
        <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-tight text-white">Neural <span className="text-[#00FF95] drop-shadow-[0_0_20px_rgba(0,255,149,0.5)]">Protocol</span></h1>
        <p className="text-white/40 text-xl uppercase tracking-[0.3em] font-bold">Technical specifications & grid architecture.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Core Processing', value: 'MiraCore v2.4', desc: 'Low-latency WASM stream logic with custom Rust sub-routines.', color: 'text-[#00F3FF]', icon: Cpu },
          { title: 'Data Security', value: 'Neural AES-256', desc: 'Symmetric encryption for absolute profile integrity across nodes.', color: 'text-[#8B5CF6]', icon: Shield },
          { title: 'Validation Rate', value: '1.2k CPS', desc: 'Predictive anti-cheat validation with keystroke sound signature.', color: 'text-[#00FF95]', icon: Terminal },
          { title: 'Global Gateway', value: 'UDP Neural Stream', desc: 'Multipath protocol ensuring near-zero jitter in global arenas.', color: 'text-[#FF4D6D]', icon: Globe }
        ].map((spec, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="p-10 bg-white/[0.02] border border-white/10 rounded-[3rem] space-y-6 hover:bg-white/[0.05] transition-all group flex flex-col shadow-xl"
          >
            <div className="flex justify-between items-start">
               <div className={cn("p-3 rounded-xl bg-white/5 shadow-inner", spec.color)}>
                 <spec.icon className="w-6 h-6" />
               </div>
               <div className={cn("w-3 h-3 rounded-full animate-ping opacity-50 shadow-[0_0_10px_currentColor]", spec.color)} />
            </div>
            <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{spec.title}</span>
                <h3 className="text-2xl font-black italic uppercase tracking-tight text-white group-hover:text-[#00FF95] transition-colors">{spec.value}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-bold uppercase tracking-tight italic">{spec.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-12 bg-[#0B0F19] border border-white/5 rounded-[4rem] shadow-inner text-center">
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] mb-8">End to End Neural Encryption Active</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-20 hover:opacity-50 transition-opacity">
            {['TLS 1.3', 'HTTP/3', 'QUIC', 'MiraCore', 'M-Square'].map(tech => (
                <span key={tech} className="text-xs font-mono font-bold">{tech}</span>
            ))}
        </div>
      </div>
    </div>
  );

  const navItems = [
    { label: 'Practice', path: '/', icon: <LayoutGrid className="w-4 h-4" />, color: 'hover:text-[#00F3FF]' },
    { label: 'Arenas', path: '/contests', icon: <Trophy className="w-4 h-4" />, color: 'hover:text-[#00FF95]' },
    { label: 'Rankings', path: '/leaderboard', icon: <Sword className="w-4 h-4" />, color: 'hover:text-[#8B5CF6]' },
    { label: 'Campaign', path: '/game', icon: <Terminal className="w-4 h-4" />, color: 'hover:text-[#FF4D6D]' }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-[#00F3FF] selection:text-[#0B0F19] transition-colors duration-500">
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[100] w-full max-w-sm px-4"
          >
            <div className="bg-[#FF4D6D] border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center justify-between text-xs font-black uppercase tracking-widest">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="p-1 hover:bg-white/10 rounded">
                  <CloseIcon className="w-4 h-4" />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neural Navbar */}
      <nav className="fixed top-0 w-full z-[60] bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex flex-col items-start group">
            <TypogramLogo />
            <div className="hidden md:block text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mt-1.5 leading-tight group-hover:text-white/40 transition-colors">
              DEVELOPED BY MD MOSHIUR RAHAMAN RIAT <br />
              <span className="text-[#00F3FF]/40 group-hover:text-[#00F3FF]">MIRACORE LOGIX / M-SQUARE DEVS</span>
            </div>
          </Link>
          
          <div className="flex items-center bg-white/5 rounded-2xl p-1.5 border border-white/5 shadow-2xl transition-all hover:bg-white/10 group/nav">
            <div className="hidden lg:flex items-center gap-1">
                {navItems.map(item => (
                    <Link 
                        key={item.path}
                        to={item.path} 
                        className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            item.color,
                            location.pathname === item.path ? "bg-white/10 text-white shadow-inner" : "text-white/40"
                        )}
                    >
                        {item.icon} {item.label}
                    </Link>
                ))}
            </div>

            <div className="w-px h-6 bg-white/10 mx-2 hidden lg:block" />

            <div className="flex items-center gap-2">
              <button 
                 onClick={() => setShowSettings(!showSettings)}
                 className="p-2.5 text-white/40 hover:text-white transition-all hover:bg-white/5 rounded-xl group/settings relative"
                 title="Neural Configuration"
              >
                  <Settings className="w-5 h-5 group-hover/settings:rotate-90 transition-transform" />
                  {showSettings && (
                      <div className="absolute top-full right-0 mt-4 w-64 bg-[#0B0F19] border border-white/10 rounded-2xl p-4 shadow-2xl z-[100]">
                          <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Neural Volume</span>
                                  <span className="text-[10px] font-mono text-[#00F3FF]">{Math.round(volume * 100)}%</span>
                              </div>
                              <div className="flex items-center gap-3">
                                  <Volume2 className="w-4 h-4 text-white/20" />
                                  <input 
                                      type="range"
                                      min="0"
                                      max="1"
                                      step="0.01"
                                      value={volume}
                                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                                      className="flex-1 accent-[#00F3FF] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                                  />
                              </div>
                          </div>
                      </div>
                  )}
              </button>

              <button 
                className="lg:hidden p-2.5 text-white/40"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>

              {isAdmin && (
                  <Link to="/host" title="Host Contest" className="p-2.5 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-xl hover:bg-[#8B5CF6] hover:text-white transition-all">
                      <Plus className="w-5 h-5" />
                  </Link>
              )}
              
              <button 
                onClick={() => setShowHelp(!showHelp)}
                title="Neural Assistant"
                className={cn(
                  "p-2.5 rounded-xl transition-all relative",
                  showHelp ? "bg-[#00F3FF] text-[#0B0F19]" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                  <MessageSquare className="w-5 h-5" />
                  {!showHelp && <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF4D6D] rounded-full animate-ping" />}
              </button>

              {user ? (
                  <div className="flex items-center gap-2">
                      <Link to="/dashboard" className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl bg-white/5 border border-white/5 group hover:border-[#00F3FF]/30 transition-all">
                          <div className="text-right hidden sm:block">
                              <div className="text-[9px] font-black uppercase leading-none text-white/40">Terminal</div>
                              <div className="text-[10px] font-bold text-[#00F3FF]">{profile?.displayName?.split(' ')[0]}</div>
                          </div>
                          <img 
                            src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                            className="w-8 h-8 rounded-lg border border-white/10 group-hover:scale-105 transition-transform"
                            alt="Profile" 
                          />
                      </Link>
                      <button 
                          onClick={async () => { 
                              if(window.confirm('Neural Link Breakup: Confirm session termination?')) {
                                  try {
                                      await logout();
                                  } catch (e) {
                                      console.error('Termination failed:', e);
                                      setError('Critical: Neural decouple failed.');
                                  }
                              } 
                          }}
                          className="p-2.5 text-[#FF4D6D]/40 hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/10 rounded-xl transition-all relative group/logout shadow-[0_0_30px_rgba(255,77,109,0)] hover:shadow-[0_0_30px_rgba(255,77,109,0.3)] z-[100] border border-transparent hover:border-[#FF4D6D]/20 active:scale-90"
                          title="Terminate Neural Link"
                      >
                          <LogOut className="w-5 h-5 group-hover/logout:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-[#FF4D6D] blur-2xl opacity-0 group-hover/logout:opacity-5 transition-opacity" />
                      </button>
                  </div>
              ) : (
                  <button 
                      onClick={login}
                      disabled={isSigningIn}
                      className="px-6 py-2.5 bg-[#00F3FF] text-[#0B0F19] text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                  >
                      {isSigningIn ? "Syncing..." : "Sync Profile"}
                  </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-4 right-4 z-50 bg-[#0B0F19]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 lg:hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map(item => (
                <Link 
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"
                >
                  <div className="text-[#00F3FF]">{item.icon}</div>
                  <div className="text-[10px] font-black uppercase">{item.label}</div>
                </Link>
              ))}
            </div>
            {user && (
              <button 
                onClick={() => { if(window.confirm('Terminate neural session?')) { logout(); setIsMobileMenuOpen(false); } }}
                className="w-full mt-4 py-4 bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/20 text-[10px] font-black uppercase rounded-2xl flex items-center justify-center gap-2 hover:bg-[#FF4D6D] hover:text-white transition-all shadow-[0_0_20px_rgba(255,77,109,0.1)]"
              >
                <LogOut className="w-4 h-4" /> Terminate Session
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Help Center Portal */}
      <AnimatePresence>
        {showHelp && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-end p-4">
                <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="w-full max-w-md h-[80vh] bg-[#0B0F19] border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col"
                >
                    <div className="p-6 flex justify-between items-center border-b border-white/5 bg-[#0B0F19]/50 backdrop-blur-xl shrink-0">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#00F3FF]">Neural Assistant</h3>
                        <button onClick={() => setShowHelp(false)} className="p-2 text-white/20 hover:text-white transition-all">
                          <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 min-h-0">
                        <AIHelpCenter />
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contest/:id" element={<ContestPage />} />
          <Route path="/contests" element={<ContestsManager />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/host" element={<HostContest />} />
          <Route path="/game" element={<GameArena />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/details" element={<DetailsPage />} />
        </Routes>
      </main>

      <footer className="py-20 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-4">
            <TypogramLogo />
            <p className="text-sm text-white/30 max-w-sm uppercase font-bold tracking-widest leading-relaxed">
              DEVELOPED BY MD MOSHIUR RAHAMAN RIAT <br />
              <span className="text-[#00F3FF]">MIRACORE LOGIX</span> / OWNED BY <span className="text-[#8B5CF6]">M-SQUARE DEVS</span>
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-6 text-[10px] font-black uppercase tracking-widest text-[#00F3FF]">
            <Link to="/details" className="hover:text-white transition-all flex items-center gap-2">
              <span className="w-1 h-1 bg-[#00F3FF] rounded-full hidden sm:block" />
              Details
            </Link>
            <Link to="/about" className="hover:text-white transition-all flex items-center gap-2">
              <span className="w-1 h-1 bg-[#00F3FF] rounded-full hidden sm:block" />
              About Us
            </Link>
            <Link to="/support" className="hover:text-white transition-all flex items-center gap-2">
              <span className="w-1 h-1 bg-[#00F3FF] rounded-full hidden sm:block" />
              Support
            </Link>
            <Link to="/contact" className="hover:text-white transition-all flex items-center gap-2">
              <span className="w-1 h-1 bg-[#00F3FF] rounded-full hidden sm:block" />
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>

  );
}
