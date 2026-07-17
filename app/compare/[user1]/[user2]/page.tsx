'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuraData } from '@/lib/computeAura';
import CompareCard from '@/components/CompareCard';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ComparePage() {
  const params = useParams();
  const router = useRouter();
  const user1 = params.user1 as string;
  const user2 = params.user2 as string;
  
  const [aura1, setAura1] = useState<AuraData | null>(null);
  const [aura2, setAura2] = useState<AuraData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuras() {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`/api/aura/${user1}`),
          fetch(`/api/aura/${user2}`)
        ]);
        
        const data1 = await res1.json();
        const data2 = await res2.json();
        
        if (!res1.ok) throw new Error(data1.error || `Failed to fetch aura for ${user1}`);
        if (!res2.ok) throw new Error(data2.error || `Failed to fetch aura for ${user2}`);
        
        setAura1(data1);
        setAura2(data2);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user1 && user2) {
      fetchAuras();
    }
  }, [user1, user2]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-6xl mb-8 flex justify-start z-10">
        <Button 
          variant="ghost" 
          className="text-zinc-400 hover:text-white hover:bg-zinc-900"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to generator
        </Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-8 z-10">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <motion.div
              className="absolute w-40 h-40 rounded-full bg-blue-600 mix-blend-screen opacity-50 blur-xl -translate-x-12"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3], x: [-48, -20, -48] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-40 h-40 rounded-full bg-red-600 mix-blend-screen opacity-50 blur-xl translate-x-12"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3], x: [48, 20, 48] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
          </div>
          <p className="text-zinc-400 font-medium text-lg animate-pulse">Preparing the arena...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-950/30 border border-red-900 text-red-400 px-6 py-4 rounded-xl flex flex-col items-center gap-4 z-10">
          <p>{error}</p>
          <Button variant="outline" onClick={() => router.push('/')} className="border-red-900 hover:bg-red-900/50">
            Try again
          </Button>
        </div>
      )}

      {aura1 && aura2 && !loading && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center z-10"
        >
          <CompareCard aura1={aura1} aura2={aura2} />
        </motion.div>
      )}
    </div>
  );
}
