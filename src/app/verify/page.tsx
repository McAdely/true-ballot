// src/app/verify/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, QrCode } from "lucide-react";

export default function VerifyLandingPage() {
  const [hash, setHash] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (hash.trim().length > 10) {
      router.push(`/verify/${hash.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white p-4 rounded-2xl shadow-xl shadow-indigo-100 inline-block mb-8">
          <ShieldCheck className="w-16 h-16 text-emerald-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Verify a Vote</h1>
        <p className="text-slate-500 mb-8">
          Enter a receipt hash to verify its authenticity against the official election ledger.
        </p>

        <form onSubmit={handleSearch} className="relative max-w-sm mx-auto w-full">
          <input 
            type="text" 
            placeholder="Paste hash (e.g., 8f7a...)" 
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm font-mono text-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          
          <button 
            type="submit" 
            disabled={hash.length < 10}
            className="mt-4 w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Ledger
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <QrCode size={14} />
          <span>Or verify by scanning the QR code on your PDF receipt.</span>
        </div>
      </div>
    </div>
  );
}