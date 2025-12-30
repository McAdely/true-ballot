// src/app/admin/actions.ts

"use server";

import { createClient } from "../../../lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { triggerSecurityAlert } from "../../lib/security";


// ============================================
// 1. AUTHENTICATION CHECKS
// ============================================

export async function checkIsAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('is_admin', { user_clerk_id: userId });

  if (!data) {
    // 🚨 TRIGGER ALERT! User logged in but tried to access Admin area
    await triggerSecurityAlert("/admin", "LOW");
    return false;
  }
  return true;

  if (error) {
    console.error("Admin Check Error:", error);
    return false;
  }
  return !!data;
}

export async function checkIsSuperAdmin(): Promise<boolean> {

const isAdmin = await checkIsAdmin();
  if (!isAdmin) return false; // Alert already triggered above

  const supabase = await createClient();
  const { userId } = await auth();
  
  const { data, error } = await supabase.from("admin_users").select("role").eq("clerk_user_id", userId).single();
  
  if (data?.role !== 'super_admin') {
     // 🚨 TRIGGER ALERT! Regular Admin tried to access Super Admin area
     await triggerSecurityAlert("/admin/super-restricted", "HIGH");
     return false;
  }
  return true;

  if (error) return false;
  return !!data;
}

export async function getCurrentAdmin() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("admin_users")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  return data;
}

// ============================================
// 2. ELECTION MANAGEMENT (The Missing Parts)
// ============================================

export async function addPosition(formData: FormData) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized: You are not an admin." };

  const title = formData.get("title") as string;
  if (!title) return { error: "Title is required" };

  const supabase = await createClient();
  const { error } = await supabase.from("positions").insert({ title });
  
  if (error) return { error: error.message };
  
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/candidates");
  revalidatePath("/vote");
  return { success: true };
}

export async function addCandidate(formData: FormData) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized: You are not an admin." };

  const name = formData.get("name") as string;
  const position_id = formData.get("position_id") as string;
  const manifesto = formData.get("manifesto") as string;
  const photo_url = formData.get("photo_url") as string;
  
  const supabase = await createClient();
  const { error } = await supabase.from("candidates").insert({
    name,
    position_id,
    manifesto,
    photo_url: photo_url || "https://placehold.co/400?text=No+Photo" 
  });

  if (error) return { error: error.message };
  
  revalidatePath("/admin/dashboard");
  revalidatePath("/vote");
  return { success: true };
}

export async function updateElectionStatus(status: 'not_started' | 'open' | 'closed') {
  const isSuper = await checkIsSuperAdmin();
  if (!isSuper) return { error: "Unauthorized: You are not a super admin." };

  const supabase = await createClient();
  const { error } = await supabase
    .from('election_settings')
    .update({ status })
    .eq('id', 1);

  if (error) return { error: error.message };
  
  revalidatePath("/vote");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// ============================================
// 3. ADMIN USER MANAGEMENT (Super Admin Only)
// ============================================

export async function getAllAdmins() {
  const isSuperAdmin = await checkIsSuperAdmin();
  if (!isSuperAdmin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}

export async function addAdmin(formData: FormData) {
  const isSuperAdmin = await checkIsSuperAdmin();
  if (!isSuperAdmin) return { error: "Unauthorized" };

  const { userId: currentAdminId } = await auth();
  const clerkUserId = formData.get("clerk_user_id") as string;
  const email = formData.get("email") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as "admin" | "super_admin";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      clerk_user_id: clerkUserId,
      email,
      full_name: fullName,
      role: role || "admin",
      created_by: currentAdminId,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/admin/manage");
  return { success: true, data };
}

export async function removeAdmin(adminId: string) {
  const isSuperAdmin = await checkIsSuperAdmin();
  if (!isSuperAdmin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("admin_users").update({ is_active: false }).eq("id", adminId);

  if (error) return { error: error.message };
  revalidatePath("/admin/manage");
  return { success: true };
}