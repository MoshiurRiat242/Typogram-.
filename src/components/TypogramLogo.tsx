import React from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const TypogramLogo: React.FC<{ className?: string, iconOnly?: boolean }> = ({ className, iconOnly }) => {
  return (
    <div className={cn("flex items-center gap-3 group select-none", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-[#00F3FF] blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative w-10 h-10 bg-gradient-to-br from-[#00F3FF] via-[#0077FF] to-[#8B5CF6] rounded-xl flex items-center justify-center border border-white/20 shadow-[0_4px_20px_rgba(0,243,255,0.3)] transform group-hover:rotate-12 transition-transform duration-500">
          <Zap className="w-6 h-6 text-[#0B0F19] fill-current" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse blur-[1px]" />
        </div>
      </div>
      {!iconOnly && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter text-white uppercase italic"
        >
          {/* Animated Lettering */}
          {'TYPOGRAM'.split('').map((char, i) => (
             <motion.span
                key={i}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.1 }}
                className={i >= 4 ? "text-[#00F3FF] drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]" : ""}
             >
                {char}
             </motion.span>
          ))}
        </motion.span>
      )}
    </div>
  );
};
