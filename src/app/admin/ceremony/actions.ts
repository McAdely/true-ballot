// src/app/admin/ceremony/actions.ts

"use server";

import { createClient } from "../../../../lib/supabase";
import { generateElectionKeys, shardPrivateKey } from "../../../lib/crypto";
import { checkIsAdmin } from "../actions";
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function generateAndEmailShards(custodians: any[]) {
  // 1. Auth Check
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  // 2. Validate Inputs
  if (custodians.some(c => !c.email || !c.name)) {
    return { error: "All custodians must have names and emails." };
  }

  // 3. Generate Crypto Keys
  const keys = generateElectionKeys();

  // 4. Save PUBLIC Key to DB
  const supabase = await createClient();
  const { error } = await supabase
    .from("election_settings")
    .update({ public_key: keys.publicKey })
    .eq("id", 1);

  if (error) return { error: "DB Error: " + error.message };

  // 5. Shard PRIVATE Key
  const shards = shardPrivateKey(keys.privateKey);
  const shardList = [shards.part1, shards.part2, shards.part3];

  // 6. Send Emails 📧
  try {
    // Send to Custodian 1
    await sendShardEmail(custodians[0], shardList[0], "A");
    // Send to Custodian 2
    await sendShardEmail(custodians[1], shardList[1], "B");
    // Send to Custodian 3
    await sendShardEmail(custodians[2], shardList[2], "C");
  } catch (e: any) {
    return { error: "Email failed: " + e.message };
  }

  return { success: true };
}

// Helper: Send a single email
async function sendShardEmail(recipient: any, shardParams: string, shardLabel: string) {
  await resend.emails.send({
    from: 'True Ballot Security <security@resend.dev>', // Use your domain in production
    to: recipient.email,
    subject: `🔐 URGENT: Election Key Shard ${shardLabel} - ${recipient.title}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">Election Security Protocol</h2>
        <p>Hello <strong>${recipient.name}</strong>,</p>
        <p>You have been designated as <strong>${recipient.role}</strong> (${recipient.title}) for the upcoming election.</p>
        <p>Below is your unique <strong>Private Key Shard</strong>. This is 1 of 3 parts required to decrypt the election results.</p>
        
        <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all; margin: 20px 0; border: 1px solid #cbd5e1;">
          ${shardParams}
        </div>

        <p style="color: #dc2626; font-weight: bold;">⚠️ DO NOT SHARE THIS.</p>
        <p>Keep this email safe. You will be required to copy the code above into the Tally Room when the election concludes.</p>
        <hr/>
        <p style="font-size: 12px; color: #666;">True Ballot Secure System</p>
      </div>
    `
  });
}