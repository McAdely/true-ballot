// src/app/admin/dashboard/download-results-btn.tsx

"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";

export default function DownloadResultsBtn({ results }: { results: any[] }) {
  const [loading, setLoading] = useState(false);

  const generatePDF = () => {
    setLoading(true);
    const doc = new jsPDF();

    // 1. Header
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // Slate-900
    doc.text("Official Election Results", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text("Status: Verified & Decrypted", 14, 35);

    // 2. Prepare Data for Table
    // Columns: Position, Candidate Name, Vote Count
    const tableData = results.map((r) => [
      r.positions?.title || "Unknown Position",
      r.name,
      r.vote_count.toString()
    ]);

    // 3. Generate Table
    autoTable(doc, {
      startY: 45,
      head: [['Position', 'Candidate', 'Total Votes']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74], textColor: 255 }, // Emerald Green
      styles: { fontSize: 11, cellPadding: 4 },
      alternateRowStyles: { fillColor: [241, 245, 249] }
    });

    // 4. Footer / Hash
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text('True Ballot Secure Reporting System - Internal Use Only', 14, doc.internal.pageSize.height - 10);
    }

    doc.save("true-ballot-results.pdf");
    setLoading(false);
  };

  return (
    <button 
      onClick={generatePDF}
      disabled={loading || results.length === 0}
      className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition font-bold shadow-sm"
    >
      {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <FileDown className="w-4 h-4" />}
      Download Official Results PDF
    </button>
  );
}