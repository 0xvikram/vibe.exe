'use client';

import React, { useRef, useEffect, useState } from 'react';
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function AuraCard({ aura }: { aura: AuraData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Resize logic to visually scale down the 1200x630 card on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const wrapperWidth = wrapperRef.current.offsetWidth;
        const newScale = Math.min(1, wrapperWidth / 1200);
        setScale(newScale);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Parse Title for special badges
  let mainTitle = aura.title;
  let titleBadge = '';
  const match = aura.title.match(/\((.*?)\)/);
  if (match) {
    titleBadge = match[1];
    mainTitle = mainTitle.replace(`(${titleBadge})`, '').trim();
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full" ref={wrapperRef}>
      {/* 
        This outer container sets the visual height so the scaled absolute child 
        doesn't collapse the layout.
      */}
      <div 
        style={{ height: 630 * scale, width: 1200 * scale }}
        className="relative max-w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-[#070709]"
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          ref={cardRef} 
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
          className="absolute top-0 left-0 w-[1200px] h-[630px] flex flex-col p-12 overflow-hidden bg-[#070709]"
        >
          {/* Noise Texture */}
          <div 
            className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Aura Blob (Bleeding off edges) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1800px] h-[1800px] flex items-center justify-center opacity-80"
          >
            <AuraBlob colors={aura.colors} variance={aura.variance} />
          </motion.div>

          {/* Constellation Lines & Particles */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {aura.particles.map((p, i) => {
              const cx = 1200 * (0.2 + (i * 0.15) % 0.6);
              const cy = 630 * (0.15 + (i * 0.25) % 0.7);
              return (
                <motion.line
                  key={`line-${i}`}
                  x1="600" y1="315"
                  x2={cx} y2={cy}
                  stroke={p.color}
                  strokeWidth="1"
                  strokeOpacity="0.2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, delay: 1 + i * 0.2 }}
                />
              );
            })}
          </svg>

          {aura.particles.map((p, i) => {
            const left = `${20 + (i * 15) % 60}%`;
            const top = `${15 + (i * 25) % 70}%`;
            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full z-10"
                style={{
                  backgroundColor: p.color,
                  width: Math.max(8, p.size),
                  height: Math.max(8, p.size),
                  top,
                  left,
                  boxShadow: `0 0 ${p.size * 3}px ${p.size}px ${p.color}`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.7, 1, 0.7],
                  scale: 1,
                  y: [0, -15, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  opacity: { duration: 3, delay: 1 + i * 0.1 },
                  scale: { duration: 0.5, delay: 1 + i * 0.1 },
                  y: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
                  x: { duration: 6 + i, repeat: Infinity, ease: 'easeInOut' },
                }}
              />
            );
          })}

          {/* Poster Content Layout */}
          <div className="relative z-20 flex flex-col justify-between h-full w-full">
            
            {/* Top Bar: Stats & Brand */}
            <div className="flex justify-between items-start w-full">
              <div className="flex flex-col gap-3">
                <PercentileChip label="Night Owl" percentile={aura.ranks?.nightOwlRank || 50} />
                <PercentileChip label="Consistency" percentile={aura.ranks?.consistencyRank || 50} />
              </div>
              
              <motion.div variants={itemVariants} className="text-white/40 font-mono text-sm tracking-widest uppercase">
                Dev Aura
              </motion.div>
            </div>

            {/* Bottom Content: Title & Insights */}
            <div className="flex flex-col gap-6 w-full max-w-[800px]">
              
              <motion.div variants={itemVariants} className="flex items-end gap-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={aura.avatar} 
                  alt={aura.username} 
                  crossOrigin="anonymous" 
                  className="w-24 h-24 rounded-2xl border-2 border-white/10 shadow-2xl object-cover bg-black" 
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="text-white/60 font-mono text-lg tracking-wide uppercase">
                      github.com/{aura.username}
                    </p>
                    {titleBadge && (
                      <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur text-white text-xs font-bold uppercase tracking-widest">
                        {titleBadge}
                      </span>
                    )}
                  </div>
                  <h1 
                    className="text-6xl font-black tracking-tighter"
                    style={{
                      background: `linear-gradient(to right, #fff, ${aura.colors[0] || '#aaa'})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {mainTitle}
                  </h1>
                </div>
              </motion.div>

              {aura.insights && aura.insights.length > 0 && (
                <HoroscopeInsight insights={aura.insights} color={aura.colors[0] || '#ffffff'} />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button onClick={handleDownload} className="gap-2 bg-white text-black hover:bg-zinc-200" size="lg">
          <Download className="w-4 h-4" /> Export Poster
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
