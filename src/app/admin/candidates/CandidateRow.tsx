"use client";

import { useState, useRef } from "react"; // Import useRef
import { updateCandidate, deleteCandidate } from "./actions";
import { Trash2, Edit2, Save, X, Loader2, Upload } from "lucide-react"; // Import Upload icon

export default function CandidateRow({ candidate }: { candidate: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // New state for handling file uploads during edit
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(candidate.photo_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State (for text fields)
  const [formData, setFormData] = useState({
    name: candidate.name,
    manifesto: candidate.manifesto || "",
  });

  // Handle resetting state when entering/exiting edit mode
  const toggleEdit = () => {
      if (!isEditing) {
          // Reset to original values when opening edit mode
          setFormData({ name: candidate.name, manifesto: candidate.manifesto || "" });
          setPreviewUrl(candidate.photo_url);
          setNewFile(null);
      }
      setIsEditing(!isEditing);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
      // Create local preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Use FormData to send text + file
    const data = new FormData();
    data.append("id", candidate.id);
    data.append("name", formData.name);
    data.append("manifesto", formData.manifesto);
    // Send the *current* URL as a fallback
    data.append("current_photo_url", candidate.photo_url || "");

    // Only append new image if one was selected
    if (newFile) {
        data.append("new_image", newFile);
    }

    await updateCandidate(data);
    
    // Cleanup local preview URL to avoid memory leaks
    if (previewUrl && previewUrl !== candidate.photo_url) {
        URL.revokeObjectURL(previewUrl);
    }
    
    setIsEditing(false);
    setIsLoading(false);
    setNewFile(null);
  };

  const handleDelete = async () => {
    if(!confirm("Are you sure? This cannot be undone.")) return;
    setIsLoading(true);
    await deleteCandidate(candidate.id);
  };

  // --- EDIT MODE ---
  if (isEditing) {
    return (
      <div className="grid grid-cols-12 gap-4 p-4 bg-indigo-50 items-start animate-in fade-in border-l-4 border-indigo-500">
        {/* IMAGE UPLOAD AREA */}
        <div className="col-span-1 relative group">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-indigo-300 hover:border-indigo-500 cursor-pointer relative"
          >
            {previewUrl ? (
                <img src={previewUrl} className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition" />
            ) : (
                <span className="text-xs text-slate-400">Img</span>
            )}
             {/* Overlay Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Upload size={20} className="text-indigo-700" />
            </div>
          </div>
          {/* Hidden File Input */}
          <input 
             type="file" 
             ref={fileInputRef}
             onChange={handleFileChange}
             accept="image/*"
             className="hidden"
          />
        </div>

        {/* TEXT INPUTS */}
        <div className="col-span-3 font-bold text-slate-900 flex items-center">
          <input 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border border-indigo-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Candidate Name"
          />
        </div>
        <div className="col-span-3 text-sm text-slate-500 flex items-center">
          <span className="badge bg-slate-200 text-slate-700">{candidate.positions?.title}</span>
        </div>
        <div className="col-span-3">
          <textarea 
            value={formData.manifesto}
            onChange={(e) => setFormData({...formData, manifesto: e.target.value})}
            className="w-full p-2 border border-indigo-200 rounded text-xs h-20 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="Manifesto..."
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="col-span-2 flex justify-end gap-2 items-center h-full">
          <button onClick={handleSave} disabled={isLoading} className="p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition shadow-sm">
            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
          </button>
          <button onClick={toggleEdit} disabled={isLoading} className="p-2 bg-slate-300 text-slate-600 rounded hover:bg-slate-400 transition">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  // --- READ ONLY MODE ---
  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition">
      <div className="col-span-1">
        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 text-xs overflow-hidden border border-slate-200 shadow-sm">
            {candidate.photo_url ? <img src={candidate.photo_url} className="w-full h-full object-cover" /> : candidate.name[0]}
        </div>
      </div>
      <div className="col-span-3 font-bold text-slate-900">{candidate.name}</div>
      <div className="col-span-3 text-sm text-slate-600"><span className="badge">{candidate.positions?.title}</span></div>
      <div className="col-span-3 text-xs text-slate-500 truncate">{candidate.manifesto}</div>
      <div className="col-span-2 flex justify-end gap-2">
        <button onClick={toggleEdit} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition">
          <Edit2 size={16} />
        </button>
        <button onClick={handleDelete} className="p-2 text-red-600 hover:bg-red-50 rounded transition">
          {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 size={16} />}
        </button>
      </div>
    </div>
  );
}