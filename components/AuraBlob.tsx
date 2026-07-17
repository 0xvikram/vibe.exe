'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface AuraBlobProps {
  colors: string[];
  variance: number;
}

export default function AuraBlob({ colors, variance }: AuraBlobProps) {
  const baseFreq = Math.max(0.01, Math.min(0.05, 0.02 + variance * 0.005));

  return (
    <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center filter drop-shadow-2xl">
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="aura-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFreq}
              numOctaves="4"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values={`${baseFreq};${baseFreq * 1.5};${baseFreq}`}
                dur="12s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="150"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="20" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div 
        className="absolute inset-0 w-full h-full flex items-center justify-center mix-blend-screen" 
        style={{ filter: 'url(#aura-filter)' }}
      >
        <motion.div
          className="absolute rounded-full opacity-90"
          style={{
            background: `radial-gradient(circle, ${colors[0] || '#888'} 0%, transparent 70%)`,
            width: '80%',
            height: '80%',
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {colors[1] && (
          <motion.div
            className="absolute rounded-full opacity-80"
            style={{
              background: `radial-gradient(circle, ${colors[1]} 0%, transparent 60%)`,
              width: '70%',
              height: '70%',
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        {colors[2] && (
          <motion.div
            className="absolute rounded-full opacity-70"
            style={{
              background: `radial-gradient(circle, ${colors[2]} 0%, transparent 60%)`,
              width: '60%',
              height: '60%',
            }}
            animate={{
              scale: [1.1, 1, 1.1],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>
    </div>
  );
}
