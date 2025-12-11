"use client"

/**
 * Login Form Component
 * Handles user authentication with email/password and Google sign-in
 */

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Mail } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  
  // State management for form and UI
  const [showPassword, setShowPassword] = useState(false) // Toggle password visibility
  const [isLoading, setIsLoading] = useState(false) // Loading state for form submission
  const [error, setError] = useState<string | null>(null) // Error message display
  const [needsVerification, setNeedsVerification] = useState(false) // Email verification required flag
  const [isResendingEmail, setIsResendingEmail] = useState(false) // Resend verification email loading state
  
  // Validation errors for individual fields
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  })
  
  // Form data state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return "Email is required"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    return ""
  }

  const validatePassword = (password: string): string => {
    if (!password) {
      return "Password is required"
    }
    return ""
  }

  /**
   * Handle form submission for email/password login
   * Validates email verification and redirects based on user role
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setNeedsVerification(false)

    // Validate all fields
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)

    setFieldErrors({
      email: emailError,
      password: passwordError,
    })

    // If there are validation errors, don't submit
    if (emailError || passwordError) {
      return
    }

    setIsLoading(true)

    try {
      // Sign in on client side - Firebase Auth needs to be on client
      const { signInWithEmail } = await import("@/lib/services/auth.service")
      const result = await signInWithEmail({
        email: formData.email,
        password: formData.password,
      })

      // Check if email is verified
      if (!result.emailVerified) {
        // Sign out the user since email is not verified
        const { signOutUser } = await import("@/lib/services/auth.service")
        await signOutUser()
        setNeedsVerification(true)
        setError("Please verify your email before signing in. Check your inbox for the verification link.")
        return
      }

      // Email is verified, redirect based on role
      // Use window.location for hard redirect to ensure auth state is checked
      if (result.role === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/dashboard"
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in. Please check your credentials and try again."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle resending email verification
   * Signs in temporarily to send verification email, then signs out
   */
  const handleResendVerification = async () => {
    setIsResendingEmail(true)
    setError(null)

    try {
      // For resend verification, we use the service directly since it needs to sign in temporarily
      // This could be moved to an API route if needed
      const { resendEmailVerification } = await import("@/lib/services/auth.service")
      await resendEmailVerification(formData.email, formData.password)
      setError(null)
      alert("Verification email sent! Please check your inbox.")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to resend verification email. Please try again."
      setError(message)
    } finally {
      setIsResendingEmail(false)
    }
  }

  /**
   * Handle Google OAuth sign-in
   * Opens popup for Google authentication and redirects based on role
   */
  const handleGoogleSignIn = async () => {
    setError(null)
    setIsLoading(true)

    try {
      // For Google sign-in, we use the service directly since it's client-side OAuth popup
      // This could be moved to an API route if needed
      const { signInWithGoogle } = await import("@/lib/services/auth.service")
      const result = await signInWithGoogle()
      // Redirect based on role - use window.location for hard redirect
      if (result.role === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/dashboard"
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Google sign-in failed. Please try again."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-muted-foreground">
          Email
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => {
              const value = e.target.value
              setFormData({ ...formData, email: value })
              // Clear error when user starts typing
              if (fieldErrors.email) {
                setFieldErrors({ ...fieldErrors, email: "" })
              }
            }}
            onBlur={(e) => {
              const error = validateEmail(e.target.value)
              setFieldErrors({ ...fieldErrors, email: error })
            }}
            className={`h-12 pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${
              fieldErrors.email ? "border-destructive focus:border-destructive" : ""
            }`}
            required
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        {fieldErrors.email && (
          <p className="text-sm text-destructive">{fieldErrors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-muted-foreground">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => {
              const value = e.target.value
              setFormData({ ...formData, password: value })
              // Clear error when user starts typing
              if (fieldErrors.password) {
                setFieldErrors({ ...fieldErrors, password: "" })
              }
            }}
            onBlur={(e) => {
              const error = validatePassword(e.target.value)
              setFieldErrors({ ...fieldErrors, password: error })
            }}
            className={`h-12 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${
              fieldErrors.password ? "border-destructive focus:border-destructive" : ""
            }`}
            required
          />
          {/* Password Visibility Toggle */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-sm text-destructive">{fieldErrors.password}</p>
        )}
        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
            Forgot password?
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="space-y-3">
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">{error}</p>
          {needsVerification && (
            <Button
              type="button"
              variant="outline"
              onClick={handleResendVerification}
              disabled={isResendingEmail || isLoading}
              className="w-full h-10 bg-card border-border text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary dark:hover:border-primary/50 hover:border-border"
            >
              {isResendingEmail ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 w-4 h-4" />
                  Resend Verification Email
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Social Login - Google only */}
      <div className="grid grid-cols-1">
        <Button
          variant="outline"
          type="button"
          className="h-12 bg-card border-border text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary dark:hover:border-primary/50 hover:border-border transition-all"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Sign up
        </Link>
      </p>
    </form>
  )
}
