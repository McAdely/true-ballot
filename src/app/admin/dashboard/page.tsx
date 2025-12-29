import { createClient } from "../../../../lib/supabase";
import { BarChart3, Play, Square, Pause, Shield, Settings, Lock, EyeOff } from "lucide-react"; // Added Icons
import { updateElectionStatus } from "../actions";
import AdminForms from "./admin-forms";
import { UserButton } from "@clerk/nextjs";
import { checkIsAdmin, checkIsSuperAdmin, getCurrentAdmin } from "../actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminDashboard() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) redirect("/?error=unauthorized");

  const currentAdmin = await getCurrentAdmin();
  const isSuperAdmin = await checkIsSuperAdmin();
  const supabase = await createClient();

  // 1. Fetch Settings First
  const { data: settings } = await supabase
    .from("election_settings")
    .select("status")
    .single();

  const status = settings?.status || 'not_started';

  // 2. LOGIC: ONLY fetch results if election is CLOSED
  // This prevents "peeking" during the active vote
  let results: any[] = [];
  let totalVotes = 0;
  let totalVoters = 0;

  if (status === 'closed') {
      const { data: r } = await supabase
        .from("election_results") // Assuming you have this view
        .select("*")
        .order('vote_count', { ascending: false });
      results = r || [];

      const { count: tv } = await supabase.from("votes").select("*", { count: 'exact', head: true });
      totalVotes = tv || 0;
      
      const { count: tu } = await supabase.from("votes").select("user_id", { count: 'exact', head: true });
      totalVoters = tu || 0;
  } else if (status === 'open') {
      // Just get the raw count of participation (optional), but hide the breakdown
      // Or safer: hide EVERYTHING count-related
      const { count: tv } = await supabase.from("votes").select("*", { count: 'exact', head: true });
      totalVotes = tv || 0; // It's usually okay to know "How many people voted", just not "For whom"
  }

  const { data: positions } = await supabase.from("positions").select("*");

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
             <BarChart3 className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Election Control</h1>
            <div className="flex items-center gap-2 text-slate-500">
              <p>Manage the voting lifecycle</p>
              {isSuperAdmin && (
                <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  <Shield className="w-3 h-3" /> Super Admin
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <Link
              href="/admin/manage"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition"
            >
              <Settings size={18} /> Manage Admins
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl text-white mb-8 shadow-lg border border-slate-700">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold mb-1">Welcome back, {currentAdmin?.full_name}!</h2>
                <p className="text-slate-400 text-sm">System integrity checks passed.</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center gap-2 ${
                status === 'open' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 
                status === 'closed' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 
                'bg-slate-700 text-slate-300'
            }`}>
                {status === 'open' && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                Status: {status.replace('_', ' ')}
            </div>
        </div>
      </div>

      {/* --- THE BLACKOUT LOGIC --- */}
      {status === 'open' ? (
         /* 🔒 HIDDEN STATE */
         <div className="bg-white p-12 rounded-2xl shadow-sm border-2 border-slate-200 border-dashed mb-8 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-slate-50/50 pattern-grid-lg opacity-20 pointer-events-none" />
             
             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <EyeOff className="w-10 h-10 text-slate-400" />
             </div>
             
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Results Blackout Active</h2>
             <p className="text-slate-500 max-w-lg mx-auto mb-8">
                To preserve election integrity, vote tallies are <strong>cryptographically hidden</strong> from all administrators while voting is in progress.
             </p>

             <div className="inline-flex items-center gap-4 bg-slate-100 px-6 py-3 rounded-xl border border-slate-200">
                <div className="text-right border-r border-slate-300 pr-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">Live Turnout</p>
                    <p className="text-2xl font-black text-slate-700">{totalVotes}</p>
                </div>
                <div className="pl-1">
                    <p className="text-xs text-slate-500">Votes Cast</p>
                    <p className="text-[10px] text-slate-400">(Candidate breakdown hidden)</p>
                </div>
             </div>
         </div>
      ) : (
         /* 🔓 REVEALED STATE (Or Setup Mode) */
         <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Total Votes</div>
                <div className="text-4xl font-black text-slate-900 mt-2">{totalVotes}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Unique Voters</div>
                <div className="text-4xl font-black text-slate-900 mt-2">{totalVoters}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Leading Position</div>
                <div className="text-lg font-bold text-slate-900 mt-2 truncate">
                    {/* Simple logic to show top result if available */}
                    {status === 'closed' && results[0] ? results[0].candidate_name : "Waiting for results..."}
                </div>
            </div>
         </div>
      )}

      {/* STATUS CONTROLS */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
        <h3 className="font-bold text-lg text-slate-900 mb-4">Election Controls</h3>
        <div className="flex gap-2 flex-wrap">
          <form action={async () => { "use server"; await updateElectionStatus('not_started'); }}>
            <button 
              disabled={status === 'not_started'} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                status === 'not_started' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <Pause size={18} /> Setup Mode
            </button>
          </form>

          <form action={async () => { "use server"; await updateElectionStatus('open'); }}>
            <button 
              disabled={status === 'open'} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                status === 'open' ? 'bg-green-100 text-green-700 border border-green-200 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/20'
              }`}
            >
              <Play size={18} /> {status === 'open' ? 'Voting Live' : 'Start Voting'}
            </button>
          </form>

          <form action={async () => { "use server"; await updateElectionStatus('closed'); }}>
            <button 
              disabled={status === 'closed'} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                status === 'closed' ? 'bg-red-100 text-red-700 border border-red-200 cursor-not-allowed' : 'hover:bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              <Square size={18} /> End Election
            </button>
          </form>
        </div>
        
        {status === 'open' && (
             <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">
                <Lock size={14} /> 
                <span>Results are locked until you click <strong>End Election</strong>.</span>
             </p>
        )}
      </div>

      {/* Admin Forms (Navigation Hub) */}
      <AdminForms positions={positions || []} />
    </div>
  );
}