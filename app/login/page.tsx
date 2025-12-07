import { AuthLayout } from "@/components/auth-layout"
import { LoginForm } from "@/components/login-form"
import { GuestGuard } from "@/lib/components/guest-guard"

export default function LoginPage() {
  return (
    <GuestGuard>
      <AuthLayout title="Welcome back" description="Sign in to your FASTConnect account to continue">
        <LoginForm />
      </AuthLayout>
    </GuestGuard>
  )
}
