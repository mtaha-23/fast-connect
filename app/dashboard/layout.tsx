import type React from "react"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <Sidebar />
      <main className="pl-[260px] transition-all duration-300">{children}</main>
    </div>
  )
}
