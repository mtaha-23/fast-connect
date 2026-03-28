import { NextRequest, NextResponse } from "next/server"
import { getAdminAuth, getAdminDB } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/server/admin-auth"

/**
 * PATCH /api/admin/users/[uid]
 * Admin-only: deactivate/reactivate user (Auth disabled + Firestore flags).
 *
 * Body: { disabled: boolean }
 *
 * Role changes are done from the admin UI via Firestore (users.role), same as other profile fields.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  const guard = await requireAdmin(req)
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status })

  const { uid } = await params
  if (!uid) return NextResponse.json({ error: "User ID is required." }, { status: 400 })

  try {
    const body = (await req.json()) as { disabled?: boolean }

    if (body.disabled !== undefined) {
      const disabled = Boolean(body.disabled)

      await getAdminAuth().updateUser(uid, { disabled })

      const now = new Date().toISOString()
      await getAdminDB()
        .collection("users")
        .doc(uid)
        .set(
          {
            disabled,
            deactivatedAt: disabled ? now : null,
            updatedAt: now,
          },
          { merge: true },
        )

      return NextResponse.json(
        { success: true, message: disabled ? "User deactivated." : "User reactivated." },
        { status: 200 },
      )
    }

    return NextResponse.json({ error: "Provide 'disabled'." }, { status: 400 })
  } catch (e) {
    console.error("Admin update user error:", e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update user." },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/admin/users/[uid]
 * Admin-only: deletes Firebase Auth user and their Firestore profile doc.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  const guard = await requireAdmin(req)
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status })

  const { uid } = await params
  if (!uid) return NextResponse.json({ error: "User ID is required." }, { status: 400 })

  try {
    // Delete auth user first so they can't sign in.
    await getAdminAuth().deleteUser(uid)
    // Then delete profile doc (best-effort).
    await getAdminDB().collection("users").doc(uid).delete()

    return NextResponse.json({ success: true, message: "User deleted." }, { status: 200 })
  } catch (e) {
    console.error("Admin delete user error:", e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete user." },
      { status: 500 },
    )
  }
}

