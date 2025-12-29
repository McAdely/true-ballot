// src/components/NavBar.tsx

import Link from "next/link";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"; // Import Auth components
import { LayoutDashboard, Key, Lock, Users, Vote, FileText, LogIn } from "lucide-react";
import { checkIsAdmin, checkIsSuperAdmin } from "../app/admin/actions";

export default async function NavBar() {
  const isAdmin = await checkIsAdmin();
  const isSuper = await checkIsSuperAdmin();

  return (
    <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 border-b border-slate-800 shadow-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-bold text-xl flex items-center gap-2 hover:opacity-90 transition">
          <div className="bg-emerald-500 p-1.5 rounded">
            <Vote className="text-slate-900 w-5 h-5" />
          </div>
          <span className="hidden md:block">True Ballot</span>
        </Link>

        {/* Links Container */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mx-4">
          
          {/* VOTER LINKS (Visible to everyone) */}
          <NavLink href="/vote" icon={<Vote size={16} />} label="Vote" />
          <NavLink href="/receipts" icon={<FileText size={16} />} label="Receipts" />
          
          {/* ADMIN LINKS */}
          {isAdmin && (
            <div className="flex items-center gap-1 border-l border-slate-700 pl-2 ml-2">
              <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={16} />} label="Dash" highlight />
            </div>
          )}

          {/* SUPER ADMIN LINKS */}
          {isSuper && (
            <>
              <NavLink href="/admin/manage" icon={<Users size={16} />} label="Team" />
              <NavLink href="/admin/ceremony" icon={<Key size={16} />} label="Keys" danger />
              <NavLink href="/admin/tally" icon={<Lock size={16} />} label="Tally" danger />
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="shrink-0">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          
          <SignedOut>
            {/* Custom Sign In Button for the Nav Bar */}
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition border border-slate-700">
                <LogIn size={16} /> Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

// Helper Component remains the same...
function NavLink({ href, icon, label, highlight, danger }: any) {
  const baseClass = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap";
  const colorClass = danger 
    ? "text-red-400 hover:bg-red-950/50 hover:text-red-200" 
    : highlight 
      ? "text-purple-400 hover:bg-purple-950/50 hover:text-purple-200" 
      : "text-slate-400 hover:bg-slate-800 hover:text-white";

  return (
    <Link href={href} className={`${baseClass} ${colorClass}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}