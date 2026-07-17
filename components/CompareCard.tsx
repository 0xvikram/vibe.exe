'use client';

import React, { useRef, useEffect, useState } from 'react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import AuraBlob from './AuraBlob';
import { AuraData } from '@/lib/computeAura';
import { Button } from './ui/button';

export default function CompareCard({ aura1, aura2 }: { aura1: AuraData, aura2: AuraData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

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
        link.download = `${aura1.username}-vs-${aura2.username}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export PNG', err);
      }
    }
  };

  const getWinner = (val1: number, val2: number, invert: boolean = false) => {
    if (val1 === val2) return 'tie';
    if (invert) return val1 < val2 ? 1 : 2; // e.g. for ranks, lower is better
    return val1 > val2 ? 1 : 2;
  };

  const a1Score = aura1.totalEvents * (1 + (1 / Math.max(0.1, aura1.variance))) * Math.max(1, aura1.reposCount);
  const a2Score = aura2.totalEvents * (1 + (1 / Math.max(0.1, aura2.variance))) * Math.max(1, aura2.reposCount);

  return (
    <div className="flex flex-col items-center gap-6 w-full" ref={wrapperRef}>
      <div 
        style={{ height: 630 * scale, width: 1200 * scale }}
        className="relative max-w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-[#070709]"
      >
        <motion.div 
          ref={cardRef} 
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
          className="absolute top-0 left-0 w-[1200px] h-[630px] flex overflow-hidden bg-[#070709]"
        >
          {/* Noise Texture */}
          <div 
            className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Left Blob */}
          <motion.div 
            className="absolute top-1/2 left-0 -translate-y-1/2 w-[1200px] h-[1200px] flex items-center justify-center opacity-80 mix-blend-screen"
            style={{ transform: 'translateX(-30%)' }}
          >
            <AuraBlob colors={aura1.colors} variance={aura1.variance} />
          </motion.div>

          {/* Right Blob */}
          <motion.div 
            className="absolute top-1/2 right-0 -translate-y-1/2 w-[1200px] h-[1200px] flex items-center justify-center opacity-80 mix-blend-screen"
            style={{ transform: 'translateX(30%)' }}
          >
            <AuraBlob colors={aura2.colors} variance={aura2.variance} />
          </motion.div>

          {/* Content Layout */}
          <div className="relative z-20 flex w-full h-full p-12">
            
            {/* Left User Info */}
            <div className="flex-1 flex flex-col justify-between items-start text-left">
              <div className="text-white/40 font-mono text-sm tracking-widest uppercase">Challenger 1</div>
              <div className="flex flex-col gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={aura1.avatar} alt={aura1.username} crossOrigin="anonymous" className="w-24 h-24 rounded-2xl border-2 border-white/10 shadow-2xl object-cover bg-black" />
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-white">{aura1.username}</h1>
                  <p className="text-white/60 font-mono text-sm uppercase mt-1">{aura1.title}</p>
                </div>
              </div>
            </div>

            {/* Center Stats Battle */}
            <div className="w-[400px] shrink-0 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 rounded-full bg-black/60 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white font-black italic text-xl shadow-2xl z-30">
                VS
              </div>

              <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">
                
                {/* Score */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-white/50 font-mono uppercase tracking-wider">
                    <span className={getWinner(a1Score, a2Score) === 1 ? 'text-white font-bold' : ''}>{Math.round(a1Score)}</span>
                    <span>Aura Score</span>
                    <span className={getWinner(a1Score, a2Score) === 2 ? 'text-white font-bold' : ''}>{Math.round(a2Score)}</span>
                  </div>
                  <div className="flex h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="bg-white/80" style={{ width: `${(a1Score / (a1Score + a2Score)) * 100}%` }} />
                    <div className="bg-white/30" style={{ width: `${(a2Score / (a1Score + a2Score)) * 100}%` }} />
                  </div>
                </div>

                {/* Consistency */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-white/50 font-mono uppercase tracking-wider">
                    <span className={getWinner(aura1.ranks.consistencyRank, aura2.ranks.consistencyRank, true) === 1 ? 'text-white font-bold' : ''}>Top {aura1.ranks.consistencyRank}%</span>
                    <span>Consistency</span>
                    <span className={getWinner(aura1.ranks.consistencyRank, aura2.ranks.consistencyRank, true) === 2 ? 'text-white font-bold' : ''}>Top {aura2.ranks.consistencyRank}%</span>
                  </div>
                  <div className="flex h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="bg-white/80" style={{ width: `${( (100-aura1.ranks.consistencyRank) / ((100-aura1.ranks.consistencyRank) + (100-aura2.ranks.consistencyRank)) ) * 100}%` }} />
                    <div className="bg-white/30" style={{ width: `${( (100-aura2.ranks.consistencyRank) / ((100-aura1.ranks.consistencyRank) + (100-aura2.ranks.consistencyRank)) ) * 100}%` }} />
                  </div>
                </div>

                {/* Activity */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-white/50 font-mono uppercase tracking-wider">
                    <span className={getWinner(aura1.totalEvents, aura2.totalEvents) === 1 ? 'text-white font-bold' : ''}>{aura1.totalEvents}</span>
                    <span>Total Activity</span>
                    <span className={getWinner(aura1.totalEvents, aura2.totalEvents) === 2 ? 'text-white font-bold' : ''}>{aura2.totalEvents}</span>
                  </div>
                  <div className="flex h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="bg-white/80" style={{ width: `${(aura1.totalEvents / (aura1.totalEvents + aura2.totalEvents)) * 100}%` }} />
                    <div className="bg-white/30" style={{ width: `${(aura2.totalEvents / (aura1.totalEvents + aura2.totalEvents)) * 100}%` }} />
                  </div>
                </div>

              </div>
            </div>

            {/* Right User Info */}
            <div className="flex-1 flex flex-col justify-between items-end text-right">
              <div className="text-white/40 font-mono text-sm tracking-widest uppercase">Challenger 2</div>
              <div className="flex flex-col items-end gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={aura2.avatar} alt={aura2.username} crossOrigin="anonymous" className="w-24 h-24 rounded-2xl border-2 border-white/10 shadow-2xl object-cover bg-black" />
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-white">{aura2.username}</h1>
                  <p className="text-white/60 font-mono text-sm uppercase mt-1">{aura2.title}</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button onClick={handleDownload} className="gap-2 bg-white text-black hover:bg-zinc-200" size="lg">
          <Download className="w-4 h-4" /> Export Battle Card
        </Button>
        <Button 
          onClick={() => {
            const text = `I challenge @${aura2.username} to an Aura Battle! 🥊\nWho is the better dev?\n\nCompare yours:`;
            const url = `https://vibe-exe.vercel.app/compare/${aura1.username}/${aura2.username}`;
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
    </div>
  );
}
