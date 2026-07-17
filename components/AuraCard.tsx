'use client';

import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import AuraBlob from './AuraBlob';
import PercentileChip from './PercentileChip';
import HoroscopeInsight from './HoroscopeInsight';
import { AuraData } from '@/lib/computeAura';
import { Button } from './ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function AuraCard({ aura }: { aura: AuraData }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, {
          cacheBust: true,
          style: { transform: 'scale(1)' },
          pixelRatio: 2,
        });
        const link = document.createElement('a');
        link.download = `${aura.username}-aura.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export PNG', err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-5xl">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        ref={cardRef} 
        className="relative w-full aspect-[1200/700] bg-[#09090b] rounded-2xl overflow-hidden shadow-2xl flex flex-col p-8 border border-zinc-800"
      >
        {/* Subtle noise texture background */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Aura Blob - Centered and Larger */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center pt-8"
        >
          {/* We scale the blob container to make it bigger relative to the card */}
          <div className="w-[120%] h-[120%] flex items-center justify-center -mt-16">
            <AuraBlob colors={aura.colors} variance={aura.variance} />
          </div>
        </motion.div>
        
        {/* Particles with drift and glow */}
        {aura.particles.map((p, i) => {
          const startX = 20 + (i * 30) % 60;
          const startY = 10 + (i * 25) % 70;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
                top: `${startY}%`,
                left: `${startX}%`,
                opacity: 0.8,
                boxShadow: `0 0 ${p.size * 2}px ${p.size / 2}px ${p.color}`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: 1,
                y: [0, -30, 0],
                x: [0, 20, 0],
              }}
              transition={{
                opacity: { duration: 2, delay: 0.5 + i * 0.1 },
                scale: { duration: 0.5, delay: 0.5 + i * 0.1 },
                y: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut' },
                x: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          );
        })}

        {/* Top/Bottom Content Layout */}
        <div className="relative z-10 flex flex-col justify-between h-full w-full pointer-events-none">
          
          {/* Top Section: Header & Watermark */}
          <div className="flex justify-between items-start w-full">
            <motion.div variants={itemVariants} className="text-zinc-500 font-mono text-xs md:text-sm tracking-widest uppercase bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-zinc-800/50">
              Dev Aura Generator
            </motion.div>
          </div>

          {/* Bottom Section: Avatar, Title, Stats, Insights */}
          <div className="flex flex-col gap-6">
            {/* User Info & Chips Row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              
              <motion.div variants={itemVariants} className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={aura.avatar} 
                  alt={aura.username} 
                  crossOrigin="anonymous" 
                  className="w-20 h-20 rounded-full border-[3px] border-zinc-800 shadow-xl object-cover bg-zinc-900" 
                />
                <div className="flex flex-col">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {aura.title}
                  </h1>
                  <p className="text-zinc-400 text-lg font-medium mt-1">github.com/{aura.username}</p>
                </div>
              </motion.div>

              <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2">
                <PercentileChip label="Night Owl" percentile={aura.ranks?.nightOwlRank || 50} />
                <PercentileChip label="Consistency" percentile={aura.ranks?.consistencyRank || 50} />
              </div>
            </div>

            {/* Horoscope Insight */}
            {aura.insights && aura.insights.length > 0 && (
              <HoroscopeInsight insights={aura.insights} />
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button onClick={handleDownload} className="gap-2 bg-white text-black hover:bg-zinc-200" size="lg">
          <Download className="w-4 h-4" /> Export Card
        </Button>
        <Button 
          onClick={() => {
            const text = `I just discovered my GitHub Dev Aura: ${aura.title}! ✨\n\nGenerate yours:`;
            const url = `https://vibe-exe.vercel.app/aura/${aura.username}`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
          }}
          className="gap-2 bg-blue-500 text-white hover:bg-blue-600 border border-blue-400/50" 
          size="lg"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share on X
        </Button>
      </div>
      
      <div className="text-zinc-500 text-sm flex gap-2 items-center flex-col sm:flex-row mt-2 text-center">
        <p>Embed in your README:</p>
        <code className="bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded-md text-zinc-300 font-mono text-xs select-all break-all">
          ![aura](https://YOUR_DOMAIN/api/aura-badge/{aura.username})
        </code>
      </div>
    </div>
  );
}
