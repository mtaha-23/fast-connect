"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, Mail, User } from "lucide-react"
import { OTPModal } from "./otp-modal"

export function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Validation errors for individual fields
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  // Validation functions
  const validateName = (name: string): string => {
    if (!name.trim()) {
      return "Full name is required"
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters"
    }
    if (name.trim().length > 100) {
      return "Name must be less than 100 characters"
    }
    return ""
  }

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
    if (password.length < 6) {
      return "Password must be at least 6 characters"
    }
    if (!/[a-zA-Z]/.test(password)) {
      return "Password must contain at least one letter"
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number"
    }
    return ""
  }

  const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    if (!confirmPassword) {
      return "Please confirm your password"
    }
    if (confirmPassword !== password) {
      return "Passwords do not match"
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate all fields
    const nameError = validateName(formData.name)
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password)

    setFieldErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    })

    // If there are validation errors, don't submit
    if (nameError || emailError || passwordError || confirmPasswordError) {
      return
    }

    // Check terms acceptance
    if (!formData.acceptTerms) {
      setError("You must accept the Terms of Service and Privacy Policy to continue.")
      return
    }

    setIsLoading(true)

    try {
      // Call API route - backend logic is in app/api/auth/signup/route.ts
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "student", // Default role - admins are set manually
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account")
      }

      // Show verification modal after successful signup
      setShowOTP(true)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create account. Please try again."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError(null)
    setIsLoading(true)

    try {
      // For Google signup, we still use the service directly since it's client-side OAuth
      // This could be moved to an API route if needed
      const { signInWithGoogle } = await import("@/lib/services/auth.service")
      const result = await signInWithGoogle(formData.name)
      // Redirect based on role (Google signup defaults to student)
      if (result.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Google sign-up failed. Please try again."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value
                setFormData({ ...formData, name: value })
                // Clear error when user starts typing
                if (fieldErrors.name) {
                  setFieldErrors({ ...fieldErrors, name: "" })
                }
              }}
              onBlur={(e) => {
                const error = validateName(e.target.value)
                setFieldErrors({ ...fieldErrors, name: error })
              }}
              className={`h-11 pl-10 ${fieldErrors.name ? "border-destructive focus:border-destructive" : ""}`}
              required
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          {fieldErrors.name && (
            <p className="text-sm text-destructive">{fieldErrors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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
              className={`h-11 pl-10 ${fieldErrors.email ? "border-destructive focus:border-destructive" : ""}`}
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password (min 6 chars, letter + number)"
              value={formData.password}
              onChange={(e) => {
                const value = e.target.value
                setFormData({ ...formData, password: value })
                // Clear errors when user starts typing
                if (fieldErrors.password) {
                  setFieldErrors({ ...fieldErrors, password: "" })
                }
                // Re-validate confirm password if it has a value
                if (formData.confirmPassword) {
                  const confirmError = validateConfirmPassword(formData.confirmPassword, value)
                  setFieldErrors({ ...fieldErrors, password: "", confirmPassword: confirmError })
                }
              }}
              onBlur={(e) => {
                const error = validatePassword(e.target.value)
                setFieldErrors({ ...fieldErrors, password: error })
                // Also re-validate confirm password
                if (formData.confirmPassword) {
                  const confirmError = validateConfirmPassword(formData.confirmPassword, e.target.value)
                  setFieldErrors((prev) => ({ ...prev, password: error, confirmPassword: confirmError }))
                }
              }}
              className={`h-11 pr-10 ${fieldErrors.password ? "border-destructive focus:border-destructive" : ""}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-sm text-destructive">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => {
                const value = e.target.value
                setFormData({ ...formData, confirmPassword: value })
                // Clear error when user starts typing
                if (fieldErrors.confirmPassword) {
                  setFieldErrors({ ...fieldErrors, confirmPassword: "" })
                }
              }}
              onBlur={(e) => {
                const error = validateConfirmPassword(e.target.value, formData.password)
                setFieldErrors({ ...fieldErrors, confirmPassword: error })
              }}
              className={`h-11 pr-10 ${fieldErrors.confirmPassword ? "border-destructive focus:border-destructive" : ""}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-sm text-destructive">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-tight">
            I agree to the{" "}
            <Link href="#" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}

        {/* Submit Button */}
        <Button type="submit" className="w-full h-11" disabled={isLoading || !formData.acceptTerms}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
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

        {/* Social Signup - Google only */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11"
          onClick={handleGoogleSignUp}
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
          Continue with Google
        </Button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>

      {/* OTP Modal */}
      <OTPModal open={showOTP} onOpenChange={setShowOTP} email={formData.email} />
    </>
  )
}
