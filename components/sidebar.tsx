"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { signOutUser } from "@/lib/services/auth.service"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Bot,
  GraduationCap,
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
  LayoutDashboard,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/hooks/use-auth"

const navItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
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
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { userData } = useAuth()
  
  // Get user display info
  const userName = userData?.name || "User"
  const userEmail = userData?.email || ""
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  const handleLogout = async () => {
    try {
      await signOutUser()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[260px]",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link
            href="/dashboard"
            className={cn("flex items-center gap-3 transition-opacity", isCollapsed && "opacity-0")}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-card backdrop-blur-sm border border-border flex items-center justify-center shrink-0 shadow-lg dark:shadow-black/20 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="FASTConnect Logo"
                  width={36}
                  height={36}
                  className="object-contain p-1"
                />
              </div>
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg opacity-50 transition-opacity" />
            </div>
            <span className="font-bold text-lg whitespace-nowrap text-sidebar-foreground">
              FAST<span className="text-primary">Connect</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed && "rotate-180")} />
            </Button>
          </div>
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
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary",
                  isCollapsed && "justify-center px-2",
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3 space-y-2">
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              "hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary text-muted-foreground hover:text-foreground",
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
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary",
                  isCollapsed && "justify-center px-2",
                )}
              >
                <Avatar className="w-8 h-8 shrink-0 border border-border">
                  <AvatarImage src={userData?.photoURL || "/diverse-avatars.png"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
              <DropdownMenuItem className="text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
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
