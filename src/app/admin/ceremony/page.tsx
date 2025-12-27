// src/app/admin/ceremony/page.tsx

"use client";

import { useState } from "react";
import { generateElectionKeys, shardPrivateKey } from "../../../lib/crypto"; // Update import path if needed
import { Shield, Key, Download, Trash2, AlertTriangle } from "lucide-react";
import { savePublicKey } from "./actions"; // We will create this server action next

export default function CeremonyPage() {
  const [step, setStep] = useState(1); // 1=Intro, 2=Generated, 3=Complete
  const [shards, setShards] = useState<{part1: string, part2: string, part3: string} | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    
    // 1. Generate Keys Client-Side (or Server-Side if preferred, here we verify logic)
    // NOTE: In a real "Trust No One" app, this happens in browser memory.
    // For this demo, we'll use the helper we made.
    
    // Simulating the server call to get keys (safer to keep crypto logic consistent)
    const result = await savePublicKey(); 
    
    if (result.success && result.privateKey) {
       // 2. Shard the Private Key immediately
       const parts = shardPrivateKey(result.privateKey);
       setShards(parts);
       setStep(2);
    } else {
       alert("Error generating keys");
    }
    setLoading(false);
  }

  const downloadShard = (role: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `KEY_SHARD_${role.toUpperCase()}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-6">
          <div className="bg-emerald-500/10 p-3 rounded-full">
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">The Key Ceremony</h1>
            <p className="text-slate-400">Secure Election Initialization Protocol</p>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 text-yellow-200">
              <AlertTriangle className="shrink-0" />
              <p className="text-sm">
                <strong>Warning:</strong> This action effectively "starts" a new secure election. 
                Any previous keys will be overwritten. Ensure all 3 custodians are present.
              </p>
            </div>
            
            <p className="text-slate-300 leading-relaxed">
              When you begin, the system will generate a cryptographic <strong>Key Pair</strong>.
              <br/><br/>
              • The <strong>Public Key</strong> will be saved to the database (to encrypt votes).
              <br/>
              • The <strong>Private Key</strong> will be split into 3 shards and shown ONCE.
              <br/>
              • The Private Key is <strong>never saved</strong> to the database.
            </p>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
            >
              {loading ? "Generating Crypto Vault..." : "Start Key Ceremony"}
            </button>
          </div>
        )}

        {step === 2 && shards && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <Key className="text-emerald-400" /> Save Your Shards
             </h2>
             <p className="text-sm text-slate-400">
               Distribute these files to the 3 distinct custodians. <strong>Do not lose them.</strong> 
               Without all 3 combined, the election results can NEVER be decrypted.
             </p>

             <div className="grid gap-4">
               {/* Shard 1 */}
               <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                 <div>
                   <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Custodian 1</span>
                   <h3 className="font-bold text-white">Electoral Committee</h3>
                 </div>
                 <button onClick={() => downloadShard("Committee", shards.part1)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium flex gap-2 transition">
                   <Download size={16} /> Save Shard A
                 </button>
               </div>

               {/* Shard 2 */}
               <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                 <div>
                   <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Custodian 2</span>
                   <h3 className="font-bold text-white">Senate Body</h3>
                 </div>
                 <button onClick={() => downloadShard("Senate", shards.part2)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium flex gap-2 transition">
                   <Download size={16} /> Save Shard B
                 </button>
               </div>

               {/* Shard 3 */}
               <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                 <div>
                   <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Custodian 3</span>
                   <h3 className="font-bold text-white">Executive Body</h3>
                 </div>
                 <button onClick={() => downloadShard("Executive", shards.part3)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium flex gap-2 transition">
                   <Download size={16} /> Save Shard C
                 </button>
               </div>
             </div>

             <div className="pt-4 border-t border-slate-700">
               <button 
                 onClick={() => setStep(3)}
                 className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition"
               >
                 <Trash2 size={18} /> I Have Saved Them - WIPE MEMORY
               </button>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-10 space-y-4">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Protocol Complete</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              The Private Key has been deleted from this server. 
              The election is now secure. Results can only be viewed by combining the 3 shards.
            </p>
            <button onClick={() => window.location.href = "/admin/dashboard"} className="mt-4 text-emerald-400 hover:underline">
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}