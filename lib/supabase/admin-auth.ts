import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const adminAccessTokenCookie = "im_admin_access_token";
export const adminRefreshTokenCookie = "im_admin_refresh_token";

type AdminProfile = {
  id: string;
  email: string | null;
  role: "admin" | "renter";
  account_status: "pending" | "approved" | "rejected";
};

function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase public environment variables.");
  }

  return { supabaseUrl, supabaseAnonKey };
}

export function createSupabaseAnonClient() {
  const env = getSupabaseEnv();

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function createSupabaseUserClient(accessToken: string) {
  const env = getSupabaseEnv();

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}

export function setAdminSessionCookies(accessToken: string, refreshToken: string) {
  const cookieStore = cookies();

  cookieStore.set(adminAccessTokenCookie, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  cookieStore.set(adminRefreshTokenCookie, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export function clearAdminSessionCookies() {
  const cookieStore = cookies();
  cookieStore.delete(adminAccessTokenCookie);
  cookieStore.delete(adminRefreshTokenCookie);
}

export async function getAdminSession() {
  const accessToken = cookies().get(adminAccessTokenCookie)?.value;

  if (!accessToken) {
    return { accessToken: null, user: null, profile: null };
  }

  const supabase = createSupabaseUserClient(accessToken);
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

  if (userError || !userData.user) {
    return { accessToken: null, user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role, account_status")
    .eq("id", userData.user.id)
    .maybeSingle<AdminProfile>();

  return {
    accessToken,
    user: userData.user,
    profile: profile || null
  };
}

export async function requireAdmin(nextPath = "/admin") {
  const session = await getAdminSession();

  if (!session.accessToken || !session.user) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }

  if (session.profile?.role !== "admin" || session.profile.account_status !== "approved") {
    redirect(`/admin/login?error=${encodeURIComponent("Admin access required")}`);
  }

  return session as typeof session & {
    accessToken: string;
    user: NonNullable<typeof session.user>;
    profile: AdminProfile;
  };
}
