import { createClient } from "../../../../lib/supabase";
import { CheckCircle2, XCircle, Clock, FileText, Fingerprint, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function VerifyResultPage({ params }: { params: { hash: string } }) {
  const supabase = await createClient();
  const cleanHash = params.hash.trim(); // Ensure no hidden spaces

  // 1. Fetch the Receipt with ERROR reporting
  const { data: receipt, error } = await supabase
    .from("vote_receipts")
    .select(`
      created_at,
      receipt_hash,
      positions (title),
      candidates (name) 
    `)
    .eq("receipt_hash", cleanHash)
    .single();

  // ERROR STATE
  if (error || !receipt) {
    console.error("Verification Error:", error); // Check server logs

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4 text-red-600">
             <XCircle className="w-8 h-8" />
             <h1 className="text-2xl font-bold">Verification Failed</h1>
          </div>
          <p className="text-slate-600 mb-6">
            We could not verify this hash.
          </p>

          {/* DEBUG BOX: Shows us exactly what went wrong */}
          <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 mb-6 text-xs font-mono text-slate-700 break-all">
             <strong>Debug Info:</strong><br/>
             Hash: {cleanHash}<br/>
             Error: {error ? error.message : "Row not found (Check RLS)"}<br/>
             Code: {error?.code}
          </div>

          <Link href="/verify" className="text-red-600 font-bold hover:underline">Try Another Hash</Link>
        </div>
      </div>
    );
  }

  // SUCCESS STATE
  // @ts-ignore
  const positionTitle = receipt.positions?.title || receipt.positions?.[0]?.title || "Unknown Position";
  // @ts-ignore
  const candidateName = receipt.candidates?.name || receipt.candidates?.[0]?.name || "Encrypted Value";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Success Header */}
        <div className="bg-emerald-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm animate-bounce">
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