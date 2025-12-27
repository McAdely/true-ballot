"use client";

import { Download, QrCode, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { useState } from "react";

export default function ReceiptCard({ receipt }: any) {
  const [downloading, setDownloading] = useState(false);

  const generatePDF = async () => {
    setDownloading(true);
    try {
      const doc = new jsPDF();
      
      // 1. Generate QR Code Data URL
      // (Later we will point this to the live verify page)
      const verifyUrl = `${window.location.origin}/verify/${receipt.receipt_hash}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl);

      // 2. Build PDF Document
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("Official Vote Receipt", 105, 20, { align: "center" });
      
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("University Election System", 105, 32, { align: "center" });

      // Transaction Details Box
      doc.setDrawColor(200);
      doc.setFillColor(245, 247, 250);
      doc.rect(20, 40, 170, 90, "F");

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("POSITION", 30, 55);
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(receipt.positions.title, 30, 62);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("CANDIDATE SELECTION", 30, 80);
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(receipt.candidates.name, 30, 87);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("TIMESTAMP", 30, 105);
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(new Date(receipt.created_at).toLocaleString(), 30, 112);

      // The Hash
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("CRYPTOGRAPHIC HASH", 30, 145);
      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      doc.setTextColor(0);
      // Split hash if too long
      const splitHash = doc.splitTextToSize(receipt.receipt_hash, 150);
      doc.text(splitHash, 30, 152);

      // Add QR Code
      doc.addImage(qrDataUrl, "PNG", 140, 50, 40, 40);
      doc.setFontSize(8);
      doc.text("Scan to Verify", 160, 95, { align: "center" });

      // Footer
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("This receipt is a permanent record of your vote.", 105, 280, { align: "center" });

      // Save
      doc.save(`vote-receipt-${receipt.positions.title.replace(/\s+/g, '-')}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF");
    }
    setDownloading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {receipt.positions.title}
            </span>
            <span className="text-slate-400 text-xs flex items-center gap-1">
              • {new Date(receipt.created_at).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            Voted for {receipt.candidates.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
             <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1 font-mono text-[10px] text-slate-500 truncate max-w-[200px] md:max-w-[300px]">
               {receipt.receipt_hash}
             </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={generatePDF}
            disabled={downloading}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition active:scale-95"
          >
            {downloading ? (
               "Generating..."
            ) : (
               <>
                 <Download size={16} /> Download Receipt
               </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}