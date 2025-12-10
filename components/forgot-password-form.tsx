"use client"

/**
 * Forgot Password Form Component
 * Handles password reset email requests
 */

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ForgotPasswordForm() {
  // State management
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  /**
   * Handle form submission
   * Sends password reset email via API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send password reset email")
      }

      // Show success message
      setSuccess(true)
      setEmail("") // Clear email field
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send password reset email. Please try again."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {success && (
        <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
          <CardContent className="flex items-start gap-3 py-4">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Password reset email sent!
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                If an account exists with this email, you'll receive a password reset link shortly. 
                Please check your inbox and spam folder.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardContent className="py-3">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-muted-foreground">
          Email address
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
            required
            disabled={isLoading || success}
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">
          Enter the email address associated with your account
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
        disabled={isLoading || success}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Sending reset link...
          </>
        ) : success ? (
          <>
            <CheckCircle className="mr-2 w-4 h-4" />
            Email sent!
          </>
        ) : (
          <>
            <Mail className="mr-2 w-4 h-4" />
            Send reset link
          </>
        )}
      </Button>

      {/* Back to Login Link */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    </form>
  )
}

