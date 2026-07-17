'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function HoroscopeInsight({ insights }: { insights: string[] }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { delay: 1, duration: 0.8 } }
      }}
      className="mt-6 w-full bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-5 flex flex-col gap-3 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider">
        <Sparkles className="w-4 h-4" /> The AI Reads You
      </div>
      <div className="flex flex-col gap-2">
        {insights.map((insight, idx) => (
          <p key={idx} className="text-zinc-300 text-sm md:text-base leading-relaxed">
            "{insight}"
          </p>
        ))}
      </div>
    </motion.div>
  );
}
