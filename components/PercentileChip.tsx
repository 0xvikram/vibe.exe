'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PercentileChip({ label, percentile }: { label: string, percentile: number }) {
  // Determine if this is a "legendary" stat (e.g. Top 1-5%)
  const isLegendary = percentile <= 5;
  const isRare = percentile <= 15 && !isLegendary;

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      }}
      className={`relative group flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm md:text-base shadow-xl backdrop-blur-md border ${
        isLegendary 
          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' 
          : isRare 
            ? 'bg-purple-950/40 border-purple-500/40 text-purple-200'
            : 'bg-zinc-900/60 border-zinc-700/50 text-zinc-300'
      }`}
    >
      {isLegendary && (
        <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md -z-10 animate-pulse" />
      )}
      {isRare && (
        <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-sm -z-10" />
      )}
      
      <span className="opacity-80 font-mono text-xs uppercase tracking-wider">{label}</span>
      <span className="font-bold">Top {percentile}%</span>
    </motion.div>
  );
}
