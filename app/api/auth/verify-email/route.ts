import { NextRequest, NextResponse } from "next/server"
import { resendEmailVerification } from "@/lib/services/auth.service"

/**
 * POST /api/auth/verify-email
 * Resend email verification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      )
    }

    await resendEmailVerification(email, password)

    return NextResponse.json(
      {
        success: true,
        message: "Verification email sent! Please check your inbox.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to resend verification email.",
      },
      { status: 500 }
    )
  }
}

