'use client';

// Scores management dashboard sub-route seamlessly utilizing previously instantiated modular components
import { useScores } from '@/hooks/useScores';
import ScoreEntry from '@/components/scores/ScoreEntry';
import ScoreList from '@/components/scores/ScoreList';

export default function ScoresDashboardPage() {
  const { scores, isLoading, addScore, deleteScore } = useScores();

  const missingScores = Math.max(0, 5 - scores.length);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Scores</h1>
        <p className="text-neutral-400">
          Track your performance sequentially. Stableford scores are matched against monthly draws.
        </p>
      </div>

      {missingScores > 0 ? (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <div>
             <h3 className="text-amber-500 font-bold mb-1">Draw Eligibility Incomplete</h3>
             <p className="text-amber-400/80 text-sm">You need {missingScores} more score{missingScores !== 1 ? 's' : ''} sequentially stored to be eligible for the next upcoming draw. Please enter them below.</p>
           </div>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <div>
             <h3 className="text-green-500 font-bold">You are securely eligible!</h3>
             <p className="text-green-400/80 text-sm">Your most recent 5 scores are actively participating in the upcoming scheduled draw.</p>
           </div>
        </div>
      )}

      {/* Primary Interaction Interface encapsulated fluidly */}
      <ScoreEntry onAddScore={addScore} scoreCount={scores.length} />

      <div>
        <h2 className="text-xl font-bold text-white mb-2 mt-10">Score History</h2>
        {isLoading ? (
           <div className="mt-6 flex flex-col gap-3">
              {[1,2,3].map(i => (
                 <div key={i} className="animate-pulse bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-20 w-full" />
              ))}
           </div>
        ) : (
           <ScoreList scores={scores} onDelete={deleteScore} />
        )}
      </div>
      
    </div>
  );
}
