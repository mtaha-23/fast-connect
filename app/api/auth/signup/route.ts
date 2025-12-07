import { NextRequest, NextResponse } from "next/server"
import { signUpWithEmail } from "@/lib/services/auth.service"
import type { SignupData } from "@/lib/services/auth.service"

/**
 * POST /api/auth/signup
 * Create a new user account
 */
export async function POST(request: NextRequest) {
  try {
    const body: SignupData = await request.json()

    // Validate input
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, and name are required." },
        { status: 400 }
      )
    }

    // Validate password match (if confirmPassword is provided)
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      )
    }

    const result = await signUpWithEmail(body)

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please verify your email.",
        user: {
          uid: result.user.uid,
          email: result.user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create account.",
      },
      { status: 500 }
    )
  }
}

