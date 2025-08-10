import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminAuth } from '@/src/lib/firebase-admin'

const SESSION_COOKIE_NAME = 'session'
const SESSION_EXPIRES_MS = 1000 * 60 * 60 * 24 * 5 // 5 días

export async function POST(req: Request) {
  const { idToken } = await req.json().catch(() => ({}))
  if (!idToken) return NextResponse.json({ error: 'Missing idToken' }, { status: 400 })

  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_MS })
  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)

  cookies().set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_EXPIRES_MS / 1000,
  })

  return NextResponse.json({ uid: decoded.uid })
}

export async function DELETE() {
  const cookieStore = cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (session) {
    try {
      const decoded = await adminAuth.verifySessionCookie(session, true)
      await adminAuth.revokeRefreshTokens(decoded.sub)
    } catch {
      // ignorar si ya no es válida
    }
  }
  cookieStore.delete(SESSION_COOKIE_NAME)
  return NextResponse.json({ ok: true })
}
