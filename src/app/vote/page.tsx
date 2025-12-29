import { createClient } from "../../../lib/supabase";
import { redirect } from "next/navigation";
import BallotCard from "../../components/BallotCard";
import HashLock from "../../components/HashLock";
import { Vote, Clock, Lock, CheckCircle2, Copy, FileText, ArrowRight } from "lucide-react"; // Added Icons
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { checkIsAdmin } from "../admin/actions"; // Keep your admin check

export default async function VotePage() {
  const { userId } = await auth(); 
  if (!userId) redirect("/");

  // 🛑 BLOCK ADMINS
  const isAdmin = await checkIsAdmin();
  if (isAdmin) {
    // ... (Keep your existing Admin Block UI here) ...
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-center">
            <p>Admin Access Restricted</p>
            <Link href="/admin/dashboard" className="underline">Go to Dashboard</Link>
        </div>
    )
  }

  const supabase = await createClient(); 

  const { data: settings } = await supabase.from("election_settings").select("status").single();
  const status = settings?.status || 'not_started';

  // ... (Keep your existing Status Checks for 'not_started' and 'closed' here) ...
  if (status === 'not_started') return <div>Voting not started</div>;
  if (status === 'closed') return <div>Voting Closed</div>;

  const { data: positions } = await supabase
    .from("positions")
    .select(`id, title, candidates (id, name, manifesto, photo_url)`);

  const { data: myVotes } = await supabase
    .from("vote_receipts")
    .select("candidate_id, receipt_hash, position_id")
    .eq("user_id", userId);

  const votesMap: Record<string, { hash: string }> = {};
  myVotes?.forEach((v) => {
    votesMap[v.position_id] = { hash: v.receipt_hash };
  });

  // Calculate progress
  const totalPositions = positions?.length || 0;
  const votesCast = myVotes?.length || 0;
  const isComplete = totalPositions > 0 && votesCast === totalPositions;

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex justify-center mb-4">
             <div className="bg-white p-4 rounded-2xl shadow-xl shadow-indigo-500/20 mb-4">
               <Vote className="w-12 h-12 text-indigo-600" />
             </div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">University Ballot</h1>
          <p className="text-slate-600 mt-2">Secure • Verifiable • Anonymous</p>
          
          {/* Progress Indicator */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
            <span className={isComplete ? "text-emerald-600 font-bold" : "text-indigo-600 font-bold"}>
                {votesCast} / {totalPositions}
            </span>
            <span>Votes Cast</span>
          </div>
        </header>

        {/* Voting Sections */}
        <div className="space-y-12">
          {positions?.map((pos) => {
            const existingVote = votesMap[pos.id];

            return (
              <section key={pos.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {pos.title}
                  </h2>
                  
                  {existingVote && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in">
                      <CheckCircle2 size={16} />
                      <span>Vote Encrypted & Locked</span>
                    </div>
                  )}
                </div>

                {existingVote && (
                <div className="mb-8 p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Your Secure Receipt
                    </p>
                    <Link 
                      href={`/success?hash=${existingVote.hash}`}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    >
                      <Copy size={12} /> View Official Receipt
                    </Link>
                  </div>
                  
                  <HashLock isLocked={true} targetHash={existingVote.hash} />
                  
                  <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-2">
                    <Lock size={10} /> 
                    For privacy, your candidate selection is hidden from this view.
                  </p>
                </div>
              )}

                <div className="grid md:grid-cols-2 gap-6">
                  {pos.candidates.map((candidate: any) => (
                    <BallotCard 
                      key={candidate.id} 
                      candidate={candidate} 
                      positionId={pos.id} 
                      initialVotedState={false} 
                      initialReceipt=""
                      disabled={!!existingVote} 
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* --- NEW BOTTOM ACTION AREA --- */}
        <div className="mt-16 text-center pb-12">
            <Link 
                href="/receipts" 
                className={`
                    inline-flex items-center gap-3 px-8 py-5 rounded-2xl text-lg font-bold shadow-xl transition-all hover:-translate-y-1
                    ${isComplete 
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/30" 
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-500/30"}
                `}
            >
                {isComplete ? <CheckCircle2 size={24} /> : <FileText size={24} />}
                {isComplete ? "Election Complete - View Receipts" : "View My Receipts"}
                <ArrowRight size={20} className="opacity-60" />
            </Link>
            <p className="mt-6 text-slate-500 text-sm max-w-md mx-auto">
                {isComplete 
                    ? "You have cast votes for all positions. You can verify your encrypted receipts at any time."
                    : "You can view receipts for the votes you have cast so far. You may return to complete the ballot later if voting is still open."}
            </p>
        </div>

      </div>
    </main>
  );
}