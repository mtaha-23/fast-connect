import { AuthLayout } from "@/components/auth-layout"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" description="Sign in to your FASTConnect account to continue">
      <LoginForm />
    </AuthLayout>
  )
}
