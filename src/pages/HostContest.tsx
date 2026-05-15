import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { useContestStore } from '../store/useContestStore';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Globe, Lock, Share2, Rocket, AlignLeft, Calendar, Clock, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const HostContest: React.FC = () => {
    const { user, profile, isAdmin } = useAuthStore();
    const { createContest, contests, fetchContests, deleteContest } = useContestStore();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 30,
        isPublic: true,
        customText: '',
        startAt: new Date().toISOString().slice(0, 16),
        endAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
        inviteCode: '',
        minWpm: 0,
        maxParticipants: 0,
        difficulty: 'medium' as 'easy' | 'medium' | 'hard'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (user) {
            fetchContests({ createdBy: user.uid });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !isAdmin) return;
        setIsSubmitting(true);
        
        try {
            const finalInviteCode = !formData.isPublic ? (formData.inviteCode || Math.random().toString(36).substring(2, 8).toUpperCase()) : '';
            const contestId = await createContest({
                title: formData.title,
                description: formData.description,
                duration: Number(formData.duration),
                isPublic: formData.isPublic,
                text: formData.customText || "The default neural test sequence initialization. Speed is the variable, focus is the constant.",
                createdBy: user.uid,
                createdByDisplayName: profile?.displayName || user.displayName || 'Architect',
                startAt: formData.startAt,
                endAt: formData.endAt,
                inviteCode: finalInviteCode,
                minWpm: formData.minWpm,
                maxParticipants: formData.maxParticipants,
                difficulty: formData.difficulty
            });
            navigate(`/contest/${contestId}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Shield className="w-16 h-16 text-[#FF4D6D] mx-auto opacity-20" />
                    <h2 className="text-2xl font-black uppercase text-white/40">Unauthorized Access</h2>
                    <p className="text-white/20 text-xs">Only authorized neural architects can initialize arenas.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <header className="space-y-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] text-[10px] font-black uppercase tracking-widest">
                        Neural Hub / Contest Hosting
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                        CREATE <span className="text-[#00F3FF]">INSTANCED</span> ARENA
                    </h1>
                    <p className="text-white/40 text-sm max-w-lg mx-auto">
                        Initialize a custom dedicated typing instance. Invite peers, set parameters, and monitor real-time metrics.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-8 p-8 bg-white/5 border border-white/10 rounded-3xl">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Contest Designation</label>
                            <input 
                                required
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                placeholder="e.g. NEON SPEEDWAY #1"
                                className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#00F3FF] transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Protocol Description</label>
                            <textarea 
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="Neural sync protocol details..."
                                className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#8B5CF6] transition-all outline-none h-32 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Start At</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input 
                                        type="datetime-local"
                                        value={formData.startAt}
                                        onChange={e => setFormData({...formData, startAt: e.target.value})}
                                        className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[#00F3FF] transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">End At</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input 
                                        type="datetime-local"
                                        value={formData.endAt}
                                        onChange={e => setFormData({...formData, endAt: e.target.value})}
                                        className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[#00F3FF] transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Duration (Sec)</label>
                                <input 
                                    type="number"
                                    value={formData.duration}
                                    onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#00FF95] transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Access Type</label>
                                <div className="flex bg-[#0B0F19] border border-white/10 rounded-xl p-1">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, isPublic: true})}
                                        className={cn("flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all", formData.isPublic ? "bg-[#00F3FF] text-[#0B0F19]" : "text-white/40")}
                                    >
                                        Public
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, isPublic: false})}
                                        className={cn("flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all", !formData.isPublic ? "bg-[#8B5CF6] text-white" : "text-white/40")}
                                    >
                                        Private
                                    </button>
                                </div>
                            </div>
                        </div>

                        {!formData.isPublic && (
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block flex items-center justify-between">
                                    Invite Code
                                    <span className="text-[8px] opacity-40">Leave empty for auto-gen</span>
                                </label>
                                <input 
                                    value={formData.inviteCode}
                                    onChange={e => setFormData({...formData, inviteCode: e.target.value.toUpperCase()})}
                                    placeholder="e.g. ALPHA_SKY"
                                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#00F3FF] transition-all outline-none"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Min WPM</label>
                                <input 
                                    type="number"
                                    value={formData.minWpm}
                                    onChange={e => setFormData({...formData, minWpm: Number(e.target.value)})}
                                    placeholder="0"
                                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#00F3FF] transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Max Pilots</label>
                                <input 
                                    type="number"
                                    value={formData.maxParticipants}
                                    onChange={e => setFormData({...formData, maxParticipants: Number(e.target.value)})}
                                    placeholder="0 (Unlimit)"
                                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#00F3FF] transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Difficulty Tuning</label>
                            <div className="flex bg-[#0B0F19] border border-white/10 rounded-xl p-1">
                                {(['easy', 'medium', 'hard'] as const).map((level) => (
                                    <button 
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData({...formData, difficulty: level})}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all", 
                                            formData.difficulty === level 
                                                ? level === 'easy' ? "bg-[#00FF95] text-[#0B0F19]" : level === 'medium' ? "bg-[#00F3FF] text-[#0B0F19]" : "bg-[#FF4D6D] text-white"
                                                : "text-white/40"
                                        )}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                            <div className="flex items-center gap-3">
                                <AlignLeft className="w-5 h-5 text-[#00F3FF]" />
                                <h3 className="font-bold text-sm tracking-tight">CUSTOM NEURAL STREAM</h3>
                            </div>
                            <textarea 
                                value={formData.customText}
                                onChange={e => setFormData({...formData, customText: e.target.value})}
                                placeholder="Inject custom words or paragraphs here. Leave empty for random sequence."
                                className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono h-48 focus:border-[#00F3FF] transition-all outline-none resize-none"
                            />
                            <p className="text-[10px] text-white/20 uppercase font-mono italic">
                                * Private contests generate higher XP for participants.
                            </p>
                        </div>

                        <button 
                            disabled={isSubmitting}
                            className="w-full py-6 bg-gradient-to-r from-[#00F3FF] to-[#8B5CF6] text-[#0B0F19] font-black text-xl rounded-2xl shadow-[0_0_40px_rgba(0,243,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Zap className="w-6 h-6 animate-spin" />
                            ) : (
                                <Rocket className="w-6 h-6" />
                            )}
                            {isSubmitting ? "UPLOADING PROTOCOL..." : "INITIALIZE ARENA"}
                        </button>

                        {contests.length > 0 && (
                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Nodes (Your Hostings)</h3>
                                <div className="space-y-3">
                                    {contests.filter(c => c.createdBy === user?.uid).map(c => (
                                        <div key={c.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group/node">
                                            <div className="truncate pr-4">
                                                <div className="text-xs font-bold text-white group-hover/node:text-[#00F3FF] transition-colors">{c.title}</div>
                                                <div className="text-[8px] text-white/20 uppercase font-mono">{c.status} / {c.isPublic ? 'Public' : 'Private'}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    type="button"
                                                    onClick={() => navigate(`/contest/${c.id}`)}
                                                    className="p-2 bg-white/5 rounded-lg hover:bg-[#00F3FF] hover:text-black transition-all"
                                                >
                                                    <Share2 className="w-3 h-3" />
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => deleteContest(c.id)}
                                                    className="p-2 bg-white/5 rounded-lg hover:bg-[#FF4D6D] transition-all"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
