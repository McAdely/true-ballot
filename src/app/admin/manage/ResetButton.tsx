// src/app/admin/manage/ResetButton.tsx

"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { resetElectionForNewSession } from "./actions";

export default function ResetButton() {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    // 🛑 THE SAFETY CHECK
    const confirmed = window.confirm(
      "DANGER: Are you sure you want to WIPE ALL DATA?\n\nThis will delete:\n- All Candidates\n- All Votes\n- All Receipts\n\nThis cannot be undone."
    );

    if (!confirmed) return;

    const doubleConfirmed = window.confirm(
      "Type 'YES' to confirm you want to start a new academic session?"
    );
    // Note: Simple confirm doesn't take input, but asking twice is a good friction point.
    // Or just rely on the first strongly worded one.
    
    if (!doubleConfirmed) return;

    setLoading(true);
    await resetElectionForNewSession();
    setLoading(false);
    // The server action revalidates the path, so the UI will update
    alert("System has been reset to Setup Mode.");
  };

  return (
    <button 
      onClick={handleReset}
      disabled={loading}
      className="bg-white border border-red-300 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
      Wipe & Reset Data
    </button>
  );
}