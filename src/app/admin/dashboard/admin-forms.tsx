// src/app/admin/dashboard/admin-forms.tsx

"use client";

import Link from "next/link";
import { Users, FileText, ArrowRight } from "lucide-react";

export default function AdminForms({ positions }: { positions: any[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      
      {/* 1. Manage Candidates Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition group">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
            <Users size={24} />
          </div>
          <Link 
            href="/admin/candidates" 
            className="text-sm font-bold text-slate-500 flex items-center gap-1 hover:text-indigo-600"
          >
            Manage <ArrowRight size={16} />
          </Link>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Candidates</h3>
        <p className="text-slate-500 text-sm mb-6">
          Add new candidates, upload photos, edit manifestos, and remove entries.
        </p>
        <Link 
          href="/admin/candidates" 
          className="block w-full py-2.5 text-center bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition"
        >
          Manage Candidates
        </Link>
      </div>

      {/* 2. Manage Positions (We can keep this simple or make a page for it too) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition group">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
            <FileText size={24} />
          </div>
          {/* If you create a /admin/positions page later, link it here */}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Positions</h3>
        <p className="text-slate-500 text-sm mb-6">
          Define electoral roles (e.g. President, Senate) that students can vote for.
        </p>
        
        {/* Simple inline adder for positions since they are just text */}
        <form action={async (formData) => {
          // You can keep the addPosition server action inline or import it
          // For now, this is a placeholder or you can link to a future page
        }}>
           <div className="flex gap-2">
             <input 
               name="title" 
               placeholder="New Position Title..." 
               className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
             />
             <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700">
               Add
             </button>
           </div>
        </form>
      </div>

    </div>
  );
}