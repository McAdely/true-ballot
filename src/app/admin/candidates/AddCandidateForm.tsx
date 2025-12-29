// src/app/admin/candidates/AddCandidateForm.tsx

"use client";

import { useState, useRef } from "react";
import { createCandidate } from "./actions"; // Import the new action
import { Plus, Upload, Loader2, Save, X } from "lucide-react";

export default function AddCandidateForm({ positions }: { positions: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    
    const result = await createCandidate(formData);
    
    if (result?.error) {
      alert(result.error);
    } else {
      // Success! Reset everything
      setIsOpen(false);
      setPreview(null);
      formRef.current?.reset();
    }
    
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition shadow-lg"
      >
        <Plus size={18} /> Add Candidate
      </button>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-xl mb-8 animate-in slide-in-from-top-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-slate-800">New Candidate Profile</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>

      <form ref={formRef} action={handleSubmit} className="grid md:grid-cols-2 gap-6">
        
        {/* LEFT: Image Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase">Candidate Photo</label>
          <div className="relative group cursor-pointer">
            <div className={`
              h-48 w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors
              ${preview ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}
            `}>
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
              ) : (
                <div className="text-center text-slate-400 p-4">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-xs">Click to upload image</span>
                </div>
              )}
            </div>
            {/* The actual file input is hidden but covers the area */}
            <input 
              name="image" 
              type="file" 
              accept="image/*" 
              required
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
          </div>
          <p className="text-[10px] text-slate-400 text-center">Supported: JPG, PNG, WEBP (Max 5MB)</p>
        </div>

        {/* RIGHT: Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
            <input name="name" required placeholder="e.g. Sarah Chen" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Position</label>
            <select name="position_id" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Select a Position...</option>
              {positions.map((p: any) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Manifesto / Slogan</label>
            <textarea name="manifesto" required placeholder="Vote for me because..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm h-24 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-indigo-600 transition flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              Save Candidate
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}