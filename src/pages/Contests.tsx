import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useContestStore } from '../store/useContestStore';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { Search, MapPin, Timer, Users, Trophy, ChevronRight, Trash2, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export const ContestsManager: React.FC = () => {
    const { contests, fetchContests, loading, deleteContest } = useContestStore();
    const { isAdmin } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'active' | 'finished'>('all');
    const [publicFilter, setPublicFilter] = useState<'all' | 'public' | 'private'>('all');

    useEffect(() => {
        fetchContests(undefined, isAdmin);
    }, [isAdmin]);

    const filtered = contests.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              c.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        const matchesPublic = publicFilter === 'all' || (publicFilter === 'public' ? c.isPublic : !c.isPublic);
        return matchesSearch && matchesStatus && matchesPublic;
    });

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 max-w-6xl mx-auto space-y-12 cyber-grid">
            <header className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] text-[10px] font-black uppercase tracking-widest">
                            Neural Hub / Arena Directory
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                            ACTIVE <span className="text-[#00F3FF]">INSTANCES</span>
                        </h1>
                    </div>

                    <div className="w-full md:w-96 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                            type="text"
                            placeholder="Search by arena signature..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#00F3FF] transition-all outline-none md:mb-0"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-white/20 ml-2">Status:</span>
                        <div className="flex gap-1">
                            {['all', 'scheduled', 'active', 'finished'].map(s => (
                                <button 
                                    key={s}
                                    onClick={() => setStatusFilter(s as any)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                        statusFilter === s ? "bg-[#00F3FF] text-[#0B0F19]" : "bg-white/5 text-white/40 hover:bg-white/10"
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white/10 mx-2" />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-white/20">Access:</span>
                        <div className="flex gap-1">
                            {['all', 'public', 'private'].map(p => (
                                <button 
                                    key={p}
                                    onClick={() => setPublicFilter(p as any)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                        publicFilter === p ? "bg-[#8B5CF6] text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-48 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((contest, i) => (
                        <motion.div
                            key={contest.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative overflow-hidden p-8 bg-[#0B0F19] border border-white/10 rounded-[2.5rem] hover:border-[#00F3FF]/30 transition-all flex flex-col justify-between min-h-[220px]"
                        >
                            {/* Glow Effect */}
                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#00F3FF]/10 blur-[80px] rounded-full group-hover:bg-[#00F3FF]/20 transition-all" />
                            
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-[#00F3FF] transition-colors">{contest.title}</h3>
                                        <p className="text-xs text-white/40 line-clamp-2 leading-relaxed uppercase tracking-wide">
                                            {contest.description}
                                        </p>
                                    </div>
                                    <div className={cn(
                                        "px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest",
                                        contest.status === 'active' ? "bg-[#00FF95] text-black" : "bg-white/10 text-white/40"
                                    )}>
                                        {contest.status}
                                    </div>
                                    {contest.difficulty && (
                                        <div className={cn(
                                            "px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ml-2",
                                            contest.difficulty === 'easy' ? "bg-[#00FF95]/20 text-[#00FF95] border border-[#00FF95]/30" : 
                                            contest.difficulty === 'medium' ? "bg-[#00F3FF]/20 text-[#00F3FF] border border-[#00F3FF]/30" : 
                                            "bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/30"
                                        )}>
                                            {contest.difficulty}
                                        </div>
                                    )}
                                </div>
                                {isAdmin && (
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (window.confirm('Delete this arena instance?')) {
                                              deleteContest(contest.id);
                                            }
                                        }}
                                        className="absolute top-8 right-16 p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                                        title="Terminate Instance"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}

                                <div className="flex gap-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase">
                                        <Timer className="w-3 h-3 text-[#FF4D6D]" /> {contest.duration}s
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase">
                                        <Users className="w-3 h-3 text-[#8B5CF6]" /> {contest.isPublic ? 'Public' : 'Private'}
                                    </div>
                                    {contest.createdAt && (
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase ml-auto">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(contest.createdAt?.seconds * 1000).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Link 
                                to={`/contest/${contest.id}`}
                                className="relative z-10 mt-6 w-full py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:bg-[#00F3FF] group-hover:text-[#0B0F19] transition-all"
                            >
                                Synchronize <ChevronRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            {filtered.length === 0 && !loading && (
                <div className="text-center py-20 space-y-4">
                    <div className="text-6xl opacity-20">?</div>
                    <p className="text-white/40 text-sm uppercase tracking-widest">No matching arenas found in the network.</p>
                </div>
            )}
        </div>
    );
};
