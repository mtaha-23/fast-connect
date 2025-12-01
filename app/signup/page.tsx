import { AuthLayout } from "@/components/auth-layout"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <AuthLayout title="Create an account" description="Get started with FASTConnect today">
      <SignupForm />
    </AuthLayout>
  )
}
