import "server-only";

import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";

const bucketName = "vehicle-images";
const maxImageSize = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);

export async function uploadVehicleImage(file: File, accessToken: string): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error("Nessuna immagine selezionata.");
  }

  const extension = allowedTypes.get(file.type);

  if (!extension) {
    throw new Error("Formato immagine non valido. Carica JPG, PNG o WebP.");
  }

  if (file.size > maxImageSize) {
    throw new Error("Immagine troppo grande. Dimensione massima 5 MB.");
  }

  const supabase = createSupabaseUserClient(accessToken);
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "vehicle";
  const path = `${Date.now()}-${safeName}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    throw new Error(`Upload immagine non riuscito: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);

  return data.publicUrl;
}
