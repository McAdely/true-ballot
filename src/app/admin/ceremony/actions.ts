"use server";

import { createClient } from "../../../../lib/supabase";
import { generateElectionKeys } from "../../../lib/crypto";
import { checkIsAdmin } from "../actions";

export async function savePublicKey() {
  // 1. Auth Check
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  // 2. Generate Keys
  const keys = generateElectionKeys();

  // 3. Save ONLY Public Key to DB
  const supabase = await createClient();
  const { error } = await supabase
    .from("election_settings")
    .update({ public_key: keys.publicKey }) // Only saving public!
    .eq("id", 1);

  if (error) return { error: error.message };

  // 4. Return Private Key to Client (Only for the download step)
  // It is NOT saved anywhere on the server.
  return { success: true, privateKey: keys.privateKey };
}