'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PercentileChip({ label, percentile }: { label: string, percentile: number }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      className="bg-zinc-900/80 backdrop-blur border border-zinc-800 px-4 py-2 rounded-full text-zinc-300 font-medium text-sm md:text-base shadow-lg flex items-center gap-2"
    >
      <span className="text-zinc-400">{label}:</span>
      <span className="text-white">~Top {percentile}%</span>
    </motion.div>
  );
}
