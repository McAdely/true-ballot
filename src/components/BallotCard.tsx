// src/components/BallotCard.tsx

"use client";

import { useState } from "react";
import { castVote } from "../app/actions";
import { CheckCircle2, Loader2, ChevronRight, Info, Copy } from "lucide-react";

// NEW: Accept props for initial state
export default function BallotCard({ 
  candidate, 
  positionId, 
  initialVotedState = false, 
  initialReceipt = "",
  disabled = false 
}: any) {
  
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(initialVotedState);
  const [receiptHash, setReceiptHash] = useState(initialReceipt);
  const [error, setError] = useState("");
  const [showManifesto, setShowManifesto] = useState(false);
  const isDimmed = disabled && !voted;
  async function handleVote() {
    if (!confirm(`Are you sure you want to vote for ${candidate.name}? This cannot be undone.`)) return;
    
    setLoading(true);
    setError("");
    
    // Call the updated action
    const result = await castVote(candidate.id, positionId);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setVoted(true);
      setReceiptHash(result.receiptHash || ""); // Save the hash
      setLoading(false);
    }
  }

  return (
    <div className={`
      group relative overflow-hidden transition-all duration-300 rounded-2xl border-2
      ${voted 
        ? 'bg-emerald-50 border-emerald-500 shadow-emerald-100' 
        : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl shadow-slate-200/50'}
    `}>
      <div className="p-5">
        <div className="flex items-center gap-4">
          {/* Candidate Avatar/Initials */}
          <div className={`
            h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0
            ${voted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}
            transition-colors duration-300
          `}>
            {candidate.photo_url ? (
              <img src={candidate.photo_url} alt={candidate.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              candidate.name.charAt(0)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate">{candidate.name}</h3>
            <button 
              onClick={() => setShowManifesto(!showManifesto)}
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              <Info className="w-3.5 h-3.5" />
              {showManifesto ? "Hide Manifesto" : "View Manifesto"}
            </button>
          </div>
        </div>

        {/* Expandable Manifesto */}
        <div className={`
          overflow-hidden transition-all duration-300 
          ${showManifesto ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <p className="text-slate-600 text-sm leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100">
            {candidate.manifesto}
          </p>
        </div>

        {/* Action Button */}
        {!voted && !isDimmed && (
             // ... Keep your "Cast Vote" Button code ...
             <button onClick={handleVote} disabled={loading} className="mt-5 w-full h-12 flex items-center justify-center gap-2 font-bold rounded-xl bg-slate-900 text-white hover:bg-indigo-700 shadow-lg shadow-slate-200">
                {loading ? <Loader2 className="animate-spin" /> : "Cast Vote"}
             </button>
        )}
       {voted && (
          /* RECEIPT SECTION (New!) */
          <div className="mt-5 space-y-3">
             <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold bg-emerald-100 py-3 rounded-xl">
               <CheckCircle2 className="w-5 h-5" />
               Vote Recorded
             </div>
             
             {receiptHash && (
               <div className="bg-white border border-slate-200 p-3 rounded-lg">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                   Vote Receipt Hash
                 </p>
                 <div className="flex items-center gap-2">
                   <code className="text-[10px] text-slate-600 break-all font-mono bg-slate-50 p-1 rounded flex-1">
                     {receiptHash}
                   </code>
                   <button 
                      onClick={() => navigator.clipboard.writeText(receiptHash)}
                      className="text-slate-400 hover:text-slate-600"
                      title="Copy Hash"
                   >
                     <Copy size={14} />
                   </button>
                 </div>
               </div>
             )}
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg animate-shake">
            <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}