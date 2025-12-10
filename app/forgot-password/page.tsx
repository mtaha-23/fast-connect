/**
 * Forgot Password Page
 * Allows users to request a password reset email
 */

import { AuthLayout } from "@/components/auth-layout"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { GuestGuard } from "@/lib/components/guest-guard"

export default function ForgotPasswordPage() {
  return (
    <GuestGuard>
      <AuthLayout 
        title="Reset your password" 
        description="Enter your email address and we'll send you a link to reset your password"
      >
        <ForgotPasswordForm />
      </AuthLayout>
    </GuestGuard>
  )
}

