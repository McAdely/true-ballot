// src/app/admin/dashboard/page.tsx

import { createClient } from "../../../../lib/supabase";
import { BarChart3, Play, Square, Pause, Shield, Settings } from "lucide-react";
import { updateElectionStatus } from "../actions";
import AdminForms from "./admin-forms";
import { UserButton } from "@clerk/nextjs";
import { checkIsAdmin, checkIsSuperAdmin, getCurrentAdmin } from "../actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminDashboard() {
  // 🔒 SECURITY CHECK: Verify user is an admin
  // This now calls the robust RPC function in actions.ts
  const isAdmin = await checkIsAdmin();
  
  if (!isAdmin) {
    // Redirect to home if not authorized
    redirect("/?error=unauthorized");
  }

  // If we pass here, we are 100% an admin in the database.
  const currentAdmin = await getCurrentAdmin();
  const isSuperAdmin = await checkIsSuperAdmin();
  const supabase = await createClient();

  // 1. Fetch Results
  const { data: results } = await supabase
    .from("election_results")
    .select("*")
    .order('vote_count', { ascending: false });

  const { data: positions } = await supabase.from("positions").select("*");

  // 2. Fetch Election Status
  const { data: settings } = await supabase
    .from("election_settings")
    .select("status")
    .single();

  const status = settings?.status || 'not_started';

  // 3. Get vote statistics
  const { count: totalVotes } = await supabase
    .from("votes")
    .select("*", { count: 'exact', head: true });

  const { count: totalVoters } = await supabase
    .from("votes")
    .select("user_id", { count: 'exact', head: true });

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-slate-50">
      {/* Header with User Info */}
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
                  <Shield className="w-3 h-3" />
                  Super Admin
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Admin Management Link (Super Admins Only) */}
          {isSuperAdmin && (
            <Link
              href="/admin/manage"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition"
            >
              <Settings size={18} />
              Manage Admins
            </Link>
          )}
          
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 rounded-xl text-white mb-8 shadow-lg">
        <h2 className="text-xl font-bold mb-1">
          Welcome back, {currentAdmin?.full_name || "Admin"}!
        </h2>
        <p className="text-primary-100">
          You are logged in as {isSuperAdmin ? "Super Administrator" : "Administrator"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
            Total Votes
          </div>
          <div className="text-4xl font-black text-slate-900 mt-2">
            {totalVotes || 0}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
            Unique Voters
          </div>
          <div className="text-4xl font-black text-slate-900 mt-2">
            {totalVoters || 0}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
             Election Status
          </div>
          <div className={`text-2xl font-bold mt-2 capitalize ${status === 'open' ? 'text-green-600' : 'text-slate-900'}`}>
            {status.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* STATUS CONTROLS - (Using your existing component code structure) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
        <h3 className="font-bold text-lg text-slate-900 mb-4">Election Controls</h3>
        <div className="flex gap-2 flex-wrap">
          <form action={async () => { "use server"; await updateElectionStatus('not_started'); }}>
            <button 
              disabled={status === 'not_started'} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                status === 'not_started' 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <Pause size={18} /> Setup Mode
            </button>
          </form>

          <form action={async () => { "use server"; await updateElectionStatus('open'); }}>
            <button 
              disabled={status === 'open'} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                status === 'open' 
                  ? 'bg-green-100 text-green-700 border border-green-200 cursor-not-allowed' 
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/20'
              }`}
            >
              <Play size={18} /> {status === 'open' ? 'Voting Live' : 'Start Voting'}
            </button>
          </form>

          <form action={async () => { "use server"; await updateElectionStatus('closed'); }}>
            <button 
              disabled={status === 'closed'} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                status === 'closed' 
                  ? 'bg-red-100 text-red-700 border border-red-200 cursor-not-allowed' 
                  : 'hover:bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              <Square size={18} /> End Election
            </button>
          </form>
        </div>
        {status === 'not_started' && (
          <p className="text-sm text-slate-500 mt-3">
            ℹ️ Election is in setup mode. Add positions and candidates below.
          </p>
        )}
        {status === 'open' && (
          <p className="text-sm text-green-600 mt-3">
            ✅ Voting is currently active. Students can cast their votes.
          </p>
        )}
        {status === 'closed' && (
          <p className="text-sm text-red-600 mt-3">
            🔒 Election has ended. Results are final.
          </p>
        )}
      </div>

      {/* Admin Forms */}
      <AdminForms positions={positions || []} />
    </div>
  );
}