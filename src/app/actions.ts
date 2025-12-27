// src/app/actions.ts

"use server";

import { createClient } from "../../lib/supabase";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import SHA256 from "crypto-js/sha256";
import { encryptVote } from "../lib/crypto"; // Import our helper

export async function castVote(candidateId: string, positionId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Authentication required." };

  const supabase = await createClient();

  // 1. Check for Double Voting (Same as before)
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("user_id", userId)
    .eq("position_id", positionId)
    .single();

  if (existingVote) return { error: "You have already voted for this position." };

  // 2. FETCH PUBLIC KEY
  const { data: settings } = await supabase
    .from("election_settings")
    .select("public_key")
    .single();

  if (!settings?.public_key) {
    return { error: "Election system error: Encryption key missing." };
  }

  // 3. ENCRYPT THE VOTE 🔒
  // The database will NEVER see the real candidateId
  const encryptedCandidateId = encryptVote(candidateId, settings.public_key);

  // 4. Insert the ENCRYPTED Vote
  const { data: voteData, error: voteError } = await supabase
    .from("votes")
    .insert({
      user_id: userId,
      candidate_id: encryptedCandidateId, // <--- SAVING CIPHERTEXT
      position_id: positionId,
    })
    .select()
    .single();

  if (voteError) {
    if (voteError.code === "23505") return { error: "You have already voted for this position." };
    console.error("Vote Error:", voteError);
    return { error: `Vote Failed: ${voteError.message}` };
  }

  // 5. Generate Receipt Hash
  // We hash the CIPHERTEXT now. This proves "The encrypted blob is in the vault."
  const timestamp = new Date().toISOString();
  const rawString = `${userId}-${encryptedCandidateId}-${positionId}-${timestamp}`;
  const receiptHash = SHA256(rawString).toString();

  // 6. Save Receipt (Also encrypted candidate_id)
  await supabase.from("vote_receipts").insert({
    vote_id: voteData.id,
    user_id: userId,
    position_id: positionId,
    candidate_id: encryptedCandidateId, // Storing encrypted here too
    receipt_hash: receiptHash,
    created_at: timestamp
  });

  revalidatePath("/vote");
  revalidatePath("/admin/dashboard");
  
  return { success: true, receiptHash };
}