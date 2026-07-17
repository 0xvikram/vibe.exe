'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function HoroscopeInsight({ insights, color }: { insights: string[], color: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: 0.8, duration: 1 } }
      }}
      className="relative w-full rounded-2xl p-6 overflow-hidden border border-white/10"
      style={{
        background: `linear-gradient(135deg, ${color}15, rgba(0,0,0,0.4))`
      }}
    >
      <div 
        className="absolute inset-0 backdrop-blur-xl -z-10" 
        style={{
          boxShadow: `inset 0 0 40px ${color}10`
        }}
      />
      <div className="flex items-center gap-2 text-white/70 font-mono text-xs uppercase tracking-widest mb-3">
        <Sparkles className="w-4 h-4" style={{ color }} />
        AI Read
      </div>
      <div className="flex flex-col gap-2">
        {insights.map((insight, idx) => (
          <p key={idx} className="text-white/90 text-lg md:text-xl font-medium leading-relaxed tracking-tight">
            {insight}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
