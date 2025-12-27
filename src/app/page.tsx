// src/app/page.tsx

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Vote } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-500/10 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-white/50 backdrop-blur-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-50 p-4 rounded-2xl shadow-inner">
            <Vote className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
          True Ballot
        </h1>
        <p className="text-slate-500 mb-8 text-lg">
          Secure, digital university voting.
        </p>

        {/* If Logged Out: Show Sign In */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all transform hover:scale-[1.02]">
              Sign In with University ID
            </button>
          </SignInButton>
        </SignedOut>

        {/* If Logged In: Show "Go to Vote" */}
        <SignedIn>
          <Link href="/vote">
             <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
               Go to Voting Booth
             </button>
          </Link>
        </SignedIn>
      </div>
    </div>
  );
}