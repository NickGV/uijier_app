import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
type DecodedIdToken = { uid: string; email?: string } & Record<string, unknown>;

export type AppRole = "ujier" | "directiva" | "admin";

export interface SessionUser {
  uid: string;
  email?: string;
  role: AppRole;
}

const SESSION_COOKIE_NAME = "session";

export async function getSessionCookie() {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSessionCookie();
  if (!session) return null;
  try {
    const decoded: DecodedIdToken = await adminAuth.verifySessionCookie(
      session,
      true
    );
    const maybeRole = (decoded as unknown as { role?: AppRole }).role;
    if (maybeRole) {
      return {
        uid: decoded.uid,
        email: decoded.email || undefined,
        role: maybeRole,
      };
    }
    const snap = await adminDb.collection("users").doc(decoded.uid).get();
    type UserDoc = { role?: AppRole };
    const data = (snap.exists ? (snap.data() as UserDoc) : undefined) || {};
    const role: AppRole = data.role ?? "ujier";
    return { uid: decoded.uid, email: decoded.email || undefined, role };
  } catch {
    return null;
  }
}

export function canAccess(
  role: AppRole,
  route: "conteo" | "simpatizantes" | "historial" | "ujieres" | "admin"
) {
  if (role === "admin") return true;
  if (role === "directiva") {
    return ["conteo", "simpatizantes", "historial", "ujieres"].includes(route);
  }
  if (role === "ujier") {
    return ["conteo", "simpatizantes"].includes(route);
  }
  return false;
}
