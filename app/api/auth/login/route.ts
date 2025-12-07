import { NextRequest, NextResponse } from "next/server"
import { signInWithEmail } from "@/lib/services/auth.service"
import type { LoginData } from "@/lib/services/auth.service"

/**
 * POST /api/auth/login
 * Sign in with email and password
 */
export async function POST(request: NextRequest) {
  try {
    const body: LoginData = await request.json()

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      )
    }

    const result = await signInWithEmail(body)

    if (!result.emailVerified) {
      return NextResponse.json(
        {
          error: "Please verify your email before signing in. Check your inbox for the verification link.",
          emailVerified: false,
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Signed in successfully.",
        user: {
          uid: result.user.uid,
          email: result.user.email,
          emailVerified: result.emailVerified,
          role: result.role,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to sign in.",
      },
      { status: 500 }
    )
  }
}

