// src/app/admin/candidates/page.tsx

import { createClient } from "../../../../lib/supabase";
import { checkIsAdmin } from "../actions";
import { redirect } from "next/navigation";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CandidateRow from "./CandidateRow";
import AddCandidateForm from "./AddCandidateForm"; 

export default async function ManageCandidatesPage() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) redirect("/admin/dashboard");

  const supabase = await createClient();

  // 2. FETCH POSITIONS (Required for the dropdown)
  const { data: positions } = await supabase
    .from("positions")
    .select("id, title")
    .order("title");

  const { data: candidates } = await supabase
    .from("candidates")
    .select(`*, positions(title)`)
    .order("position_id");

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="text-indigo-600 w-8 h-8" />
            Manage Candidates
          </h1>
          <Link href="/admin/dashboard" className="text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-2">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>

        {/* 3. RENDER THE FORM HERE */}
        <AddCandidateForm positions={positions || []} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* ... existing table code ... */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-slate-100 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-wider">
            <div className="col-span-1">Photo</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Position</div>
            <div className="col-span-3">Manifesto</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {candidates?.map((candidate: any) => (
              <CandidateRow key={candidate.id} candidate={candidate} />
            ))}
            {(!candidates || candidates.length === 0) && (
              <div className="p-8 text-center text-slate-400">No candidates found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}