import "server-only";

import { createSupabaseUserClient, getAdminSession } from "@/lib/supabase/admin-auth";

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

export async function deleteVehicleImageByPublicUrl(imageUrl: string | null | undefined): Promise<void> {
  const path = getVehicleImagePathFromPublicUrl(imageUrl);

  if (!path) {
    return;
  }

  try {
    const session = await getAdminSession();

    if (!session.accessToken || session.profile?.role !== "admin") {
      return;
    }

    const supabase = createSupabaseUserClient(session.accessToken);
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error && process.env.NODE_ENV === "development") {
      console.warn(`Vehicle image cleanup failed: ${error.message}`);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Vehicle image cleanup failed:", error);
    }
  }
}

function getVehicleImagePathFromPublicUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) return "";

  try {
    const parsedUrl = new URL(imageUrl);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && parsedUrl.origin !== new URL(supabaseUrl).origin) {
      return "";
    }

    const marker = `/storage/v1/object/public/${bucketName}/`;
    const markerIndex = parsedUrl.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return "";
    }

    const path = parsedUrl.pathname.slice(markerIndex + marker.length);
    return path ? decodeURIComponent(path) : "";
  } catch {
    return "";
  }
}
