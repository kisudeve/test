import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database";

type UsersRow = Database["public"]["Tables"]["users"]["Row"];
type UsersInsert = Database["public"]["Tables"]["users"]["Insert"];
type UsersLite = Pick<UsersRow, "id" | "display_name" | "bio">;

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
  if (!next.startsWith("/")) next = "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();

  const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeErr) {
    console.error("exchangeCodeForSession error:", exchangeErr);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    console.error("getUser error:", userErr);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const authId: UsersRow["id"] = user.id;
  const email: UsersRow["email"] = typeof user.email === "string" ? user.email : "";
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const avatar: UsersRow["image_url"] =
    typeof meta.avatar_url === "string" ? meta.avatar_url : null;
  const nameFromProvider: UsersRow["display_name"] = typeof meta.name === "string" ? meta.name : "";

  const { data: existingRaw, error: selErr } = await supabase
    .from("users")
    .select("id, display_name, bio")
    .eq("id", authId)
    .maybeSingle();

  if (selErr) console.error("select users error:", selErr);

  const existing = (existingRaw ?? null) as UsersLite | null;

  if (!existing) {
    const payload: UsersInsert = {
      id: authId,
      email,
      image_url: avatar,
      display_name: nameFromProvider,
      bio: null,
    };
    const { error: insErr } = await supabase.from("users").insert(payload);
    if (insErr) {
      console.error("insert users error:", insErr);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  }

  const { data: profileRaw, error: profErr } = await supabase
    .from("users")
    .select("id, display_name, bio")
    .eq("id", authId)
    .single();

  if (profErr) {
    console.error("reselect users error:", profErr);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const profile = profileRaw as UsersLite;
  const needOnboarding = !profile.display_name || !profile.bio;
  const redirectPath = needOnboarding ? "/onboarding" : next;

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocal = process.env.NODE_ENV === "development";

  if (isLocal) return NextResponse.redirect(`https://test-pied-psi.vercel.app${redirectPath}`);
  if (forwardedHost) return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
  return NextResponse.redirect(`${origin}${redirectPath}`);
}
