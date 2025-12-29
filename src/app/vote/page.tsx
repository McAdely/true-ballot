// src/app/vote/page.tsx

import { createClient } from "../../../lib/supabase";
import { redirect } from "next/navigation";
import BallotCard from "../../components/BallotCard";
import { Vote, Clock, Lock, CheckCircle2, Copy } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function VotePage() {
  // 1. VERIFY USER
  const { userId } = await auth(); 
  if (!userId) redirect("/");

  const supabase = await createClient(); 

  // 2. CHECK STATUS
  const { data: settings } = await supabase.from("election_settings").select("status").single();
  const status = settings?.status || 'not_started';

  if (status === 'not_started') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-center relative">
         
         <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
            <Clock className="w-16 h-16 text-yellow-600 mx-auto mb-6 p-4 bg-yellow-100 rounded-full" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Voting hasn't started yet</h1>
            <p className="text-slate-500">Please check back later.</p>
         </div>
      </div>
    );
  }

  if (status === 'closed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-center relative">
        
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
           <Lock className="w-16 h-16 text-slate-600 mx-auto mb-6 p-4 bg-slate-100 rounded-full" />
           <h1 className="text-2xl font-bold text-slate-900 mb-2">Voting is Closed</h1>
           <p className="text-slate-500 mb-6">The election has ended.</p>
        </div>
      </div>
    );
  }

  // 3. FETCH DATA (POSITIONS + CANDIDATES)
  const { data: positions } = await supabase
    .from("positions")
    .select(`id, title, candidates (id, name, manifesto, photo_url)`);

  // 4. FETCH USER'S EXISTING VOTES (Encrypted IDs)
  const { data: myVotes } = await supabase
    .from("vote_receipts")
    .select("candidate_id, receipt_hash, position_id")
    .eq("user_id", userId);

  // Map votes by Position ID
  const votesMap: Record<string, { hash: string }> = {};
  myVotes?.forEach((v) => {
    votesMap[v.position_id] = { hash: v.receipt_hash };
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 relative">
    
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <div className="flex justify-center mb-4">
             <div className="bg-white p-4 rounded-2xl shadow-xl shadow-primary-500/20 mb-4">
               <Vote className="w-12 h-12 text-primary-600" />
             </div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">University Ballot</h1>
          <p className="text-slate-600 mt-2">Secure • Verifiable • Anonymous</p>
        </header>

        <div className="space-y-12">
          {positions?.map((pos) => {
            // Check if user voted in this specific position
            const existingVote = votesMap[pos.id];

            return (
              <section key={pos.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {pos.title}
                  </h2>
                  
                  {/* NEW SUCCESS BANNER (Visible on Reload) */}
                  {existingVote && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in">
                      <CheckCircle2 size={16} />
                      <span>Vote Encrypted & Locked</span>
                    </div>
                  )}
                </div>

                {/* RECEIPT DISPLAY (Section Level) */}
                {existingVote && (
                <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Your Secure Receipt Hash
                    </p>
                    <Link 
                      href={`/success?hash=${existingVote.hash}`}
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <Copy size={12} /> View Official Receipt
                    </Link>
                  </div>
                  
                  <div className="font-mono text-xs text-slate-600 break-all bg-white p-3 rounded border border-slate-100 flex items-center justify-between gap-4">
                    {existingVote.hash}
                  </div>
                  
                  <p className="text-[10px] text-slate-400 mt-2">
                    * For privacy, your specific candidate selection is encrypted and hidden from this view.
                  </p>
                </div>
              )}

                <div className="grid md:grid-cols-2 gap-6">
                  {pos.candidates.map((candidate: any) => (
                    <BallotCard 
                      key={candidate.id} 
                      candidate={candidate} 
                      positionId={pos.id} 
                      // We can no longer highlight the specific candidate on reload
                      // because the DB stores an encrypted string.
                      initialVotedState={false} 
                      initialReceipt=""
                      disabled={!!existingVote} // Disable ALL cards if vote exists
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}