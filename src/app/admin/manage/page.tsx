// src/app/admin/manage/page.tsx

import { createClient } from "../../../../lib/supabase";
import { checkIsSuperAdmin } from "../actions";
import { redirect } from "next/navigation";
import { Shield, UserPlus, Trash2, ArrowLeft, Mail, Fingerprint } from "lucide-react";
import Link from "next/link";
import { addAdmin, removeAdmin } from "./actions"; // Import our new actions

export default async function ManageAdminsPage() {
  // 🔒 Security Gate
  const isSuper = await checkIsSuperAdmin();
  if (!isSuper) redirect("/admin/dashboard");

  const supabase = await createClient();

  // Fetch all admins
  const { data: admins } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Shield className="text-purple-600 w-8 h-8" />
              Admin Management
            </h1>
            <p className="text-slate-500 mt-1">Manage system access and roles.</p>
          </div>
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm transition"
          >
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: Add New Admin Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-8">
              <h2 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <UserPlus size={20} className="text-emerald-600" />
                Add New Admin
              </h2>
              
              <form action={async (formData) => {
                "use server";
                await addAdmin(formData);
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                  <input name="name" placeholder="e.g. John Doe" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                  <input name="email" type="email" placeholder="john@university.edu" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Clerk User ID</label>
                  <input name="clerk_id" placeholder="user_2q..." required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-mono focus:ring-2 focus:ring-purple-500 outline-none" />
                  <p className="text-[10px] text-slate-400 mt-1">Copy this from the Clerk Dashboard.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                  <select name="role" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                    <option value="admin">Standard Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-900/10 mt-2">
                  Grant Access
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: List of Admins */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Active Administrators</h3>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-bold">
                  {admins?.length || 0} Users
                </span>
              </div>
              
              <div className="divide-y divide-slate-100">
                {admins?.map((admin: any) => (
                  <div key={admin.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${admin.role === 'super_admin' ? 'bg-purple-600' : 'bg-slate-400'}`}>
                        {admin.full_name?.charAt(0) || "A"}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {admin.full_name}
                          {admin.role === 'super_admin' && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                              SUPER ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 mt-1">
                          <span className="flex items-center gap-1"><Mail size={12} /> {admin.email}</span>
                          <span className="flex items-center gap-1 font-mono text-[10px] bg-slate-100 px-1 rounded"><Fingerprint size={12} /> {admin.clerk_user_id}</span>
                        </div>
                      </div>
                    </div>

                    <form action={async () => {
                      "use server";
                      await removeAdmin(admin.id);
                    }}>
                      <button 
                        className="text-slate-300 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition" 
                        title="Revoke Access"
                        // Prevent deleting yourself (optional safety check usually done in backend too)
                      >
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                ))}

                {(!admins || admins.length === 0) && (
                  <div className="p-8 text-center text-slate-400">
                    No admins found.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}