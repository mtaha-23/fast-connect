"use server"

/**
 * Server Actions for Authentication
 * These run on the server side
 */

import { signUpWithEmail, signInWithEmail, signInWithGoogle, resendEmailVerification } from "@/lib/services/auth.service"
import type { SignupData, LoginData } from "@/lib/services/auth.service"

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Server Action: Sign up with email
 */
export async function signUpAction(data: SignupData): Promise<ActionResult<{ email: string }>> {
  try {
    const result = await signUpWithEmail(data)
    return {
      success: true,
      data: { email: result.user.email || data.email },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create account.",
    }
  }
}

/**
 * Server Action: Sign in with email
 */
export async function signInAction(data: LoginData): Promise<ActionResult<{ emailVerified: boolean }>> {
  try {
    const result = await signInWithEmail(data)
    
    if (!result.emailVerified) {
      // Sign out if email not verified
      const { signOutUser } = await import("@/lib/services/auth.service")
      await signOutUser()
      
      return {
        success: false,
        error: "Please verify your email before signing in. Check your inbox for the verification link.",
        data: { emailVerified: false },
      }
    }
    
    return {
      success: true,
      data: { emailVerified: true },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign in.",
    }
  }
}

/**
 * Server Action: Resend verification email
 */
export async function resendVerificationAction(email: string, password: string): Promise<ActionResult> {
  try {
    await resendEmailVerification(email, password)
    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to resend verification email.",
    }
  }
}

