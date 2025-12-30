// src/app/admin/manage/actions.ts

"use server";

import { createClient } from "../../../../lib/supabase";
import { checkIsSuperAdmin } from "../actions";
import { revalidatePath } from "next/cache";
import { createClerkClient } from "@clerk/nextjs/server"; // Import Clerk Backend

// Initialize Clerk Backend Client
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// 1. ADD NEW ADMIN (By Email)
export async function addAdmin(formData: FormData) {
  const isSuper = await checkIsSuperAdmin();
  if (!isSuper) return { error: "Unauthorized: Super Admin access required." };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  // const clerkId = formData.get("clerk_id") as string; // REMOVED
  const role = formData.get("role") as string;

  if (!name || !email) {
    return { error: "Name and Email are required." };
  }

  try {
    // 🔍 LOOKUP USER BY EMAIL IN CLERK
    const userList = await clerk.users.getUserList({
      emailAddress: [email],
    });

    if (userList.data.length === 0) {
      return { error: "User not found! Ask them to create a student account first." };
    }

    // Get the User ID from the result
    const clerkId = userList.data[0].id;

    const supabase = await createClient();

    // Check if already exists in Supabase
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
      clerk_user_id: clerkId, // Use the ID found via API
      role: role || 'admin',
      is_active: true
    });

    if (error) return { error: error.message };

    revalidatePath("/admin/manage");
    return { success: true };

  } catch (err) {
    console.error("Clerk Lookup Error:", err);
    return { error: "Failed to verify email with Clerk. Check API keys." };
  }
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
// 3. RESET ELECTION FOR NEW SESSION
export async function resetElectionForNewSession() {
  // 1. Double Security Check
  const isSuper = await checkIsSuperAdmin();
  if (!isSuper) return { error: "Unauthorized" };

  const supabase = await createClient();

  // 2. The "Nuclear" Option - Wipes transactional data but KEEPS Admins
  // We use multiple calls because RLS might block a single huge transaction depending on setup
  
  // A. Wipe Votes & Receipts
  const { error: voteError } = await supabase.from("votes").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all
  const { error: receiptError } = await supabase.from("vote_receipts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  
  // B. Wipe Candidates & Positions (Optional: You might want to keep positions, but usually they change)
  const { error: candError } = await supabase.from("candidates").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error: posError } = await supabase.from("positions").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const {error: adminError} = await supabase.from("admin_users").delete().eq("role", "admin");

  // C. Reset Status
  const { error: statusError } = await supabase
    .from("election_settings")
    .update({ status: "not_started" })
    .eq("id", 1);

  if (voteError || receiptError || candError || posError || statusError) {
    console.error("Reset Error", { voteError, receiptError, candError });
    return { error: "Partial failure during reset. Check database logs." };
  }

  revalidatePath("/");
  return { success: true };
}