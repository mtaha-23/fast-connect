"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, FileText, MessageSquare, TrendingUp, ArrowUp, Activity, Bell } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"
import { cn } from "@/lib/utils"

const userActivityData = [
  { name: "Mon", users: 1200 },
  { name: "Tue", users: 1400 },
  { name: "Wed", users: 1100 },
  { name: "Thu", users: 1600 },
  { name: "Fri", users: 1800 },
  { name: "Sat", users: 2100 },
  { name: "Sun", users: 1900 },
]

const resourceDownloads = [
  { name: "Past Papers", downloads: 450 },
  { name: "Study Guides", downloads: 320 },
  { name: "Notes", downloads: 280 },
  { name: "Documents", downloads: 180 },
]

const recentUsers = [
  { name: "Ahmed Khan", email: "ahmed@example.com", date: "2 min ago", status: "active" },
  { name: "Sara Ali", email: "sara@example.com", date: "15 min ago", status: "active" },
  { name: "Usman Malik", email: "usman@example.com", date: "1 hour ago", status: "pending" },
  { name: "Fatima Noor", email: "fatima@example.com", date: "2 hours ago", status: "active" },
]

const systemStatus = [
  { name: "API Server", status: "operational", uptime: "99.9%" },
  { name: "Database", status: "operational", uptime: "99.8%" },
  { name: "Auth Service", status: "operational", uptime: "100%" },
  { name: "File Storage", status: "degraded", uptime: "98.5%" },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between h-16 px-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
            <p className="text-sm text-white/50">System overview and management</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              <Badge className="ml-2 bg-red-500 border-0">3</Badge>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Total Users", value: "12,847", change: "+12%", icon: Users, color: "bg-blue-500" },
            { title: "Active Posts", value: "156", change: "+8", icon: MessageSquare, color: "bg-emerald-500" },
            { title: "Resources", value: "89", sub: "23.5K downloads", icon: FileText, color: "bg-pink-500" },
            { title: "Tests Taken", value: "8,432", change: "+24%", icon: TrendingUp, color: "bg-indigo-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  {stat.change && (
                    <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                      <ArrowUp className="w-3 h-3" />
                      {stat.change} this month
                    </p>
                  )}
                  {stat.sub && <p className="text-sm text-white/40 mt-1">{stat.sub}</p>}
                </div>
                <div className={cn("p-3 rounded-xl", stat.color)}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Activity Chart */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-white">User Activity</h3>
              <p className="text-sm text-white/40">Daily active users this week</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userActivityData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#14141f",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resource Downloads */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-white">Resource Downloads</h3>
              <p className="text-sm text-white/40">Downloads by category this week</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceDownloads} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#14141f",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="downloads" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg text-white">Recent Registrations</h3>
                <p className="text-sm text-white/40">New users who joined recently</p>
              </div>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Avatar className="border border-white/10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-white/40">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        user.status === "active"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }
                    >
                      {user.status}
                    </Badge>
                    <span className="text-sm text-white/30">{user.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-white">System Status</h3>
              <p className="text-sm text-white/40">Service health monitoring</p>
            </div>
            <div className="space-y-3">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        service.status === "operational" ? "bg-emerald-500" : "bg-yellow-500",
                      )}
                    />
                    <span className="font-medium text-sm text-white">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={cn(
                        service.status === "operational"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-yellow-500/20 text-yellow-400",
                      )}
                    >
                      {service.status}
                    </Badge>
                    <p className="text-xs text-white/30 mt-1">{service.uptime} uptime</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4 bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Activity className="w-4 h-4 mr-2" />
              View Full Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
