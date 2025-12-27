import { createClient } from "../../../lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowLeft, ShieldCheck, Calendar, Hash } from "lucide-react";
import ReceiptCard from "./receipt-card";

export default async function ReceiptsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const supabase = await createClient();

  // Fetch receipts with related position and candidate details
  const { data: receipts } = await supabase
    .from("vote_receipts")
    .select(`
      *,
      positions (title),
      candidates (name, photo_url)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="text-primary-600" />
              My Vote Receipts
            </h1>
            <p className="text-slate-500 mt-1">Cryptographic proof of your participation.</p>
          </div>
          <Link 
            href="/vote" 
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm hover:shadow transition"
          >
            <ArrowLeft size={16} /> Back to Voting
          </Link>
        </header>

        <div className="space-y-4">
          {receipts && receipts.length > 0 ? (
            receipts.map((receipt: any) => (
              <ReceiptCard key={receipt.id} receipt={receipt} />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hash className="text-slate-300 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Receipts Found</h3>
              <p className="text-slate-500 mb-6">You haven't cast any votes yet.</p>
              <Link href="/vote" className="text-primary-600 font-bold hover:underline">
                Go to Ballot
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}