import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAnonClient } from "@/lib/supabase/admin-auth";

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

  if (!code) {
    redirectUrl.pathname = "/renter/login";
    redirectUrl.search = `?error=${encodeURIComponent("Link di conferma non valido o scaduto.")}`;
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = createSupabaseAnonClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirectUrl.pathname = "/renter/login";
    redirectUrl.search = `?error=${encodeURIComponent("Link di conferma non valido o scaduto.")}`;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect(redirectUrl);
}
