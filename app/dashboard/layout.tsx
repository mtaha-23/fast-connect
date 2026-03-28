import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { AuthGuard } from "@/lib/components/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="student">
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="min-w-0 w-full pl-0 md:pl-[260px] transition-all duration-300">{children}</main>
      </div>
    </AuthGuard>
  )
}
