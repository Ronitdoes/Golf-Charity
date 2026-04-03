'use client';

// Individual score row component displaying numerical stableford values and chronological data via proportional bar representations
import type { Score } from '@/hooks/useScores';

interface ScoreCardProps {
  score: Score;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export default function ScoreCard({ score, onDelete, isDeleting }: ScoreCardProps) {
  // Format Date gracefully avoiding convoluted timezone mismatches natively
  const dateObj = new Date(score.played_at);
  const dateStr = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC' // Explicitly UTC to counter Next.js hydrating differing locally
  });

  // Calculate strict proportional width for the visual dynamic data bar (base denominator 45 securely)
  const percentage = Math.min(100, Math.max(0, (score.score / 45) * 100));

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between mb-3 shadow-sm hover:border-neutral-700 transition-colors">
      <div className="flex-1 mr-4">
        <div className="flex items-center justify-between mb-2 leading-none">
          <span className="text-white font-bold text-lg leading-none">{score.score} pts</span>
          <span className="text-neutral-500 text-sm">{dateStr}</span>
        </div>
        <div className="w-full bg-neutral-950/50 h-2 rounded-full overflow-hidden border border-neutral-800/50">
          <div 
             className="bg-green-500 h-full rounded-full transition-all duration-700 ease-out"
             style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      <button 
        onClick={() => onDelete(score.id)}
        disabled={isDeleting || score.id.startsWith('temp')}
        className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
        aria-label="Delete Score"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  );
}
