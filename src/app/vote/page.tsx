// src/app/vote/page.tsx

import { createClient } from "../../../lib/supabase";
import { redirect } from "next/navigation";
import BallotCard from "../../components/BallotCard";
import { Vote, Clock, Lock } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

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
         <div className="absolute top-4 right-4"><UserButton afterSignOutUrl="/" /></div>
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
        <div className="absolute top-4 right-4"><UserButton afterSignOutUrl="/" /></div>
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

  // 4. NEW: FETCH USER'S EXISTING VOTES & RECEIPTS
  // We get the 'candidate_id' they voted for, and the 'receipt_hash' if it exists.
  const { data: myVotes } = await supabase
    .from("vote_receipts")
    .select("candidate_id, receipt_hash, position_id")
    .eq("user_id", userId);

  // Helper: Create a map for quick lookup
  // Format: { "position_id": { candidateId: "...", hash: "..." } }
  const votesMap: Record<string, { candidateId: string; hash: string }> = {};
  myVotes?.forEach((v) => {
    votesMap[v.position_id] = { candidateId: v.candidate_id, hash: v.receipt_hash };
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 relative">
      <div className="absolute top-4 right-4"><UserButton afterSignOutUrl="/" /></div>

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
                <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2 flex justify-between items-center">
                  {pos.title}
                  {existingVote && (
                    <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                      Completed
                    </span>
                  )}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {pos.candidates.map((candidate: any) => (
                    <BallotCard 
                      key={candidate.id} 
                      candidate={candidate} 
                      positionId={pos.id} 
                      // PASS THE STATUS DOWN
                      initialVotedState={existingVote?.candidateId === candidate.id}
                      initialReceipt={existingVote?.candidateId === candidate.id ? existingVote.hash : ""}
                      disabled={!!existingVote} // Disable if ANY vote exists for this position
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