// src/app/admin/dashboard/admin-forms.tsx

"use client";

import Link from "next/link";
import { Users, FileText, ArrowRight } from "lucide-react";
import { addPosition } from "../actions"; 
import { useRef } from "react";

export default function AdminForms({ positions }: { positions: any[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  // 2. Wrapper to handle form reset after submission
  async function handleAddPosition(formData: FormData) {
      const result = await addPosition(formData);
      if (result?.error) {
          alert(result.error);
      } else {
          formRef.current?.reset();
      }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      
      {/* 1. Manage Candidates Card (No changes needed) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition group">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
            <Users size={24} />
          </div>
          <Link href="/admin/candidates" className="text-sm font-bold text-slate-500 flex items-center gap-1 hover:text-indigo-600">
            Manage <ArrowRight size={16} />
          </Link>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Candidates</h3>
        <p className="text-slate-500 text-sm mb-6">
          Add new candidates, upload photos, edit manifestos, and remove entries.
        </p>
        <Link href="/admin/candidates" className="block w-full py-2.5 text-center bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition">
          Manage Candidates
        </Link>
      </div>

      {/* 2. Manage Positions Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition group">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
            <FileText size={24} />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Positions</h3>
        <p className="text-slate-500 text-sm mb-6">
          Define electoral roles (e.g. President, Senate) that students can vote for.
        </p>
        
        {/* 3. Connect the Action */}
        <form ref={formRef} action={handleAddPosition}>
           <div className="flex gap-2">
             <input 
               name="title" 
               required
               placeholder="New Position Title..." 
               className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
             />
             <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition">
               Add
             </button>
           </div>
        </form>
      </div>

    </div>
  );
}