// src/app/admin/tally/actions.ts

"use server";

import { createClient } from "../../../../lib/supabase";
import { revalidatePath } from "next/cache";
import { checkIsAdmin, getCurrentAdmin } from "../actions";
import { reassemblePrivateKey, decryptVote } from "../../../lib/crypto";

// 1. THE ALARM: Log that someone entered the Tally Room
export async function logTallyAccess() {
  const admin = await getCurrentAdmin();
  if (!admin) return;

  const supabase = await createClient();
  
  // Log critical event
  await supabase.from("admin_audit_log").insert({
    admin_clerk_id: admin.clerk_user_id,
    action: "CRITICAL_TALLY_ACCESS",
    resource_type: "election_results",
    details: { warning: "Attempting to decrypt election results" }
  });
  
  // In a real app, you would trigger an SMS/Email alert here using Twilio/Resend
  console.log("🚨 ALARM TRIGGERED: Tally Room Accessed by " + admin.email);
}

// 2. THE COUNTING ENGINE: Decrypts votes in memory
export async function decryptAndTally(shard1: string, shard2: string, shard3: string) {
  // A. Security Check
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized access detected." };

  // B. Reconstruct the Private Key
  // If the shards are wrong, this string will be junk and decryption will fail.
  const privateKey = reassemblePrivateKey(shard1, shard2, shard3);

  const supabase = await createClient();

  // C. Fetch Encrypted Votes
  const { data: votes } = await supabase
    .from("votes")
    .select("candidate_id, position_id");

  if (!votes || votes.length === 0) return { error: "No votes found to tally." };

  // D. Fetch Candidates/Positions for names
  const { data: candidates } = await supabase.from("candidates").select("id, name, position_id");
  const { data: positions } = await supabase.from("positions").select("id, title");

  // E. THE DECRYPTION LOOP 🔓
  // We count in memory. We NEVER save the decrypted choice back to the DB.
  const results: Record<string, number> = {}; // { "CandidateName": 10 }
  const errors = [];

  try {
    for (const vote of votes) {
      try {
        // Attempt to decrypt
        const decryptedCandidateId = decryptVote(vote.candidate_id, privateKey);
        
        // Find the name
        const candidate = candidates?.find(c => c.id === decryptedCandidateId);
        if (candidate) {
          // Add to total
          const key = `${candidate.name} (${positions?.find(p => p.id === candidate.position_id)?.title})`;
          results[key] = (results[key] || 0) + 1;
        }
      } catch (e) {
        // If decryption fails, the key shards were probably wrong
        continue;
      }
    }
  } catch (e) {
    return { error: "Decryption Failed. Are you sure these are the correct key shards?" };
  }

  // F. Log the Successful Count
  await supabase.from("admin_audit_log").insert({
    action: "TALLY_COMPLETED",
    details: { success: true }
  });

  return { success: true, results };
}