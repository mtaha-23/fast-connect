/**
 * Forgot Password API Route
 * Handles password reset email requests
 */

import { NextRequest, NextResponse } from "next/server"
import { sendPasswordResetEmail } from "@/lib/services/auth.service"

/**
 * POST /api/auth/forgot-password
 * Send password reset email to user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email input
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required." },
        { status: 400 }
      )
    }

    // Send password reset email
    await sendPasswordResetEmail(email)

    // Always return success to prevent email enumeration
    return NextResponse.json(
      {
        success: true,
        message: "If an account exists with this email, a password reset link has been sent.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    
    // Return generic error message to prevent email enumeration
    return NextResponse.json(
      {
        error: "If an account exists with this email, a password reset link has been sent.",
      },
      { status: 200 } // Return 200 even on error to prevent enumeration
    )
  }
}


