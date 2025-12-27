import { createClient } from "../../../../lib/supabase";
import { CheckCircle2, XCircle, Clock, FileText, Fingerprint } from "lucide-react";
import Link from "next/link";

export default async function VerifyResultPage({ params }: { params: { hash: string } }) {
  const supabase = await createClient();

  // 1. Fetch the Receipt
  const { data: receipt } = await supabase
    .from("vote_receipts")
    .select(`
      created_at,
      receipt_hash,
      positions (title),
      candidates (name) 
    `)
    .eq("receipt_hash", params.hash)
    .single();

  if (!receipt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4 text-red-600">
             <XCircle className="w-8 h-8" />
             <h1 className="text-2xl font-bold">Invalid Receipt</h1>
          </div>
          <p className="text-slate-600 mb-6">
            This hash could not be found in the official election database. It may be fake or incorrect.
          </p>
          <Link href="/verify" className="text-red-600 font-bold hover:underline">Try Another Hash</Link>
        </div>
      </div>
    );
  }

  // HELPER: Safely extract title/name from the arrays Supabase returns
  // @ts-ignore
  const positionTitle = receipt.positions?.[0]?.title || receipt.positions?.title || "Unknown Position";
  // @ts-ignore
  const candidateName = receipt.candidates?.[0]?.name || receipt.candidates?.name || "Encrypted Value";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Success Header */}
        <div className="bg-emerald-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Valid Official Record</h1>
          <p className="text-emerald-100 text-sm mt-1">University Election Database</p>
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded-xl">
               <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                 <FileText size={12} /> Position
               </div>
               <div className="font-bold text-slate-900">{positionTitle}</div>
             </div>
             
             <div className="bg-slate-50 p-4 rounded-xl">
               <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                 <Clock size={12} /> Time Cast
               </div>
               <div className="font-bold text-slate-900 text-sm">
                 {new Date(receipt.created_at).toLocaleString()}
               </div>
             </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Fingerprint size={12} /> Candidate
            </div>
            <div className="font-bold text-slate-900 break-words">
              {candidateName}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bold uppercase block mb-2">Cryptographic Hash</label>
            <div className="bg-slate-900 text-slate-300 font-mono text-[10px] p-3 rounded-lg break-all">
              {receipt.receipt_hash}
            </div>
          </div>

          <Link href="/verify" className="block text-center text-slate-500 text-sm hover:text-slate-800 font-medium">
            Verify Another Vote
          </Link>
        </div>
      </div>
    </div>
  );
}