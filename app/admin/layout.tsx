import type React from "react"
import { Sidebar } from "@/components/admin-sidebar"
import { AuthGuard } from "@/lib/components/auth-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-[#0a0a12]">
        <Sidebar />
        <main className="pl-[260px] transition-all duration-300">{children}</main>
      </div>
    </AuthGuard>
  )
}
