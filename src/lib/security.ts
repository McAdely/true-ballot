// src/lib/security.ts

"use server";

import { createClient } from "../../lib/supabase"; // Adjust path to your supabase client
import { Resend } from 'resend';
import { currentUser } from "@clerk/nextjs/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function triggerSecurityAlert(path: string, severity: 'LOW' | 'HIGH') {
  const user = await currentUser();
  const supabase = await createClient();
  
  const email = user?.emailAddresses[0]?.emailAddress || "Unknown User";
  const id = user?.id || "Anonymous";

  // 1. Log to Database
  await supabase.from("admin_audit_log").insert({
    action: "UNAUTHORIZED_ACCESS_ATTEMPT",
    admin_clerk_id: id,
    resource_type: path,
    details: { severity, email }
  });

  // 2. Send Email Alert
  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: 'True Ballot Security <security@resend.dev>',
        to: 'YOUR_PERSONAL_EMAIL@gmail.com', // HARDCODE YOUR EMAIL HERE FOR TESTING
        subject: `🚨 Security Alert: Unauthorized Access to ${path}`,
        html: `
          <div style="font-family: monospace; padding: 20px; background: #fff0f0; border: 1px solid red;">
            <h2 style="color: #dc2626;">Intrusion Attempt Detected</h2>
            <p><strong>User:</strong> ${email} (${id})</p>
            <p><strong>Target:</strong> ${path}</p>
            <p><strong>Severity:</strong> ${severity}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `
      });
    } catch (e) {
      console.error("Failed to send alert email", e);
    }
  }
}