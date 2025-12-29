// src/app/admin/manage/actions.ts

"use server";

import { createClient } from "../../../../lib/supabase";
import { checkIsSuperAdmin } from "../actions";
import { revalidatePath } from "next/cache";

// 1. ADD NEW ADMIN
export async function addAdmin(formData: FormData) {
  const isSuper = await checkIsSuperAdmin();
  if (!isSuper) return { error: "Unauthorized: Super Admin access required." };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const clerkId = formData.get("clerk_id") as string;
  const role = formData.get("role") as string; // 'admin' or 'super_admin'

  if (!name || !email || !clerkId) {
    return { error: "All fields are required." };
  }

  const supabase = await createClient();

  // Check if already exists
  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .eq("clerk_user_id", clerkId)
    .single();

  if (existing) {
    return { error: "This user is already an admin." };
  }

  const { error } = await supabase.from("admin_users").insert({
    full_name: name,
    email: email,
    clerk_user_id: clerkId,
    role: role || 'admin',
    is_active: true
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/manage");
  return { success: true };
}

// 2. REMOVE ADMIN
export async function removeAdmin(adminId: number) {
  const isSuper = await checkIsSuperAdmin();
  if (!isSuper) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { error } = await supabase
    .from("admin_users")
    .delete()
    .eq("id", adminId);

  if (error) return { error: error.message };

  revalidatePath("/admin/manage");
  return { success: true };
}