import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { TypogramLogo } from '../components/TypogramLogo';
import { Trophy, Zap, Download, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const Certificate: React.FC = () => {
    const { profile } = useAuthStore();
    const certificateRef = useRef<HTMLDivElement>(null);

    const downloadCertificate = async () => {
        if (!certificateRef.current) return;
        
        const canvas = await html2canvas(certificateRef.current, {
            backgroundColor: '#0B0F19',
            scale: 2
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${profile?.displayName || 'User'}_Typogram_Certificate.pdf`);
    };

    if (!profile) return null;

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center gap-12 cyber-grid">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F3FF]/10 border border-[#00F3FF]/30 text-[#00F3FF] text-[10px] font-black uppercase tracking-widest">
                    Neural Hub / Achievement Terminal
                </div>
                <h1 className="text-5xl font-black italic tracking-tighter uppercase">Generate <span className="text-[#8B5CF6]">Certificate</span></h1>
                <p className="text-white/40 text-xs uppercase tracking-widest">Formal validation of your neural synchronization speed and accuracy.</p>
            </header>

            {/* Certificate Preview Container */}
            <div className="relative group">
                {/* Neon Glow Outer */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00F3FF] via-[#8B5CF6] to-[#00F3FF] rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                
                <div 
                    ref={certificateRef}
                    className="w-[840px] h-[580px] bg-[#0B0F19] border-2 border-white/10 rounded-3xl p-16 relative overflow-hidden flex flex-col justify-between"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                >
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00F3FF]/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8B5CF6]/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                    {/* Cyberpunk Corners */}
                    <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-[#00F3FF] rounded-tl-3xl opacity-40" />
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-[#8B5CF6] rounded-tr-3xl opacity-40" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-[#8B5CF6] rounded-bl-3xl opacity-40" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-[#00F3FF] rounded-br-3xl opacity-40" />

                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                            <TypogramLogo />
                            <div className="h-px w-32 bg-gradient-to-r from-[#00F3FF] to-transparent mt-2" />
                        </div>
                        <div className="text-right">
                            <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Neural Verification ID</div>
                            <div className="text-sm font-mono text-[#00F3FF] drop-shadow-[0_0_8px_rgba(0,243,255,0.4)] font-bold">TYPO-SYS-{profile.uid.slice(0, 10).toUpperCase()}</div>
                        </div>
                    </div>

                    <div className="space-y-10 text-center relative z-10">
                        <div className="inline-block px-6 py-2 bg-white/5 border border-white/10 rounded-full mb-4">
                            <h2 className="text-[10px] font-black text-[#00F3FF] uppercase tracking-[0.5em] drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">Certificate of Neural Proficiency</h2>
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-white/30 text-[10px] italic uppercase tracking-[0.2em] font-black">Authorized transmission to</p>
                            <h3 className="text-6xl font-black italic text-white uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                {profile.displayName}
                            </h3>
                        </div>
                        
                        <div className="max-w-lg mx-auto">
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.15em] leading-relaxed">
                                Subject has successfully synchronized with the <span className="text-white">Typogram Grid</span>, 
                                manifesting exceptional cognitive throughput and focal precision under simulated neural stress.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 relative z-10 border-y border-white/5 py-10 bg-white/[0.01]">
                        <div className="text-center space-y-2 border-r border-white/5">
                            <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Max Pulse Rate</div>
                            <div className="text-5xl font-black italic text-[#00FF95] drop-shadow-[0_0_15px_rgba(0,255,149,0.3)]">{profile.stats.highestWpm} <span className="text-xs not-italic text-white/40">WPM</span></div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Synchronization Accuracy</div>
                            <div className="text-5xl font-black italic text-[#8B5CF6] drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">{profile.stats.highestAccuracy}<span className="text-xs not-italic text-white/40">%</span></div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end relative z-10">
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F3FF] to-[#8B5CF6] flex items-center justify-center p-2.5">
                                <ShieldCheck className="w-full h-full text-[#0B0F19]" />
                            </div>
                            <div>
                                <div className="text-[8px] font-black text-white/30 uppercase tracking-widest">Protocol Architect</div>
                                <div className="text-xs font-black text-[#00F3FF] uppercase tracking-tighter italic">MiraCore Logix</div>
                                <div className="text-[7px] font-bold text-white/20 uppercase">M-Square Neural Division</div>
                            </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                            <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Timestamp</div>
                            <div className="text-sm font-black text-white uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        </div>
                    </div>
                </div>

                {/* Download Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-3xl">
                    <button 
                        onClick={downloadCertificate}
                        className="px-8 py-4 bg-[#00F3FF] text-[#0B0F19] rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_0_40px_rgba(0,243,255,0.4)]"
                    >
                        <Download className="w-5 h-5" /> Download PDF
                    </button>
                </div>
            </div>

            <p className="text-white/20 text-[10px] uppercase font-black tracking-widest max-w-lg text-center leading-relaxed">
                * This certificate displays your life-time highest WPM and Accuracy captured in any arena instance. Update your metrics by competing in new arenas.
            </p>
        </div>
    );
};
