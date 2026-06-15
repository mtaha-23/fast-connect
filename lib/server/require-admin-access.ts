import "server-only"

import { doc, getDoc } from "firebase/firestore"
import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/server/auth"
import { requireAdmin } from "@/lib/server/admin-auth"
import { getFirestoreDB } from "@/lib/firebase"

/**
 * Admin gate for routes that must work with or without Firebase Admin credentials.
 * Tries Admin SDK first; falls back to REST token verification + Firestore role check.
 */
export async function requireAdminAccess(req: NextRequest) {
  try {
    const adminGuard = await requireAdmin(req)
    if (adminGuard.ok) return adminGuard
    if (adminGuard.status === 403) return adminGuard
  } catch {
    // Admin SDK not configured — fall through to client Firestore role check.
  }

  const authGuard = await requireAuth(req)
  if (!authGuard.ok) return authGuard

  const db = getFirestoreDB()
  const snap = await getDoc(doc(db, "users", authGuard.uid))
  const role = snap.data()?.role

  if (role !== "admin") {
    return { ok: false as const, status: 403 as const, error: "Admin access required." }
  }

  return { ok: true as const, uid: authGuard.uid, email: authGuard.email }
}
