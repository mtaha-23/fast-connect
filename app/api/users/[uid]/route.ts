import { NextRequest, NextResponse } from "next/server"
import { getUserProfile, updateUserProfile } from "@/lib/services/user.service"

/**
 * GET /api/users/[uid]
 * Get user profile by UID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      )
    }

    const userProfile = await getUserProfile(uid)

    if (!userProfile) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: userProfile,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch user profile.",
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/users/[uid]
 * Update user profile
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params
    const body = await request.json()

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      )
    }

    await updateUserProfile(uid, body)

    return NextResponse.json(
      {
        success: true,
        message: "User profile updated successfully.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update user profile.",
      },
      { status: 500 }
    )
  }
}

