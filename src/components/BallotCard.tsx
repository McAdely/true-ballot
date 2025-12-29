// src/components/BallotCard.tsx

"use client";

import { useState } from "react";
import { castVote } from "../app/actions";
import { CheckCircle2, Loader2, Info, Copy } from "lucide-react";
import HashLock from "./HashLock";
import Image from "next/image";

const triggerHaptic = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(50); // 50ms vibration (light tap)
  }
};

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

 const handleVote = async () => {
    if (disabled || loading || voted) return;

    triggerHaptic(); // 📳 Vibrate immediately on click
    
    if (!confirm(`Are you sure you want to vote for ${candidate.name}? This cannot be undone.`)) return;
    
    setLoading(true);
    setError("");
    
    const result = await castVote(candidate.id, positionId);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setVoted(true);
      setReceiptHash(result.receiptHash || ""); 
      setLoading(false);
    }
  }

  return (
    <div className={`
      group relative overflow-hidden transition-all duration-300 rounded-2xl border-2
      ${voted 
        ? 'bg-slate-900 border-emerald-500/50 shadow-2xl shadow-emerald-900/20' // Dark mode shift for voted card
        : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl shadow-slate-200/50'}
    `}>
      <div className="p-5">
        <div className="flex items-center gap-4">
          {/* Candidate Avatar */}
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
            <h3 className={`text-lg font-bold truncate ${voted ? 'text-white' : 'text-slate-900'}`}>
                {candidate.name}
            </h3>
            <button 
              onClick={() => setShowManifesto(!showManifesto)}
              className="flex items-center gap-1 text-sm font-medium text-indigo-500 hover:text-indigo-400"
            >
              <Info className="w-3.5 h-3.5" />
              {showManifesto ? "Hide Manifesto" : "View Manifesto"}
            </button>
          </div>
        </div>

        {/* Manifesto */}
        <div className={`
          overflow-hidden transition-all duration-300 
          ${showManifesto ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <p className="text-slate-500 text-sm leading-relaxed p-4 bg-slate-50/5 rounded-xl border border-slate-700/50">
            {candidate.manifesto}
          </p>
        </div>

        {/* Action Button */}
        {!voted && !isDimmed && (
             <button onClick={handleVote} disabled={loading} className="mt-5 w-full h-12 flex items-center justify-center gap-2 font-bold rounded-xl bg-slate-900 text-white hover:bg-indigo-700 shadow-lg shadow-slate-200 transition-all">
                {loading ? <Loader2 className="animate-spin" /> : "Cast Vote"}
             </button>
        )}

       {/* --- NEW RECEIPT SECTION --- */}
       {voted && (
          <div className="mt-5 space-y-4 animate-in fade-in zoom-in duration-500">
             
             {/* 1. Status Badge */}
             <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-500/30 py-3 rounded-xl">
               <CheckCircle2 className="w-5 h-5" />
               Vote Secured
             </div>
             
             {/* 2. The Hash Animation Component */}
             {receiptHash && (
               <div className="relative">
                 <HashLock isLocked={true} targetHash={receiptHash} />
                 
                 {/* Utility Action below the hash */}
                 <button 
                    onClick={() => navigator.clipboard.writeText(receiptHash)}
                    className="mt-2 w-full flex items-center justify-center gap-2 text-[10px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest font-bold"
                 >
                    <Copy size={12} /> Copy Receipt
                 </button>
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