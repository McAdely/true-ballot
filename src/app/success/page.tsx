// src/app/success/page.tsx

"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  
  // Trigger confetti on load
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 text-center border border-slate-100 relative overflow-hidden">
        
        {/* Decorative Background Blob */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-secondary-500" />

        <div className="mb-6 flex justify-center">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
             <ShieldCheck className="w-10 h-10 text-green-600" />
           </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Vote Recorded!</h1>
        <p className="text-slate-500 mb-8">
          Thank you for participating in the university election. Your voice has been securely counted.
        </p>

        {/* The "Digital Sticker" */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 mb-8 transform rotate-1 hover:rotate-0 transition duration-300">
           <p className="font-black text-2xl text-primary-600 uppercase tracking-widest">
             I Voted
           </p>
           <p className="text-xs text-slate-400 mt-1 font-mono">
             {new Date().toLocaleDateString()} • Secure Ballot
           </p>
        </div>

        <Link 
          href="/" 
          className="block w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}