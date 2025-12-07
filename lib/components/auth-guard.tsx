"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import type { UserRole } from "@/lib/services/auth.service"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

/**
 * AuthGuard Component
 * Protects routes by checking authentication, email verification, and role
 */
export function AuthGuard({ children, requiredRole, redirectTo = "/login" }: AuthGuardProps) {
  const { user, userData, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return // Wait for auth state to load

    // Check if user is logged in
    if (!user) {
      router.push(redirectTo)
      return
    }

    // Check if email is verified
    if (!user.emailVerified) {
      router.push("/login?error=email-not-verified")
      return
    }

    // Wait for userData to load before checking role
    if (!userData) return

    // Check role if required
    if (requiredRole && userData.role !== requiredRole) {
      // Redirect based on user's actual role
      if (userData.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
      return
    }
  }, [user, userData, loading, requiredRole, redirectTo, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show loading while user data is being fetched
  if (user && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    )
  }

  // Check if user is logged in
  if (!user) {
    return null // Will redirect in useEffect
  }

  // Check if email is verified
  if (!user.emailVerified) {
    return null // Will redirect in useEffect
  }

  // Check role after user data is loaded
  if (requiredRole && userData && userData.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

