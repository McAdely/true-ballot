// lib/supabase.ts

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function createClient() {
  // 1. Get the current user's token from Clerk
  const { getToken } =  await auth();
  
  // 2. Ask for a token specifically for Supabase
  const token = await getToken({ template: "supabase" });

  // 3. Create a client that uses this token
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        // This header tells Supabase "I am this user"
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}