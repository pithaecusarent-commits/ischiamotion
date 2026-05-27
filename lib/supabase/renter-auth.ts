import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAnonClient, createSupabaseUserClient } from "@/lib/supabase/admin-auth";

export const renterAccessTokenCookie = "im_renter_access_token";
export const renterRefreshTokenCookie = "im_renter_refresh_token";

export type RenterProfile = {
  id: string;
  email: string | null;
  role: "admin" | "renter";
  account_status: "pending" | "approved" | "rejected";
};

export function setRenterSessionCookies(accessToken: string, refreshToken: string) {
  const cookieStore = cookies();

  cookieStore.set(renterAccessTokenCookie, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  cookieStore.set(renterRefreshTokenCookie, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export function clearRenterSessionCookies() {
  const cookieStore = cookies();
  cookieStore.delete(renterAccessTokenCookie);
  cookieStore.delete(renterRefreshTokenCookie);
}

export async function getRenterSession() {
  const accessToken = cookies().get(renterAccessTokenCookie)?.value;

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
    .maybeSingle<RenterProfile>();

  return {
    accessToken,
    user: userData.user,
    profile: profile || null
  };
}

export async function requireRenter(nextPath = "/renter") {
  const session = await getRenterSession();

  if (!session.accessToken || !session.user) {
    redirect(`/renter/login?next=${encodeURIComponent(nextPath)}`);
  }

  if (session.profile?.role !== "renter" || session.profile.account_status !== "approved") {
    return {
      ...session,
      accessToken: session.accessToken,
      user: session.user,
      profile: session.profile,
      denied: true
    };
  }

  return {
    ...session,
    accessToken: session.accessToken,
    user: session.user,
    profile: session.profile,
    denied: false
  };
}

export async function signInRenterWithPassword(input: {
  email: string;
  password: string;
}) {
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase.auth.signInWithPassword(input);

  if (error || !data.session || !data.user) {
    return {
      session: null,
      user: null,
      error: error?.message || "Credenziali non valide."
    };
  }

  const userClient = createSupabaseUserClient(data.session.access_token);
  const { data: profile, error: profileError } = await userClient
    .from("profiles")
    .select("role, account_status")
    .eq("id", data.user.id)
    .maybeSingle<{ role: "admin" | "renter"; account_status: "pending" | "approved" | "rejected" }>();

  if (profileError || profile?.role !== "renter") {
    return {
      session: null,
      user: null,
      error: "Accesso noleggiatore non autorizzato."
    };
  }

  if (profile.account_status === "pending") {
    return {
      session: null,
      user: null,
      error: "Registrazione ricevuta. Attendi l'autorizzazione dell'admin IschiaMotion."
    };
  }

  if (profile.account_status === "rejected") {
    return {
      session: null,
      user: null,
      error: "Registrazione non autorizzata. Contatta IschiaMotion."
    };
  }

  return {
    session: data.session,
    user: data.user,
    error: null
  };
}
