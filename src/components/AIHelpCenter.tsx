import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, Minimize2, Maximize2, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are Typogram AI, a high-performance neural assistant for the Typogram typing platform. 
Your goal is to help users improve their typing speed and accuracy. 
Be helpful, concise, and maintain a cool, futuristic cyberpunk aesthetic in your communication.
Typogram features:
- Neural Synchronization: Classic typing practice.
- Elite Contests: Real-time multiplayer typing competitions.
- Hall of Elites: Global leaderboard.
- Neural Dashboard: Personal stats and progress tracking.
If users ask about saving results, tell them they need to be registered and click the "Save Results" button after a test.`;

export const AIHelpCenter: React.FC = () => {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "SYSTEM INITIALIZED. I am Typogram AI. How can I augment your typing efficiency today?" }
    ]);
    const [input, setInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<any>(null);

    const SUGGESTIONS = [
        "How to improve WPM?",
        "What are neural levels?",
        "Multiplayer arenas?",
        "Saving progress?"
    ];

    useEffect(() => {
        const initChat = () => {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            chatRef.current = ai.chats.create({
                model: "gemini-3-flash-preview",
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                },
            });
        };
        initChat();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isSubmitting) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsSubmitting(true);

        try {
            if (!chatRef.current) throw new Error("AI not initialized");
            
            const result = await chatRef.current.sendMessage({ message: userMsg });
            const aiResponse = result.text;
            
            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse || "I am processing your request. Please stand by." }]);
        } catch (err) {
            console.error("AI Error:", err);
            setMessages(prev => [...prev, { role: 'assistant', content: "FATAL ERROR: Neural link disrupted. Please retry." }]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden bg-[#0B0F19]">
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.map((m, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                            "flex flex-col max-w-[85%]",
                            m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                    >
                        <div className={cn(
                            "p-4 rounded-2xl text-[11px] leading-relaxed uppercase tracking-wide",
                            m.role === 'user' 
                                ? "bg-[#8B5CF6] text-white rounded-tr-none shadow-lg shadow-[#8B5CF6]/10" 
                                : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none font-mono"
                        )}>
                            {m.content}
                        </div>
                        <span className="text-[8px] text-white/20 mt-1 uppercase font-black tracking-widest">
                            {m.role === 'user' ? 'Client' : 'Typogram_AI'}
                        </span>
                    </motion.div>
                ))}
                {isSubmitting && (
                    <div className="flex gap-2 items-center text-white/30 text-[10px] font-mono italic">
                        <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/5 bg-white/5 space-y-4">
                <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map(s => (
                        <button 
                            key={s}
                            onClick={() => { setInput(s); }}
                            className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[9px] uppercase font-black tracking-widest text-white/40 hover:text-[#00F3FF] transition-all"
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Neural sync query..."
                        className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#00F3FF] focus:ring-0 transition-all placeholder:text-white/20 pr-12 outline-none"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isSubmitting || !input.trim()}
                        className="absolute right-2 top-1.5 p-2 text-[#00F3FF] disabled:opacity-30 transition-all hover:bg-[#00F3FF]/10 rounded-lg"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[8px] text-white/20 uppercase font-mono tracking-widest text-center justify-center">
                    <Sparkles className="w-3 h-3" /> Powered by Gemini Ultra Node
                </div>
            </div>
        </div>
    );
};
