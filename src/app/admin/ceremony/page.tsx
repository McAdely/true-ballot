// src/app/admin/ceremony/page.tsx
"use client";

import { useState } from "react";
import { Shield, Key, Mail, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { generateAndEmailShards } from "./actions";

export default function CeremonyPage() {
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  // Default Portfolios (Editable)
  const [custodians, setCustodians] = useState([
    { role: "Custodian 1", title: "Chairman, Electoral Committee", name: "", email: "" },
    { role: "Custodian 2", title: "President, Student Senate", name: "", email: "" },
    { role: "Custodian 3", title: "Dean of Student Affairs", name: "", email: "" },
  ]);

  const updateField = (index: number, field: string, value: string) => {
    const newCustodians = [...custodians];
    // @ts-ignore
    newCustodians[index][field] = value;
    setCustodians(newCustodians);
  };

  async function handleCeremony() {
    if (!confirm("Are you sure? This will generate new keys and email them immediately. Previous keys will be invalid.")) return;
    
    setLoading(true);
    const res = await generateAndEmailShards(custodians);
    setLoading(false);

    if (res.success) {
      setComplete(true);
    } else {
      alert("Error: " + res.error);
    }
  }

  if (complete) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md bg-slate-800 p-8 rounded-2xl border border-emerald-500/30 text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Protocol Complete</h2>
          <p className="text-slate-400 mb-6">
            The Private Key was generated, sharded, and securely emailed to the 3 custodians.
            <br/><br/>
            <strong>The server memory has been wiped.</strong>
          </p>
          <a href="/admin/dashboard" className="block w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="bg-purple-500/10 p-3 rounded-full">
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Key Ceremony Protocol</h1>
            <p className="text-slate-400">Define the 3 Key Custodians who will hold the election shards.</p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {custodians.map((c, i) => (
            <div key={i} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-purple-400 font-bold text-xs uppercase tracking-widest">
                <Key size={14} /> {c.role}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Portfolio / Title</label>
                  <input 
                    value={c.title}
                    onChange={(e) => updateField(i, 'title', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Full Name</label>
                  <input 
                    value={c.name}
                    onChange={(e) => updateField(i, 'name', e.target.value)}
                    placeholder="e.g. Dr. John Doe"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Official Email</label>
                  <input 
                    value={c.email}
                    onChange={(e) => updateField(i, 'email', e.target.value)}
                    placeholder="official@university.edu"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 text-yellow-200 mb-8 max-w-2xl mx-auto">
          <AlertTriangle className="shrink-0" />
          <p className="text-sm">
            <strong>Security Warning:</strong> Clicking the button below will generate the Election Keys. 
            The Private Key will be split and emailed immediately. 
            <strong>No copy will be saved on this server.</strong> Ensure emails are correct.
          </p>
        </div>

        <div className="text-center">
          <button 
            onClick={handleCeremony}
            disabled={loading}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-900/20 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Mail />} 
            {loading ? "Encrypting & Sending..." : "Execute Protocol: Email Shards"}
          </button>
        </div>
      </div>
    </div>
  );
}