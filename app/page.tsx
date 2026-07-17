'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/aura/${username.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-xl w-full flex flex-col items-center text-center gap-8"
      >
        <div className="flex items-center justify-center p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 backdrop-blur-sm mb-4">
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">
          Dev Aura
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-md">
          Discover your algorithmic coding vibe. Enter a GitHub username to generate a unique, animated aura based on their code footprint.
        </p>

        <form onSubmit={handleGenerate} className="w-full max-w-sm flex flex-col gap-4 mt-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input 
              type="text" 
              placeholder="GitHub Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 h-14 bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500 text-lg rounded-xl"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!username.trim()}
            className="h-14 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-lg transition-all disabled:opacity-50 disabled:hover:bg-white"
          >
            Generate Aura
          </Button>
        </form>

        <div className="text-zinc-600 text-sm mt-8 flex flex-col items-center gap-2">
          <p>Analyzes public commits, languages, and activity patterns.</p>
          <p className="text-xs opacity-60">Limited to 60 requests/hour per IP by GitHub API.</p>
        </div>
      </motion.div>
    </div>
  );
}
