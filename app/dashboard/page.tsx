"use client"

import { DashboardHeader } from "@/components/header"
import { StatsCard } from "@/components/stats-card"
import { QuickActionCard } from "@/components/quick-action-card"
import { ActivityChart } from "@/components/activity-chart"
import { RecentActivity } from "@/components/recent-activity"
import { Bot, GraduationCap, BarChart3, FileText, Globe, Brain, Target, TrendingUp, Clock } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

export default function DashboardPage() {
  const { userData, loading } = useAuth()
  const userName = userData?.name || "User"
  const stats = [
    {
      title: "Tests Completed",
      value: 24,
      description: "This month",
      icon: GraduationCap,
      trend: { value: 12, isPositive: true },
      iconColor: "bg-emerald-500",
    },
    {
      title: "Average Score",
      value: "78%",
      description: "Across all tests",
      icon: Target,
      trend: { value: 5, isPositive: true },
      iconColor: "bg-blue-500",
    },
    {
      title: "Study Hours",
      value: 42,
      description: "This month",
      icon: Clock,
      trend: { value: 8, isPositive: true },
      iconColor: "bg-pink-500",
    },
    {
      title: "Admission Probability",
      value: "78%",
      description: "Based on analytics",
      icon: TrendingUp,
      trend: { value: 3, isPositive: true },
      iconColor: "bg-indigo-500",
    },
  ]

  const quickActions = [
    {
      title: "AI Chatbot",
      description: "Get instant answers to your questions",
      icon: Bot,
      href: "/dashboard/chatbot",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Practice Test",
      description: "Start a new test session",
      icon: GraduationCap,
      href: "/dashboard/test-practice",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Batch Advisor",
      description: "Get personalized batch recommendations",
      icon: Brain,
      href: "/dashboard/batch-advisor",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: "View Analytics",
      description: "Check your performance insights",
      icon: BarChart3,
      href: "/dashboard/analytics",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Resources",
      description: "Access study materials and past papers",
      icon: FileText,
      href: "/dashboard/resources",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      title: "360° Tour",
      description: "Explore FAST campus virtually",
      icon: Globe,
      href: "/dashboard/tour",
      gradient: "from-cyan-500 to-blue-500",
    },
  ]

  return (
    <div className="min-h-screen">
      <DashboardHeader title={`Welcome back, ${userName}!`} description="Here's what's happening with your preparation" />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityChart />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h2>
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
