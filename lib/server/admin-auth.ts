import "server-only"

import { NextRequest } from "next/server"
import { getAdminAuth, getAdminDB } from "@/lib/firebase-admin"

export type AdminUser = {
  uid: string
  name: string
  email: string
  emailVerified: boolean
  role?: "admin" | "student" | string
  photoURL?: string | null
  createdAt?: string
  updatedAt?: string
  disabled?: boolean
  deactivatedAt?: string | null
}

function getBearerToken(req: NextRequest) {
  const header = req.headers.get("authorization") || req.headers.get("Authorization")
  if (!header) return null
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1] ?? null
}

export async function requireAdmin(req: NextRequest) {
  const token = getBearerToken(req)
  if (!token) {
    return { ok: false as const, status: 401 as const, error: "Missing Authorization header." }
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token)
    const uid = decoded.uid

    const userSnap = await getAdminDB().collection("users").doc(uid).get()
    const user = (userSnap.exists ? (userSnap.data() as { role?: string }) : null) ?? null
    if (!user || user.role !== "admin") {
      return { ok: false as const, status: 403 as const, error: "Admin access required." }
    }

    return { ok: true as const, uid }
  } catch (e) {
    return {
      ok: false as const,
      status: 401 as const,
      error: e instanceof Error ? e.message : "Invalid token.",
    }
  }
}

