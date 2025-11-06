import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  if (oauthError) {
    console.error("OAuth error:", oauthError, errorDescription);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    next = "/";
  }
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
    const {
      data: { user },
      error: UserError,
    } = await supabase.auth.getUser();
    if (UserError || !user) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
    const redirectPath: string = next;
    const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === "development";
    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${redirectPath}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
    } else {
      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}