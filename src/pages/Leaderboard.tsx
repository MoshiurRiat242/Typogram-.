import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Trophy, Zap, Award, Target, Search, Crown, Medal } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string;
  stats: {
    highestWpm: number;
    level: number;
    totalXP: number;
  };
}

export const Leaderboard: React.FC = () => {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'stats.highestWpm' | 'stats.totalXP' | 'stats.level'>('stats.highestWpm');

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'users'),
      orderBy(sortBy, 'desc'),
      limit(50)
    );
    
    // Using onSnapshot for real-time Hall of Fame updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as LeaderboardEntry);
      setEntries(data);
      setLoading(false);
    }, (error) => {
      console.error("Leaderboard shift error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sortBy]);

  const filteredEntries = entries.filter(e => 
    e.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-5xl mx-auto space-y-10 cyber-grid">
      <header className="space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F3FF]/10 border border-[#00F3FF]/30 text-[#00F3FF] text-[10px] font-black uppercase tracking-widest">
          Neural Grid / Global Rankings
        </div>
        <h1 className="text-6xl font-black tracking-tighter uppercase italic">
          HALL OF <span className="text-[#8B5CF6]">ELITES</span>
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mt-8">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                    type="text"
                    placeholder="Search designations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#00F3FF] transition-all outline-none"
                />
            </div>
            <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
                {(['stats.highestWpm', 'stats.totalXP', 'stats.level'] as const).map(sort => (
                    <button
                        key={sort}
                        onClick={() => setSortBy(sort)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            sortBy === sort ? "bg-white/10 text-white" : "text-white/20 hover:text-white/40"
                        )}
                    >
                        {sort.split('.')[1].replace('highestWpm', 'WPM').replace('totalXP', 'XP').replace('level', 'LVL')}
                    </button>
                ))}
            </div>
        </div>
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry, i) => (
              <motion.div 
                key={entry.uid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-[#00F3FF]/30 transition-all",
                  entry.uid === user?.uid && "border-[#00F3FF]/50 bg-[#00F3FF]/5 shadow-[0_0_20px_rgba(0,243,255,0.1)]",
                  i === 0 && "bg-[#FFD700]/5 border-[#FFD700]/20",
                  i === 1 && "bg-[#C0C0C0]/5 border-[#C0C0C0]/20",
                  i === 2 && "bg-[#CD7F32]/5 border-[#CD7F32]/20"
                )}
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black",
                    entry.uid === user?.uid ? "bg-[#00F3FF] text-black" :
                    i === 0 ? "bg-[#FFD700] text-black" : 
                    i === 1 ? "bg-[#C0C0C0] text-black" : 
                    i === 2 ? "bg-[#CD7F32] text-black" : "text-white/20"
                  )}>
                    {i + 1}
                  </div>
                  <div className="flex items-center gap-4">
                    <img 
                      src={entry.photoURL} 
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform" 
                      alt="" 
                    />
                    <div>
                      <div className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                        {entry.displayName}
                        {i === 0 && <Crown className="w-3 h-3 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />}
                        {(i === 1 || i === 2) && <Medal className="w-3 h-3 text-white/60" />}
                        {entry.uid === user?.uid && <span className="text-[8px] px-1.5 py-0.5 bg-[#00F3FF] text-[#0B0F19] rounded font-black italic">YOU</span>}
                      </div>
                      <div className="text-[10px] text-[#00F3FF] font-mono">LVL {entry.stats.level} / {entry.stats.totalXP} XP</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-xs text-white/30 uppercase font-bold tracking-widest mb-1">Peak Speed</div>
                    <div className="text-2xl font-black italic">{entry.stats.highestWpm} <span className="text-xs font-normal opacity-40">WPM</span></div>
                  </div>
                  <Award className={cn("w-6 h-6", 
                    i === 0 ? "text-[#FFD700]" : 
                    i === 1 ? "text-[#C0C0C0]" : 
                    i === 2 ? "text-[#CD7F32]" : "text-white/5"
                  )} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
