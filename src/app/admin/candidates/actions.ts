// src/app/admin/candidates/actions.ts

"use server";

import { createClient } from "../../../../lib/supabase";
import { checkIsAdmin } from "../actions";
import { revalidatePath } from "next/cache";

// 1. CREATE CANDIDATE (With Image Upload)
export async function createCandidate(formData: FormData) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const positionId = formData.get("position_id") as string;
  const manifesto = formData.get("manifesto") as string;
  const imageFile = formData.get("image") as File; // Capture the file

  if (!name || !positionId || !imageFile) {
    return { error: "Name, Position, and Image are required." };
  }

  const supabase = await createClient();

  // A. Upload Image to Supabase Storage
  // We create a unique filename: timestamp-filename
  const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
  
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from("candidates") // Ensure this bucket exists!
    .upload(fileName, imageFile, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error("Upload Error:", uploadError);
    return { error: "Failed to upload image. Check bucket permissions." };
  }

  // B. Get the Public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from("candidates")
    .getPublicUrl(fileName);

  // C. Save Candidate to DB
  const { error: dbError } = await supabase
    .from("candidates")
    .insert({
      name,
      position_id: positionId,
      manifesto,
      photo_url: publicUrl // Save the new Supabase URL
    });

  if (dbError) return { error: dbError.message };

  revalidatePath("/admin/candidates");
  revalidatePath("/vote");
  return { success: true };
}

// UPDATE CANDIDATE
export async function updateCandidate(formData: FormData) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const manifesto = formData.get("manifesto") as string;
  // We get the old URL just in case no new file is uploaded
  const currentPhotoUrl = formData.get("current_photo_url") as string;
  // Grab the potential new file
  const newImageFile = formData.get("new_image") as File | null;

  let finalPhotoUrl = currentPhotoUrl;

  const supabase = await createClient();

  // 1. Check if a NEW image was selected
  // We check size > 0 to ensure it's an actual file upload
  if (newImageFile && newImageFile.size > 0 && newImageFile.name && newImageFile.name !== "undefined") {
     console.log("Attempting to upload replacement image...");

     // A. Generate unique filename
     const fileName = `${Date.now()}-update-${newImageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;

     // B. Upload to Supabase Storage
     const { error: uploadError } = await supabase
       .storage
       .from("candidates")
       .upload(fileName, newImageFile, {
         cacheControl: '3600',
         upsert: false
       });

     if (uploadError) {
       console.error("Upload Error:", uploadError);
       return { error: "Failed to upload new image. Check permissions." };
     }

     // C. Get new Public URL
     const { data: { publicUrl } } = supabase
       .storage
       .from("candidates")
       .getPublicUrl(fileName);
     
     // Update the variable that will be saved to DB
     finalPhotoUrl = publicUrl;
     console.log("New image uploaded successfully:", finalPhotoUrl);
  }

  // 2. Update Database Record
  const { error: dbError } = await supabase
    .from("candidates")
    .update({ 
      name, 
      manifesto, 
      photo_url: finalPhotoUrl // Will be the new URL if uploaded, or remain the old one
    })
    .eq("id", id);

  if (dbError) return { error: dbError.message };

  revalidatePath("/admin/candidates");
  revalidatePath("/vote"); 
  return { success: true };
}

// DELETE CANDIDATE
export async function deleteCandidate(candidateId: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { error } = await supabase
    .from("candidates")
    .delete()
    .eq("id", candidateId);

  if (error) return { error: error.message };

  revalidatePath("/admin/candidates");
  return { success: true };
}