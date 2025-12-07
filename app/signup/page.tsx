import { AuthLayout } from "@/components/auth-layout"
import { SignupForm } from "@/components/signup-form"
import { GuestGuard } from "@/lib/components/guest-guard"

export default function SignupPage() {
  return (
    <GuestGuard>
      <AuthLayout title="Create an account" description="Get started with FASTConnect today">
        <SignupForm />
      </AuthLayout>
    </GuestGuard>
  )
}
