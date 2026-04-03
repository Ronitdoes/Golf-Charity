'use client';

// Input form for Stableford values utilizing strict client-side Zod parameter validation 
import { useState } from 'react';
import { z } from 'zod';

interface ScoreEntryProps {
  onAddScore: (score: number, playedAt: Date) => Promise<{ error?: string; success?: boolean }>;
  scoreCount: number;
}

export default function ScoreEntry({ onAddScore, scoreCount }: ScoreEntryProps) {
  const [score, setScore] = useState('');
  const [playedAt, setPlayedAt] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Maximum allowed date is today natively securely
  const today = new Date().toISOString().split('T')[0];
  
  // Zod Client-Side Schema 
  const schema = z.object({
    score: z.number().int().min(1, 'Score must dynamically natively be at least 1').max(45, 'Score safely cannot exceed 45'),
    playedAt: z.date()
      .max(new Date(), 'Played Date cannot be mathematically in the future')
      // Validating within 1 year purely logically
      .min(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), 'Played Date natively logically cannot be more than exactly 1 year ago')
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const scoreNum = parseInt(score, 10);
    // Utilizing absolute UTC Date instantiation to offset arbitrary geographic misalignments
    const dateObj = new Date(playedAt + 'T00:00:00Z');

    const result = schema.safeParse({ score: scoreNum, playedAt: dateObj });

    if (!result.success) {
       // Isolate descriptive zod payload purely for surface projection
      setErrorMsg(result.error.issues[0]?.message ?? 'Please check your score details and try again.');
      return;
    }

    setIsSubmitting(true);
    const res = await onAddScore(scoreNum, dateObj);
    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      // Clear identically natively assuming pure success
      setScore('');
      setPlayedAt('');
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold text-white mb-4">Add Score</h3>
      
      {scoreCount >= 5 && (
         // Warning notification specifically addressing the isolated DB Trigger rolling window deletion
        <div className="mb-4 text-xs bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg flex items-start gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <span className="leading-snug">
             <span className="font-bold">Rolling window active:</span> Adding a new score will systematically automatically remove your oldest stored score.
           </span>
        </div>
      )}

      {errorMsg && (
         <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-snug">{errorMsg}</span>
         </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end w-full">
        <div className="flex-1 w-full flex flex-col gap-1">
          <label htmlFor="score" className="text-sm font-medium text-neutral-400">Stableford Points (1-45)</label>
          <input 
            type="number" 
            id="score"
            name="score"
            value={score}
            onChange={e => setScore(e.target.value)}
            className="px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none w-full placeholder-neutral-600 transition-shadow"
            placeholder="pts"
            required
            min="1"
            max="45"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex-1 w-full flex flex-col gap-1">
          <label htmlFor="playedAt" className="text-sm font-medium text-neutral-400">Date Played</label>
          <input 
            type="date" 
            id="playedAt"
            name="playedAt"
            value={playedAt}
            onChange={e => setPlayedAt(e.target.value)}
            max={today}
            style={{ colorScheme: 'dark' }} // Native browsers handle date picker aesthetic correctly via specific style implementation
            className="px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-green-500/50 outline-none w-full transition-shadow"
            required
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || !score || !playedAt}
          className="w-full sm:w-auto px-6 py-2.5 bg-green-500 hover:bg-green-400 text-neutral-950 font-bold tracking-wide rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center shrink-0"
        >
          {isSubmitting ? (
             <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-neutral-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : 'Add Score'}
        </button>
      </form>
    </div>
  );
}
