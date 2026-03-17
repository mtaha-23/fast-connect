import { NextRequest, NextResponse } from "next/server"
import { getAdminAuth, getAdminDB } from "@/lib/firebase-admin"
import { requireAdmin, type AdminUser } from "@/lib/server/admin-auth"

/**
 * GET /api/admin/users
 * Admin-only: list users (Firestore + Auth disabled flag).
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status })

  try {
    const url = new URL(req.url)
    const q = (url.searchParams.get("q") ?? "").trim().toLowerCase()
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? "50"), 1), 200)

    const snap = await getAdminDB().collection("users").limit(limit).get()

    // Many projects store uid as the document id (not as a field). Ensure it's always present.
    const firestoreUsers = snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<AdminUser, "uid">) }) as AdminUser)

    const auth = getAdminAuth()
    const authLookups = await Promise.all(
      firestoreUsers.map(async (u) => {
        try {
          const au = await auth.getUser(u.uid)
          return { uid: u.uid, disabled: au.disabled ?? false }
        } catch {
          return { uid: u.uid, disabled: u.disabled ?? false }
        }
      }),
    )

    const disabledByUid = new Map(authLookups.map((x) => [x.uid, x.disabled]))

    const merged = firestoreUsers.map((u) => ({
      ...u,
      disabled: disabledByUid.get(u.uid) ?? (u.disabled ?? false),
    }))

    const filtered = q
      ? merged.filter((u) => (u.name ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q))
      : merged

    return NextResponse.json({ users: filtered }, { status: 200 })
  } catch (e) {
    console.error("Admin list users error:", e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to list users." },
      { status: 500 },
    )
  }
}

