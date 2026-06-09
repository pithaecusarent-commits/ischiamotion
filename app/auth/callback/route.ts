import { NextRequest, NextResponse } from "next/server";
import { adminAccessTokenCookie, adminRefreshTokenCookie, createSupabaseAnonClient } from "@/lib/supabase/admin-auth";
import { renterAccessTokenCookie, renterRefreshTokenCookie } from "@/lib/supabase/renter-auth";

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/renter/login";
  }

  return value;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));
  const redirectUrl = new URL(nextPath, requestUrl.origin);
  const authError = requestUrl.searchParams.get("error_description") || requestUrl.searchParams.get("error");

  if (authError) {
    redirectUrl.pathname = "/renter/login";
    redirectUrl.search = `?error=${encodeURIComponent("Link di conferma non valido o scaduto.")}`;
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    if (nextPath === "/renter/login") {
      redirectUrl.search = "?confirmed=1";
    } else {
      redirectUrl.pathname = "/renter/login";
      redirectUrl.search = `?error=${encodeURIComponent("Link di conferma non valido o scaduto.")}`;
    }
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    if (nextPath === "/renter/login") {
      redirectUrl.search = "?confirmed=1";
    } else {
      redirectUrl.pathname = "/renter/login";
      redirectUrl.search = `?error=${encodeURIComponent("Link di conferma non valido o scaduto.")}`;
    }
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.redirect(redirectUrl);
  const isAdminPath = nextPath.startsWith("/admin");
  const accessCookie = isAdminPath ? adminAccessTokenCookie : renterAccessTokenCookie;
  const refreshCookie = isAdminPath ? adminRefreshTokenCookie : renterRefreshTokenCookie;

  if (data.session?.access_token && data.session.refresh_token) {
    response.cookies.set(accessCookie, data.session.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8
    });
    response.cookies.set(refreshCookie, data.session.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });
  }

  return response;
}
