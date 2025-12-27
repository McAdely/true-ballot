// src/app/admin/dashboard/admin-forms.tsx

"use client";

import { useRef } from "react";
import { addPosition, addCandidate } from "../actions";
import { PlusCircle, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminForms({ positions }: { positions: any[] }) {
  const posFormRef = useRef<HTMLFormElement>(null);
  const candFormRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-12">
      
      {/* 1. ADD POSITION FORM */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4 text-primary-700">
          <PlusCircle size={20} />
          <h2 className="font-bold text-lg">Add New Position</h2>
        </div>
        
        <form 
          ref={posFormRef}
          action={async (formData) => {
            const res = await addPosition(formData); // Capture the result
            
            if (res?.error) {
              alert("❌ Error: " + res.error); // Show the REAL error
            } else {
              posFormRef.current?.reset();
              router.refresh(); 
              alert("✅ Position Added!");
            }
          }} 
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Position Title</label>
            <input 
              name="title" 
              placeholder="e.g. Treasurer" 
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <button className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800">
            Create Position
          </button>
        </form>
      </div>

      {/* 2. ADD CANDIDATE FORM */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4 text-primary-700">
          <UserPlus size={20} />
          <h2 className="font-bold text-lg">Add Candidate</h2>
        </div>

        <form 
          ref={candFormRef}
          action={async (formData) => {
            const res = await addCandidate(formData); // Capture result
            
            if (res?.error) {
               alert("❌ Error: " + res.error);
            } else {
               candFormRef.current?.reset();
               router.refresh();
               alert("✅ Candidate Added!");
            }
          }} 
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Select Position</label>
            <select name="position_id" required className="w-full border rounded-lg p-2 bg-white">
              {positions.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input name="name" required placeholder="John Doe" className="w-full border rounded-lg p-2" />
             </div>
             <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Photo URL</label>
                <input name="photo_url" placeholder="https://..." className="w-full border rounded-lg p-2" />
             </div>
          </div>

          <div>
             <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Manifesto / Slogan</label>
             <textarea name="manifesto" rows={2} className="w-full border rounded-lg p-2" />
          </div>

          <button className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700">
            Add Candidate
          </button>
        </form>
      </div>
    </div>
  );
}