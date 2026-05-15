import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Timer, Trophy, Zap, Clock, Lock, Share2, Crown, Medal } from 'lucide-react';
import { TypingEngine } from '../components/TypingEngine';
import { socket, connectSocket, disconnectSocket } from '../lib/socket';
import { useAuthStore } from '../store/useAuthStore';
import { useContestStore } from '../store/useContestStore';
import { sounds } from '../lib/sounds';
import { cn } from '../lib/utils';

interface Participant {
  id: string;
  uid: string;
  displayName: string;
  photoURL: string;
  wpm: number;
  accuracy: number;
  progress: number;
}

export const ContestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { fetchContestById } = useContestStore();
  const [contest, setContest] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [status, setStatus] = useState<'scheduled' | 'active' | 'finished'>('scheduled');
  const [countdown, setCountdown] = useState(5);
  const [showSummary, setShowSummary] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const initContest = async () => {
      if (id) {
        const data = await fetchContestById(id);
        setContest(data);
        if (data) {
           setStatus(data.status);
           if (data.status === 'finished') {
             setAuthError('PROTOCOL TERMINATED: This arena instance is no longer active.');
           } else if (data.isPublic || useAuthStore.getState().isAdmin) {
             setIsAuthorized(true);
           }
        } else {
           setAuthError('ENCRYPTION ERROR: Instance not found in the neural grid.');
        }
      }
    };
    initContest();
  }, [id, fetchContestById]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (contest) {
      if (inviteInput === contest.inviteCode) {
        setIsAuthorized(true);
        setAuthError(null);
      } else {
        setAuthError('INVALID NEURAL KEY: Frequency mismatch.');
      }
    }
  };

  const copyInviteCode = () => {
    if (contest?.inviteCode) {
      navigator.clipboard.writeText(contest.inviteCode);
      // Optional: Show a toast or feedback
    }
  };

  useEffect(() => {
    connectSocket();
    
    if (id && user) {
      if (!user.emailVerified) {
        useAuthStore.getState().setError('Biological signature unverified. Verify email to join arena.');
        return;
      }

      const currentContest = contest;
      if (currentContest) {
        if (currentContest.minWpm && (profile?.stats.highestWpm || 0) < currentContest.minWpm) {
          useAuthStore.getState().setError(`NEURAL REJECTION: Minimum ${currentContest.minWpm} WPM required for synchronization.`);
          return;
        }
        if (currentContest.maxParticipants && participants.length >= currentContest.maxParticipants) {
          useAuthStore.getState().setError('ARENA CAPACITY REACHED: No more pilots can sync to this instance.');
          return;
        }
      }

      socket.emit('join-contest', { 
        contestId: id, 
        user: { 
          uid: user.uid, 
          displayName: profile?.displayName || 'Guest',
          photoURL: profile?.photoURL 
        } 
      });
    }

    socket.on('contest-leaderboard', (data: Participant[]) => {
      setParticipants(data.sort((a, b) => b.wpm - a.wpm));
    });

    socket.on('contest-status', (newStatus: any) => {
        setStatus(newStatus);
        if (newStatus === 'finished') {
           setShowSummary(true);
           sounds.playFinish();
           // Update global stats with contest performance
           const myFinalStats = participants.find(p => p.id === socket.id || p.uid === user?.uid);
           if (myFinalStats && user) {
             useAuthStore.getState().updateStats(myFinalStats.wpm, myFinalStats.accuracy);
           }
        }
    });

    socket.on('contest-starting', () => {
        sounds.playNotification();
    });

    return () => {
      disconnectSocket();
    };
  }, [id, user, profile, isAuthorized]);

  useEffect(() => {
    if (status === 'scheduled' && countdown > 0) {
      const timer = setInterval(() => {
          setCountdown(c => {
              if (c > 1) sounds.playCorrect();
              return c - 1;
          });
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && status === 'scheduled') {
      setStatus('active');
      sounds.playComplete();
    }
  }, [status, countdown]);

  const handleTypingUpdate = (stats: { wpm: number; accuracy: number; progress: number }) => {
    if (id && status === 'active') {
      socket.emit('typing-update', { contestId: id, stats });
    }
  };

  if (!contest) return (
    <div className="min-h-screen flex items-center justify-center">
        <Zap className="w-12 h-12 text-[#00F3FF] animate-spin" />
    </div>
  );

  if (!isAuthorized) {
    return (
        <div className="min-h-screen pt-40 px-4 max-w-md mx-auto text-center space-y-8">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mx-auto">
                <Lock className="w-10 h-10 text-[#8B5CF6]" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black italic uppercase italic tracking-tighter">ENCRYPTED ARENA</h2>
                <p className="text-white/40 text-xs uppercase tracking-widest">{authError || 'This instance requires a valid Neural Invite Key to synchronize.'}</p>
            </div>
            {contest && contest.status !== 'finished' && (
                <form onSubmit={handleJoin} className="space-y-4">
                    <input 
                        type="text"
                        value={inviteInput}
                        onChange={e => setInviteInput(e.target.value.toUpperCase())}
                        placeholder="ENTER NEURAL KEY"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-center text-sm font-black tracking-[0.3em] outline-none focus:border-[#00F3FF] transition-all"
                    />
                    <button className="w-full py-4 bg-gradient-to-r from-[#00F3FF] to-[#8B5CF6] text-[#0B0F19] font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">
                        SYNC PULSE
                    </button>
                </form>
            )}
            {contest?.status === 'finished' && (
                <button 
                  onClick={() => navigate('/contests')}
                  className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase text-xs tracking-widest"
                >
                  Return to Hub
                </button>
            )}
        </div>
    );
  }

  const myStats = participants.find(p => p.id === socket.id || p.uid === user?.uid);
  const myRank = participants.findIndex(p => p.id === socket.id || p.uid === user?.uid) + 1;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto space-y-12 cyber-grid relative">
      <AnimatePresence>
        {showSummary && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#0B0F19]/95 backdrop-blur-2xl flex items-center justify-center p-4"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="max-w-2xl w-full bg-[#0B0F19] border border-white/10 rounded-[3rem] p-12 relative overflow-hidden shadow-[0_0_100px_rgba(0,243,255,0.1)]"
                >
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#00F3FF]/10 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#8B5CF6]/10 blur-[100px] rounded-full" />

                    <div className="relative z-10 text-center space-y-12">
                        <div className="space-y-4">
                            <Trophy className={cn("w-20 h-20 mx-auto", myRank === 1 ? "text-[#FFD700] animate-bounce" : "text-white/20")} />
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter">DATA EXTRACTION COMPLETE</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Final Rank', value: `#${myRank}`, color: 'text-[#00F3FF]' },
                                { label: 'Peak WPM', value: myStats?.wpm || 0, color: 'text-[#8B5CF6]' },
                                { label: 'Accuracy', value: `${myStats?.accuracy || 0}%`, color: 'text-[#00FF95]' },
                                { label: 'XP Gained', value: `+${myRank === 1 ? 500 : 200}`, color: 'text-[#FF4D6D]' }
                            ].map((s, i) => (
                                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-[8px] font-black uppercase text-white/40 tracking-[0.2em] mb-1">{s.label}</div>
                                    <div className={cn("text-2xl font-black italic", s.color)}>{s.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => navigate('/contests')}
                                className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Leave Arena
                            </button>
                            <button 
                                onClick={() => window.location.reload()}
                                className="flex-1 py-4 bg-[#00F3FF] text-[#0B0F19] font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all"
                            >
                                Resync Instance
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Main Console */}
        <div className="flex-1 space-y-8 w-full">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className={cn(
                    "px-3 py-1.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2",
                    status === 'active' ? "bg-[#00FF95] text-black shadow-[0_0_20px_rgba(0,255,149,0.3)] animate-pulse" : 
                    status === 'finished' ? "bg-white/10 text-white/40 border border-white/10" : "bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm", status === 'active' ? "bg-black animate-ping" : status === 'finished' ? "bg-white/20" : "bg-white")} />
                    {status}
                </div>
                <div className="text-white/20 text-[10px] font-mono uppercase tracking-[0.4em] hidden sm:block">Arena Instance {id?.slice(0, 8)}</div>
                {contest.createdAt && (
                  <div className="text-white/20 text-[10px] font-mono uppercase tracking-[0.2em] ml-auto">
                    Created: {new Date(contest.createdAt.seconds * 1000).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-5xl font-black tracking-tighter uppercase italic">{contest.title}</h1>
                  <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1 flex items-center gap-2">
                    Architected by <span className="text-[#00F3FF]">MiraCore Logix</span>
                    {contest.difficulty && (
                      <span className={cn(
                        "ml-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                        contest.difficulty === 'easy' ? "text-[#00FF95] border border-[#00FF95]/30 bg-[#00FF95]/5" :
                        contest.difficulty === 'medium' ? "text-[#00F3FF] border border-[#00F3FF]/30 bg-[#00F3FF]/5" :
                        "text-[#FF4D6D] border border-[#FF4D6D]/30 bg-[#FF4D6D]/5"
                      )}>
                        {contest.difficulty}
                      </span>
                    )}
                  </div>
                </div>
                {!contest.isPublic && contest.inviteCode && (
                  <button 
                    onClick={copyInviteCode}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="text-[9px] font-black uppercase text-white/40 tracking-widest">Key: {contest.inviteCode}</div>
                    <Share2 className="w-3 h-3 text-[#00F3FF] group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 text-white/50 text-xs font-mono">
                <span className="w-2 h-2 bg-[#00FF95] rounded-full animate-pulse shadow-[0_0_10px_#00FF95]" />
                {participants.length} PILOTS SYNCED
              </div>
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 text-white/50 text-xs font-mono">
                <Timer className="w-4 h-4" />
                {contest.duration}s PROTOCOL
              </div>
            </div>
          </div>

          <div className="relative">
            <TypingEngine 
              onUpdate={handleTypingUpdate}
              text={contest.text}
              duration={contest.duration}
              mode="timer"
            />
            {status === 'scheduled' && (
                <div className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-xl z-30 flex flex-col items-center justify-center space-y-6">
                    <div className="text-[#00F3FF] text-[10px] font-black uppercase tracking-[0.5em] mb-4">Neural Synchronization in Progress</div>
                    <div className="text-9xl font-black text-white italic tracking-tighter counter-glow">
                        {countdown}
                    </div>
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={cn("w-12 h-1 bg-white/10 rounded-full", i < (5-countdown) && "bg-[#00F3FF]")} />
                        ))}
                    </div>
                </div>
            )}
             {status === 'finished' && (
                <div className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-xl z-30 flex flex-col items-center justify-center space-y-6">
                    <Trophy className="w-20 h-20 text-[#FFD700] mb-4" />
                    <h2 className="text-5xl font-black italic uppercase tracking-tighter">PROTOCOL TERMINATED</h2>
                    <p className="text-white/40 uppercase tracking-widest text-xs">Examine the terminal for ranking results.</p>
                    <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#00F3FF] text-[#0B0F19] font-black rounded-xl">RESYNC</button>
                </div>
            )}
          </div>
        </div>

        {/* Real-time Sideboard */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6 relative overflow-hidden backdrop-blur-md">
             <div className="absolute -top-10 -right-10 opacity-5">
                <Trophy className="w-40 h-40 text-[#00F3FF]" />
             </div>
             
             <div className="flex justify-between items-center bg-white/5 -mx-8 -mt-8 p-6 border-b border-white/10">
                <h3 className="text-[10px] font-black italic flex items-center gap-2 text-white tracking-[0.2em] uppercase">
                    <Zap className="w-4 h-4 text-[#00F3FF]" /> LIVE RANKINGS
                </h3>
                <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                    SYNCING...
                </div>
             </div>

             <div className="space-y-3">
                <AnimatePresence>
                  {participants.map((p, i) => (
                    <motion.div 
                      key={p.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "p-4 rounded-2xl border transition-all flex items-center justify-between relative overflow-hidden",
                        p.id === socket.id || p.uid === user?.uid
                          ? "bg-[#00F3FF]/15 border-[#00F3FF]/50 shadow-[0_0_30px_rgba(0,243,255,0.15)] ring-1 ring-[#00F3FF]/30" 
                          : "bg-white/5 border-white/5"
                      )}
                    >
                      { (p.id === socket.id || p.uid === user?.uid) && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#00F3FF] shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                      )}
                      <div className="flex items-center gap-4">
                        <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black ring-1 ring-white/10", 
                          i === 0 ? "bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]" : 
                          i === 1 ? "bg-[#C0C0C0] text-black" : 
                          i === 2 ? "bg-[#CD7F32] text-black" : "bg-white/5 text-white/40"
                        )}>
                          #{i + 1}
                        </div>
                        <div className="space-y-1">
                          <div className={cn(
                             "text-[10px] font-black uppercase tracking-wider truncate w-32 flex items-center gap-2",
                             (p.id === socket.id || p.uid === user?.uid) ? "text-[#00F3FF]" : "text-white"
                          )}>
                            {p.displayName || `ID_${p.id.slice(0,4)}`}
                            {i === 0 && <Crown className="w-3 h-3 text-[#FFD700]" />}
                            {(i === 1 || i === 2) && <Medal className="w-3 h-3 text-white/40" />}
                            {(p.id === socket.id || p.uid === user?.uid) && <span className="text-[10px] text-[#00F3FF] font-black italic">★</span>}
                          </div>
                          <div className="w-28 h-1 bg-white/10 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${p.progress}%` }}
                               className="h-full bg-gradient-to-r from-[#00F3FF] to-[#8B5CF6]"
                             />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black italic tracking-tighter">{p.wpm}</div>
                        <div className="text-[8px] text-white/30 font-bold uppercase tracking-widest">WPM</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {participants.length === 0 && (
                    <div className="text-center py-10 opacity-20 italic text-xs uppercase tracking-widest">
                        Awaiting network pulses...
                    </div>
                )}
             </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-[#8B5CF6]/20 to-[#00F3FF]/5 border border-[#8B5CF6]/30 rounded-[2.5rem] relative overflow-hidden group">
             <div className="relative z-10 space-y-4">
                <div className="text-[#8B5CF6] text-[10px] font-black tracking-[0.2em] uppercase">NEURAL REWARDS</div>
                <div className="text-3xl font-black italic tracking-tighter">+500 DATA UNITS</div>
                <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">
                  Secure top position to earn the "Neon Glitch" badge and boost your global ranking position.
                </p>
                <div className="pt-4 flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" title="XP Booster" />
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" title="Rank Badge" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

