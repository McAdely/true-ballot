// src/app/admin/tally/page.tsx

"use client";

import { useEffect, useState } from "react";
import { logTallyAccess, decryptAndTally } from "./actions";
import { ShieldAlert, Unlock, FileText, Lock } from "lucide-react";

export default function TallyPage() {
  const [shards, setShards] = useState({ s1: "", s2: "", s3: "" });
  const [results, setResults] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Trigger Alarm on Mount
  useEffect(() => {
    logTallyAccess();
  }, []);

  async function handleUnlock() {
    setLoading(true);
    setError("");
    setResults(null);

    const res = await decryptAndTally(shards.s1, shards.s2, shards.s3);

    if (res?.error) {
      setError(res.error);
    } else if (res?.results) {
      setResults(res.results);
    } else {
      setError("Unknown error occurred during decryption.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-12 border-b border-red-900/50 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-500 flex items-center gap-3">
              <ShieldAlert />
              Restricted Tally Room
            </h1>
            <p className="text-red-900/80 mt-1 uppercase tracking-widest text-xs font-bold">
              Access Logged • Multi-Signature Required
            </p>
          </div>
        </header>

        {!results ? (
          <div className="grid gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lock className="text-slate-500" />
                Input Custodian Shards
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                To decrypt the election results, please input the 3 private key shards generated during the Ceremony.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-purple-400 uppercase mb-1 block">Custodian 1 (Committee)</label>
                  <textarea 
                    value={shards.s1}
                    onChange={(e) => setShards({...shards, s1: e.target.value})}
                    placeholder="Paste contents of KEY_SHARD_COMMITTEE.txt"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-300 h-24 font-mono focus:border-purple-500 outline-none transition"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-blue-400 uppercase mb-1 block">Custodian 2 (Senate)</label>
                  <textarea 
                    value={shards.s2}
                    onChange={(e) => setShards({...shards, s2: e.target.value})}
                    placeholder="Paste contents of KEY_SHARD_SENATE.txt"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-300 h-24 font-mono focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-orange-400 uppercase mb-1 block">Custodian 3 (Executive)</label>
                  <textarea 
                    value={shards.s3}
                    onChange={(e) => setShards({...shards, s3: e.target.value})}
                    placeholder="Paste contents of KEY_SHARD_EXECUTIVE.txt"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-300 h-24 font-mono focus:border-orange-500 outline-none transition"
                  />
                </div>
              </div>

              <button 
                onClick={handleUnlock}
                disabled={loading || !shards.s1 || !shards.s2 || !shards.s3}
                className="w-full mt-8 py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-red-900/20"
              >
                {loading ? "Reconstructing Key & Decrypting..." : <><Unlock /> Unlock Results</>}
              </button>
              
              {error && (
                <div className="mt-4 p-4 bg-red-950/50 border border-red-900/50 text-red-400 rounded text-center text-sm font-bold animate-pulse">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-emerald-950/30 border border-emerald-900/50 p-8 rounded-2xl text-center mb-8">
              <div className="inline-flex p-4 bg-emerald-500/10 rounded-full mb-4">
                <FileText className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Decryption Successful</h2>
              <p className="text-emerald-400/80">The Private Key was reconstructed and the ballot box has been opened.</p>
            </div>

            <div className="grid gap-4">
              {Object.entries(results).map(([candidate, count]) => (
                <div key={candidate} className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex justify-between items-center">
                   <h3 className="text-xl font-bold text-white">{candidate}</h3>
                   <div className="text-3xl font-black text-emerald-400">{count} <span className="text-sm font-medium text-slate-500">votes</span></div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="mt-8 text-slate-500 hover:text-white text-sm underline w-full text-center"
            >
              Lock Vault (Refresh Page)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}