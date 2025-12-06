"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, signInWithPopup, signOut, sendEmailVerification } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, Mail } from "lucide-react"
import { getFirebaseAuth, getGoogleProvider } from "@/lib/firebase"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setNeedsVerification(false)
    setIsLoading(true)

    try {
      const auth = getFirebaseAuth()
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      // Check if email is verified
      if (!user.emailVerified) {
        // Sign out the user since email is not verified
        await signOut(auth)
        setNeedsVerification(true)
        setError("Please verify your email before signing in. Check your inbox for the verification link.")
        return
      }

      // Email is verified, proceed to dashboard
      router.push("/dashboard")
    } catch (err: unknown) {
      console.error(err)
      const message =
        err && typeof err === "object" && "message" in err && typeof (err as any).message === "string"
          ? (err as any).message
          : "Failed to sign in. Please check your credentials and try again."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResendingEmail(true)
    setError(null)

    try {
      const auth = getFirebaseAuth()
      // Try to sign in temporarily to get the user
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      if (!user.emailVerified) {
        await sendEmailVerification(user)
        setError(null)
        alert("Verification email sent! Please check your inbox.")
      }

      // Sign out after sending email
      await signOut(auth)
    } catch (err: unknown) {
      console.error(err)
      const message =
        err && typeof err === "object" && "message" in err && typeof (err as any).message === "string"
          ? (err as any).message
          : "Failed to resend verification email. Please try again."
      setError(message)
    } finally {
      setIsResendingEmail(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const auth = getFirebaseAuth()
      const provider = getGoogleProvider()
      await signInWithPopup(auth, provider)
      router.push("/dashboard")
    } catch (err: unknown) {
      console.error(err)
      const message =
        err && typeof err === "object" && "message" in err && typeof (err as any).message === "string"
          ? (err as any).message
          : "Google sign-in failed. Please try again."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/70">
          Email
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="h-12 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:ring-blue-500/20"
            required
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-white/70">
            Password
          </Label>
          <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="h-12 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:ring-blue-500/20"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={formData.rememberMe}
          onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
          className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
        />
        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-white/50">
          Remember me for 30 days
        </Label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="space-y-3">
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>
          {needsVerification && (
            <Button
              type="button"
              variant="outline"
              onClick={handleResendVerification}
              disabled={isResendingEmail || isLoading}
              className="w-full h-10 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
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
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
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
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0a0a12] px-2 text-white/30">Or continue with</span>
        </div>
      </div>

      {/* Social Login - Google only */}
      <div className="grid grid-cols-1">
        <Button
          variant="outline"
          type="button"
          className="h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all"
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
      <p className="text-center text-sm text-white/40">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Sign up
        </Link>
      </p>
    </form>
  )
}
