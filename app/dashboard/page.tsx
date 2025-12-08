"use client"

import { DashboardHeader } from "@/components/header"
import { QuickActionCard } from "@/components/quick-action-card"
import { Bot, GraduationCap, Brain } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

export default function DashboardPage() {
  const { userData, loading } = useAuth()
  const userName = userData?.name || "User"

  const quickActions = [
    {
      title: "AI Chatbot",
      description: "Get answers fast and plan your next steps",
      icon: Bot,
      href: "/dashboard/chatbot",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Practice Test",
      description: "Start a focused practice session right away",
      icon: GraduationCap,
      href: "/dashboard/test-practice",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Batch Advisor",
      description: "See personalized recommendations for your batch",
      icon: Brain,
      href: "/dashboard/batch-advisor",
      gradient: "from-orange-500 to-amber-500",
    },
  ]

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={`Welcome back, ${userName}!`}
        description="Quick links to keep you moving—no clutter, just what matters."
      />

      <div className="p-6 space-y-6">


        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
