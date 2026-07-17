'use client';

import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import AuraBlob from './AuraBlob';
import { AuraData } from '@/lib/computeAura';
import { Button } from './ui/button';

export default function CompareCard({ aura1, aura2 }: { aura1: AuraData, aura2: AuraData }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, {
          cacheBust: true,
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
    if (invert) return val1 < val2 ? 1 : 2;
    return val1 > val2 ? 1 : 2;
  };

  const a1Score = aura1.totalEvents * (1 + (1 / Math.max(0.1, aura1.variance))) * Math.max(1, aura1.reposCount);
  const a2Score = aura2.totalEvents * (1 + (1 / Math.max(0.1, aura2.variance))) * Math.max(1, aura2.reposCount);

  return (
    <div className="flex flex-col items-center gap-6 w-full px-4">
      <div 
        ref={cardRef}
        className="relative w-full max-w-[1200px] flex flex-col lg:flex-row overflow-hidden rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-zinc-800 bg-[#070709] z-10"
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
          className="absolute top-0 lg:top-1/2 left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-[-30%] lg:-translate-y-1/2 w-[800px] h-[800px] lg:w-[1200px] lg:h-[1200px] flex items-center justify-center opacity-80 mix-blend-screen pointer-events-none"
        >
          <AuraBlob colors={aura1.colors} variance={aura1.variance} />
        </motion.div>

        {/* Right Blob */}
        <motion.div 
          className="absolute bottom-0 lg:bottom-auto lg:top-1/2 left-1/2 lg:right-0 -translate-x-1/2 lg:translate-x-[30%] lg:-translate-y-1/2 w-[800px] h-[800px] lg:w-[1200px] lg:h-[1200px] flex items-center justify-center opacity-80 mix-blend-screen pointer-events-none"
        >
          <AuraBlob colors={aura2.colors} variance={aura2.variance} />
        </motion.div>

        {/* Content Layout */}
        <div className="relative z-20 flex flex-col lg:flex-row w-full p-8 lg:p-12 gap-8 lg:gap-12 min-h-[630px]">
          
          {/* Left User Info */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left justify-center lg:justify-between order-1 lg:order-1 pt-8 lg:pt-0">
            <div className="hidden lg:block text-white/40 font-mono text-sm tracking-widest uppercase bg-black/40 px-4 py-1 rounded-full border border-white/10 backdrop-blur-md mb-8">Challenger 1</div>
            <div className="flex flex-col items-center lg:items-start gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="relative">
                <div className="absolute inset-[-10px] rounded-full blur-xl opacity-50 mix-blend-screen" style={{ background: aura1.colors[0] }} />
                <img src={aura1.avatar} alt={aura1.username} crossOrigin="anonymous" className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl border border-white/20 shadow-2xl object-cover bg-black z-10" />
              </div>
              <div className="bg-black/40 backdrop-blur-xl p-4 lg:p-6 rounded-2xl border border-white/5 shadow-2xl w-full max-w-sm">
                <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 pb-2">{aura1.username}</h1>
                <p className="text-white/80 font-mono text-xs lg:text-sm uppercase tracking-wider">{aura1.title}</p>
                <div className="mt-4 px-3 py-1 bg-white/5 rounded-full w-fit border border-white/10 text-xs font-mono">
                  <span className="opacity-50">Score:</span> <span className="font-bold text-white">{Math.round(a1Score)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Isolated VS Orb (Between Users) */}
          <div className="flex lg:hidden w-full items-center justify-center order-2 -my-8 z-30 pointer-events-none">
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-600 rounded-full blur-xl opacity-60 mix-blend-screen animate-pulse" />
              <div className="relative w-14 h-14 rounded-full bg-black/80 border-2 border-white/20 backdrop-blur-2xl flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 font-black italic text-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] z-30">
                VS
              </div>
            </div>
          </div>

          {/* Right User Info (now order-3 on mobile) */}
          <div className="flex-1 flex flex-col items-center lg:items-end text-center lg:text-right justify-center lg:justify-between order-3 lg:order-3 pb-8 lg:pb-0 mb-8 lg:mb-0">
            <div className="hidden lg:block text-white/40 font-mono text-sm tracking-widest uppercase bg-black/40 px-4 py-1 rounded-full border border-white/10 backdrop-blur-md mb-8">Challenger 2</div>
            <div className="flex flex-col items-center lg:items-end gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="relative">
                <div className="absolute inset-[-10px] rounded-full blur-xl opacity-50 mix-blend-screen" style={{ background: aura2.colors[0] }} />
                <img src={aura2.avatar} alt={aura2.username} crossOrigin="anonymous" className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl border border-white/20 shadow-2xl object-cover bg-black z-10" />
              </div>
              <div className="bg-black/40 backdrop-blur-xl p-4 lg:p-6 rounded-2xl border border-white/5 shadow-2xl w-full max-w-sm">
                <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-bl from-white to-white/50 pb-2">{aura2.username}</h1>
                <p className="text-white/80 font-mono text-xs lg:text-sm uppercase tracking-wider">{aura2.title}</p>
                <div className="mt-4 px-3 py-1 bg-white/5 rounded-full w-fit border border-white/10 text-xs font-mono ml-auto mr-auto lg:ml-auto lg:mr-0">
                  <span className="opacity-50">Score:</span> <span className="font-bold text-white">{Math.round(a2Score)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center VS & Stats (order-4 on mobile, order-2 on desktop) */}
          <div className="w-full lg:w-[400px] shrink-0 flex flex-col items-center justify-center gap-6 order-4 lg:order-2">
            {/* Desktop VS Orb */}
            <div className="hidden lg:flex relative w-32 h-32 rounded-full items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-600 rounded-full blur-2xl opacity-60 mix-blend-screen animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-black/80 border-2 border-white/20 backdrop-blur-2xl flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 font-black italic text-4xl shadow-[0_0_40px_rgba(0,0,0,0.8)] z-30">
                VS
              </div>
            </div>

            <div className="w-full bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {/* Score Battle */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-[10px] lg:text-xs text-white/50 font-mono uppercase tracking-widest">
                  <span className={getWinner(a1Score, a2Score) === 1 ? 'text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}>{Math.round(a1Score)}</span>
                  <span>Aura Score</span>
                  <span className={getWinner(a1Score, a2Score) === 2 ? 'text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}>{Math.round(a2Score)}</span>
                </div>
                <div className="flex h-3 bg-white/5 rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent mix-blend-overlay" />
                  <div className="bg-gradient-to-r from-white/60 to-white transition-all duration-1000" style={{ width: `${(a1Score / (a1Score + a2Score)) * 100}%` }} />
                  <div className="bg-white/10 transition-all duration-1000" style={{ width: `${(a2Score / (a1Score + a2Score)) * 100}%` }} />
                </div>
              </div>

              {/* Consistency */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-[10px] lg:text-xs text-white/50 font-mono uppercase tracking-widest">
                  <span className={getWinner(aura1.ranks.consistencyRank, aura2.ranks.consistencyRank, true) === 1 ? 'text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}>Top {aura1.ranks.consistencyRank}%</span>
                  <span>Consistency</span>
                  <span className={getWinner(aura1.ranks.consistencyRank, aura2.ranks.consistencyRank, true) === 2 ? 'text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}>Top {aura2.ranks.consistencyRank}%</span>
                </div>
                <div className="flex h-3 bg-white/5 rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent mix-blend-overlay" />
                  <div className="bg-gradient-to-r from-white/60 to-white transition-all duration-1000" style={{ width: `${( (100-aura1.ranks.consistencyRank) / ((100-aura1.ranks.consistencyRank) + (100-aura2.ranks.consistencyRank)) ) * 100}%` }} />
                  <div className="bg-white/10 transition-all duration-1000" style={{ width: `${( (100-aura2.ranks.consistencyRank) / ((100-aura1.ranks.consistencyRank) + (100-aura2.ranks.consistencyRank)) ) * 100}%` }} />
                </div>
              </div>

              {/* Activity */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-[10px] lg:text-xs text-white/50 font-mono uppercase tracking-widest">
                  <span className={getWinner(aura1.totalEvents, aura2.totalEvents) === 1 ? 'text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}>{aura1.totalEvents}</span>
                  <span>Total Activity</span>
                  <span className={getWinner(aura1.totalEvents, aura2.totalEvents) === 2 ? 'text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}>{aura2.totalEvents}</span>
                </div>
                <div className="flex h-3 bg-white/5 rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent mix-blend-overlay" />
                  <div className="bg-gradient-to-r from-white/60 to-white transition-all duration-1000" style={{ width: `${(aura1.totalEvents / (aura1.totalEvents + aura2.totalEvents)) * 100}%` }} />
                  <div className="bg-white/10 transition-all duration-1000" style={{ width: `${(aura2.totalEvents / (aura1.totalEvents + aura2.totalEvents)) * 100}%` }} />
                </div>
              </div>

              {/* Pull Requests */}
              <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
                <div className="flex justify-between text-[10px] lg:text-xs text-white/50 font-mono uppercase tracking-widest">
                  <span className={getWinner(aura1.pullRequests, aura2.pullRequests) === 1 ? 'text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}>{aura1.pullRequests}</span>
                  <span className="text-[#a371f7]">Pull Requests</span>
                  <span className={getWinner(aura1.pullRequests, aura2.pullRequests) === 2 ? 'text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}>{aura2.pullRequests}</span>
                </div>
                <div className="flex h-3 bg-white/5 rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent mix-blend-overlay" />
                  <div className="bg-gradient-to-r from-[#a371f7]/80 to-[#a371f7] transition-all duration-1000" style={{ width: `${(aura1.pullRequests / (Math.max(1, aura1.pullRequests + aura2.pullRequests))) * 100}%` }} />
                  <div className="bg-[#a371f7]/20 transition-all duration-1000" style={{ width: `${(aura2.pullRequests / (Math.max(1, aura1.pullRequests + aura2.pullRequests))) * 100}%` }} />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center mt-8 z-20">
        <Button onClick={handleDownload} className="gap-2 bg-white text-black hover:bg-zinc-200 h-12 px-6 rounded-xl font-bold shadow-xl shadow-white/10" size="lg">
          <Download className="w-5 h-5" /> Export Battle Card
        </Button>
        <Button 
          onClick={() => {
            const text = `I challenge @${aura2.username} to an Aura Battle! 🥊\nWho is the better dev?\n\nCompare yours:`;
            const url = `https://vibe-exe.vercel.app/compare/${aura1.username}/${aura2.username}`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
          }}
          className="gap-2 bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/80 border-none h-12 px-6 rounded-xl font-bold shadow-xl shadow-[#1DA1F2]/20" 
          size="lg"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share on X
        </Button>
      </div>
    </div>
  );
}
