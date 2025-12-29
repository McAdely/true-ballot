// src/components/HashLock.tsx

"use client";

import React, { useState, useEffect } from 'react';

const CHAR_SET = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()";

interface HashLockProps {
  targetHash: string;
  isLocked: boolean;
}

const HashLock = ({ targetHash, isLocked }: HashLockProps) => {
  const [displayText, setDisplayText] = useState("WAITING_FOR_VOTE");
  const [status, setStatus] = useState<"idle" | "scrambling" | "locked">("idle");

  useEffect(() => {
    if (!isLocked || !targetHash) return;

    setStatus("scrambling");
    let iterations = 0;
    
    const interval = setInterval(() => {
      // Generate random garbage string of the same length as the target
      const randomString = targetHash
        .split("")
        .map((char, index) => {
          if (index < iterations) {
            return targetHash[index]; // Reveal real char from left to right
          }
          return CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
        })
        .join("");

      setDisplayText(randomString);

      if (iterations >= targetHash.length) {
        clearInterval(interval);
        setStatus("locked");
        setDisplayText(targetHash); // Ensure final state is exact
      }
      
      // Speed up the reveal slightly for long hashes
      iterations += 1/2; 
    }, 30); // Speed of the scramble in ms

    return () => clearInterval(interval);
  }, [isLocked, targetHash]);

  return (
    <div className={`
      relative overflow-hidden rounded-md border px-4 py-3 font-mono text-sm transition-all duration-500 break-all
      ${status === 'locked' 
        ? 'border-emerald-500/50 bg-emerald-900/10 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)]' 
        : 'border-slate-700 bg-slate-900 text-slate-500'}
    `}>
      {/* Label */}
      <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-widest opacity-70">
        <span>Transaction Hash</span>
        <span className={`h-2 w-2 rounded-full ${status === 'locked' ? 'bg-emerald-400' : 'bg-slate-600 animate-pulse'}`}></span>
      </div>

      {/* The Hash Code */}
      <div className="leading-tight tracking-wider">
        {isLocked ? displayText : "0x0000000000000000..."}
      </div>

      {/* Visual Decorator: The "Lock" Icon */}
      {status === 'locked' && (
        <div className="absolute right-0 top-0 -mr-4 -mt-4 h-16 w-16 rotate-12 bg-emerald-500/10 blur-xl" />
      )}
    </div>
  );
};

export default HashLock;