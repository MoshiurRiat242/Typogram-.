import React from 'react';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { Trophy, Zap, Coins, TrendingUp, Award, Calendar, ChevronRight, FileText, Sword, Rocket, Target, Edit3, Save, X, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, updateDoc, query, collection, limit, getDocs } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
    const { profile, user, fetchProfile } = useAuthStore();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedName, setEditedName] = React.useState(profile?.displayName || '');
    const [isSaving, setIsSaving] = React.useState(false);
    const [myContests, setMyContests] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchMyContests = async () => {
            const q = query(collection(db, 'contests'), limit(10));
            const snap = await getDocs(q);
            setMyContests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchMyContests();
    }, []);

    if (!profile || !user) return null;

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { displayName: editedName });
            await fetchProfile(user.uid);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const statsCards = [
        { label: 'Highest WPM', value: profile.stats.highestWpm, icon: <Trophy />, color: 'text-[#00F3FF]' },
        { label: 'Average Speed', value: profile.stats.averageWpm, icon: <Zap />, color: 'text-[#8B5CF6]' },
        { label: 'Precision', value: `${profile.stats.averageAccuracy}%`, icon: <TrendingUp />, color: 'text-[#00FF95]' },
        { label: 'Data Units (XP)', value: profile.stats.totalXP, icon: <Award />, color: 'text-[#FF4D6D]' },
    ];

    const mockHistory = [
        { day: 'Mon', wpm: 65 },
        { day: 'Tue', wpm: 72 },
        { day: 'Wed', wpm: 68 },
        { day: 'Thu', wpm: 85 },
        { day: 'Fri', wpm: 78 },
        { day: 'Sat', wpm: 92 },
        { day: 'Sun', wpm: 88 },
    ];

    const badgeDefinitions: Record<string, { label: string, icon: React.ReactNode, color: string, desc: string }> = {
        'speed_demon_50': { label: 'Speed Demon', icon: <Zap />, color: 'text-[#00F3FF]', desc: 'Crossed the 50 WPM barrier.' },
        'high_velocity_80': { label: 'High Velocity', icon: <Rocket />, color: 'text-[#00FF95]', desc: 'Exceeded 80 WPM pulse rate.' },
        'sonic_scribe_100': { label: 'Sonic Scribe', icon: <Trophy />, color: 'text-[#FFD700]', desc: 'Legendary 100 WPM milestone.' },
        'neural_overdrive_120': { label: 'Neural Overdrive', icon: <Zap />, color: 'text-[#FF4D6D]', desc: 'Transcended 120 WPM speed.' },
        'pixel_perfect': { label: 'Pixel Perfect', icon: <Target />, color: 'text-[#00FF95]', desc: 'Zero errors in a standard test.' },
        'veteran_node': { label: 'Veteran Node', icon: <Award />, color: 'text-[#8B5CF6]', desc: 'Reached neural level 10.' },
        'cyber_sentinel': { label: 'Cyber Sentinel', icon: <Shield />, color: 'text-[#8B5CF6]', desc: 'Reached neural level 25.' },
        'marathon_scribe': { label: 'Marathon Scribe', icon: <Calendar />, color: 'text-white', desc: 'Completed 100 neural tests.' },
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto space-y-12 cyber-grid">
            {/* User Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F3FF]/5 blur-[80px] rounded-full" />
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <img 
                            src={profile.photoURL} 
                            alt={profile.displayName} 
                            className="w-24 h-24 rounded-2xl border-2 border-[#00F3FF]/30 object-cover shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-[#8B5CF6] text-white text-[10px] font-black px-2 py-1 rounded border border-white/20 shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                            LVL {profile.stats.level}
                        </div>
                    </div>
                    <div className="space-y-1">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <input 
                                    value={editedName}
                                    onChange={e => setEditedName(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-1 text-2xl font-black italic outline-none focus:border-[#00F3FF] w-64"
                                />
                                <button onClick={handleSaveProfile} disabled={isSaving} className="p-2 bg-[#00FF95]/20 text-[#00FF95] rounded-lg">
                                    <Save className="w-4 h-4" />
                                </button>
                                <button onClick={() => setIsEditing(false)} className="p-2 bg-white/5 text-white/40 rounded-lg">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black tracking-tighter uppercase">{profile.displayName}</h1>
                                <button onClick={() => { setEditedName(profile.displayName); setIsEditing(true); }} className="p-1.5 text-white/20 hover:text-white transition-all">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                           <Calendar className="w-3 h-3" /> Node Active since MAY 2026 / {user.email}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-[#00F3FF]/10 border border-[#00F3FF]/30 rounded-xl flex items-center gap-4">
                        <Coins className="w-6 h-6 text-[#00F3FF]" />
                        <div>
                            <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Bank Balance</div>
                            <div className="text-xl font-black text-white">{profile.stats.coins} <span className="text-xs text-[#00F3FF]">CR</span></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Recognition Gallery Section */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <Award className="w-7 h-7 text-[#8B5CF6]" /> RECOGNITION GALLERY
                        <span className="text-xs font-mono text-white/20 ml-4 font-normal tracking-[0.3em]">
                            {profile.badges?.length || 0} / {Object.keys(badgeDefinitions).length} SYNCHRONIZED
                        </span>
                    </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.entries(badgeDefinitions).map(([id, def]) => {
                        const hasBadge = profile.badges?.includes(id);
                        return (
                            <motion.div 
                                key={id}
                                whileHover={hasBadge ? { y: -5, scale: 1.05 } : {}}
                                className={cn(
                                    "p-6 rounded-[2rem] border flex flex-col items-center justify-center text-center space-y-3 transition-all relative group/badge overflow-hidden",
                                    hasBadge 
                                        ? "bg-white/5 border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)] hover:border-[#00F3FF]/30" 
                                        : "bg-black/40 border-white/5 opacity-30 grayscale"
                                )}
                            >
                                {hasBadge && (
                                    <div className={cn("absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover/badge:opacity-100 transition-opacity")} />
                                )}
                                <div className={cn("w-10 h-10 p-2 rounded-xl flex items-center justify-center bg-white/5 border border-white/5", hasBadge && def.color)}>
                                    {/* @ts-ignore */}
                                    {React.cloneElement(def.icon as React.ReactElement, { className: 'w-full h-full' })}
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <div className="text-[10px] font-black uppercase tracking-widest">{def.label}</div>
                                    <div className="text-[7px] text-white/30 uppercase tracking-tighter leading-none hidden group-hover/badge:block animate-in fade-in slide-in-from-bottom-1">
                                        {def.desc}
                                    </div>
                                </div>
                                {hasBadge && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#00F3FF]/50 blur-sm rounded-full" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Stats and History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {statsCards.map((card, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4 hover:border-white/20 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 blur-3xl rounded-full" />
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-white/5", card.color)}>
                                    {/* @ts-ignore */}
                                    {React.cloneElement(card.icon as React.ReactElement, { className: 'w-6 h-6' })}
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">{card.label}</div>
                                    <div className="text-4xl font-black italic tracking-tighter">{card.value}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress Chart */}
                    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[#00F3FF]" /> NEURAL GROWTH CURVE
                            </h3>
                            <select className="bg-[#0B0F19] text-[10px] font-black uppercase text-white/40 border border-white/10 rounded-lg px-3 py-1.5 focus:ring-0 outline-none">
                                <option>LAST 7 DAYS</option>
                                <option>LAST 30 DAYS</option>
                            </select>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockHistory}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis 
                                        dataKey="day" 
                                        stroke="rgba(255,255,255,0.2)" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        stroke="rgba(255,255,255,0.2)" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#00F3FF' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="wpm" 
                                        stroke="#00F3FF" 
                                        strokeWidth={3} 
                                        dot={{ r: 4, fill: '#00F3FF' }} 
                                        activeDot={{ r: 8, stroke: 'rgba(0,243,255,0.3)', strokeWidth: 10 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Certification Card */}
                    <div className="p-10 bg-gradient-to-br from-[#8B5CF6]/20 to-[#00F3FF]/5 border border-[#8B5CF6]/30 rounded-[2.5rem] space-y-6 relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                                <Award className="w-8 h-8 text-[#8B5CF6]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase">ELITE CREDENTIALS</h3>
                                <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-[0.2em] mt-2">
                                    Claim your verified certificate of mastery ( {profile.stats.highestWpm} WPM ).
                                </p>
                            </div>
                            <button 
                                onClick={() => navigate('/certificate')}
                                className="w-full py-4 bg-[#8B5CF6] text-white font-black rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest"
                            >
                                <Award className="w-4 h-4" /> VIEW CERTIFICATE
                            </button>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
                        <h4 className="text-[10px] font-black italic text-white/30 uppercase tracking-[0.3em] mb-4">Neural Nodes</h4>
                        <div className="space-y-3">
                            <button 
                                onClick={() => navigate('/game')}
                                className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all group"
                            >
                                <span className="text-xs font-black uppercase tracking-widest italic">Neural Campaign</span>
                                <Sword className="w-4 h-4 text-white/20 group-hover:text-[#FF4D6D] transition-colors" />
                            </button>
                            {useAuthStore.getState().isAdmin && (
                                <button 
                                    onClick={() => navigate('/host')}
                                    className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all group"
                                >
                                    <span className="text-xs font-black uppercase tracking-widest italic">Host Arena</span>
                                    <Rocket className="w-4 h-4 text-white/20 group-hover:text-[#00FF95] transition-colors" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
