"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { ShieldCheck, Download, ArrowLeft, ExternalLink, Loader2 } from "lucide-react"; // Added Loader2
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import Link from "next/link";

// 1. Rename your main logic to "SuccessContent"
function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hash = searchParams.get("hash");
  
  // State for client-side mounting
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (hash) {
      // Only trigger confetti if we have a valid receipt
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [hash, router]);

  const downloadPDF = () => {
    if (!hash) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(30, 41, 59); // Slate 900
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Official Ballot Receipt", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("True Ballot Secure Election System", pageWidth / 2, 30, { align: "center" });

    // Hash Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Cryptographic Verification Hash:", 20, 60);
    
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.setFillColor(241, 245, 249); // Slate 100
    doc.rect(15, 65, pageWidth - 30, 20, "F");
    doc.text(hash, 20, 78);

    // Verification Instructions
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("How to Verify:", 20, 110);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("1. Scan the QR code below.", 20, 120);
    doc.text("2. Or visit the verification portal and enter your hash manually.", 20, 126);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Timestamp: ${new Date().toLocaleString()}`, 20, 250);
    doc.text("This document serves as proof of participation.", 20, 256);

    doc.save(`vote-receipt-${hash.slice(0, 8)}.pdf`);
  };

  if (!mounted) return null;

  if (!hash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">No receipt hash found.</p>
        <Link href="/vote" className="ml-4 text-emerald-600 underline">Return to Voting</Link>
      </div>
    );
  }

  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${hash}`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl p-8 border border-slate-100 relative overflow-hidden">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <ShieldCheck className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Vote Secured!</h1>
          <p className="text-slate-500 text-sm mt-2">
            Your ballot has been encrypted and recorded on the ledger.
          </p>
        </div>

        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Receipt Hash</p>
               <p className="font-mono text-[10px] text-slate-600 break-all mt-1 bg-white p-2 rounded border border-slate-100">
                 {hash}
               </p>
             </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <QRCodeSVG 
              value={verifyUrl} 
              size={120}
              level={"H"}
              includeMargin={true}
            />
            <p className="text-[10px] text-slate-400 mt-2">Scan to verify on public ledger</p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={downloadPDF}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg"
          >
            <Download size={20} /> Download Official Receipt
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href={`/verify/${hash}`}
              className="py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition"
            >
              <ExternalLink size={16} /> Verify Now
            </Link>
            <Link 
              href="/vote" 
              className="py-3 bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-100 transition"
            >
              <ArrowLeft size={16} /> Vote Again
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// 2. Export the Wrapper Component that contains the Suspense Boundary
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}