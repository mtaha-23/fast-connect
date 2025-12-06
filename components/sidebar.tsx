"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Bot,
  GraduationCap,
  BarChart3,
  FileText,
  Globe,
  Users,
  Brain,
  Home,
  Settings,
  LogOut,
  ChevronLeft,
  User,
  Bell,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "AI Chatbot",
    href: "/dashboard/chatbot",
    icon: Bot,
  },
  {
    title: "Test Practice",
    href: "/dashboard/test-practice",
    icon: GraduationCap,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Batch Advisor",
    href: "/dashboard/batch-advisor",
    icon: Brain,
  },
  {
    title: "Resources",
    href: "/dashboard/resources",
    icon: FileText,
  },
  {
    title: "360° Tour",
    href: "/dashboard/tour",
    icon: Globe,
  },
  {
    title: "Social Feed",
    href: "/dashboard/feed",
    icon: Users,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-white/5 bg-[#0c0c14] transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[260px]",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
          <Link
            href="/dashboard"
            className={cn("flex items-center gap-3 transition-opacity", isCollapsed && "opacity-0")}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-[#0a0a12]/90 backdrop-blur-sm border border-white/10 flex items-center justify-center shrink-0 shadow-lg shadow-black/20 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="FASTConnect Logo"
                  width={36}
                  height={36}
                  className="object-contain p-1"
                />
              </div>
              <div className="absolute inset-0 rounded-xl bg-[#0a0a12]/30 blur-lg opacity-50 transition-opacity" />
            </div>
            <span className="font-bold text-lg whitespace-nowrap text-white">
              FAST<span className="text-blue-400">Connect</span>
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-white/50 hover:text-white hover:bg-white/5"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white border border-blue-500/30"
                    : "text-white/50 hover:text-white hover:bg-white/5",
                  isCollapsed && "justify-center px-2",
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-blue-400")} />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/5 p-3 space-y-2">
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              "hover:bg-white/5 text-white/50 hover:text-white",
              isCollapsed && "justify-center px-2",
            )}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all hover:bg-white/5",
                  isCollapsed && "justify-center px-2",
                )}
              >
                <Avatar className="w-8 h-8 shrink-0 border border-white/10">
                  <AvatarImage src="/diverse-avatars.png" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                    JD
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white">John Doe</p>
                    <p className="text-xs text-white/40 truncate">john@example.com</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#14141f] border-white/10">
              <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/5">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/5">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  )
}
