'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuraData } from '@/lib/computeAura';
import AuraCard from '@/components/AuraCard';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuraPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  
  const [aura, setAura] = useState<AuraData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAura() {
      try {
        const res = await fetch(`/api/aura/${username}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch aura');
        }
        
        setAura(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchAura();
    }
  }, [username]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl mb-8 flex justify-start">
        <Button 
          variant="ghost" 
          className="text-zinc-400 hover:text-white hover:bg-zinc-900"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to generator
        </Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-8">
          <motion.div
            className="w-48 h-48 rounded-full bg-zinc-800 mix-blend-screen opacity-50 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <p className="text-zinc-400 font-medium text-lg animate-pulse">Brewing your aura...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-950/30 border border-red-900 text-red-400 px-6 py-4 rounded-xl flex flex-col items-center gap-4">
          <p>{error}</p>
          <Button variant="outline" onClick={() => router.push('/')} className="border-red-900 hover:bg-red-900/50">
            Try again
          </Button>
        </div>
      )}

      {aura && !loading && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center"
        >
          <AuraCard aura={aura} />
        </motion.div>
      )}
    </div>
  );
}
