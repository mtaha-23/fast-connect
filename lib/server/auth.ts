import "server-only"

import { NextRequest } from "next/server"

function getBearerToken(req: NextRequest) {
  const header = req.headers.get("authorization") || req.headers.get("Authorization")
  if (!header) return null
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1] ?? null
}

/**
 * Verify a Firebase ID token using the Identity Toolkit REST API.
 * Uses NEXT_PUBLIC_FIREBASE_API_KEY — no service account required.
 */
export async function verifyFirebaseIdToken(idToken: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY.")
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  )

  const data = (await response.json().catch(() => ({}))) as {
    users?: { localId?: string; email?: string }[]
    error?: { message?: string }
  }

  if (!response.ok) {
    throw new Error(data.error?.message || "Invalid or expired token.")
  }

  const uid = data.users?.[0]?.localId
  if (!uid) {
    throw new Error("Invalid token.")
  }

  return {
    uid,
    email: data.users?.[0]?.email,
  }
}

export async function requireAuth(req: NextRequest) {
  const token = getBearerToken(req)
  if (!token) {
    return { ok: false as const, status: 401 as const, error: "Missing Authorization header." }
  }

  try {
    const user = await verifyFirebaseIdToken(token)
    return { ok: true as const, uid: user.uid, email: user.email }
  } catch (e) {
    return {
      ok: false as const,
      status: 401 as const,
      error: e instanceof Error ? e.message : "Invalid token.",
    }
  }
}
