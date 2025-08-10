import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

const SESSION_COOKIE_NAME = "session";
const SESSION_EXPIRES_MS = 1000 * 60 * 60 * 24 * 5; // 5 días

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json().catch(() => ({}));
    if (!idToken)
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_MS,
    });
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

    const res = NextResponse.json({ uid: decoded.uid });
    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_EXPIRES_MS / 1000,
    });
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Auth error";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  const raw = req.headers.get("cookie") ?? "";
  const session = raw
    .split(";")
    .map((s: string) => s.trim())
    .find((c: string) => c.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.split("=")[1];
  if (session) {
    try {
      const decoded = await adminAuth.verifySessionCookie(session, true);
      await adminAuth.revokeRefreshTokens(decoded.sub);
    } catch {
      // ignore revoke errors
    }
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return res;
}
