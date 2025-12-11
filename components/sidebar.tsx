"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { signOutUser } from "@/lib/services/auth.service"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import {
  Bot,
  GraduationCap,
  FileText,
  Globe,
  Users,
  Brain,
  Home,
  LogOut,
  ChevronLeft,
  LayoutDashboard,
  Moon,
  Sun,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
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

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[260px]",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className={cn("flex h-16 items-center border-b border-border px-4 relative", isCollapsed ? "justify-center" : "justify-between")}>
          <Link
            href="/"
            className={cn("flex items-center gap-3", isCollapsed && "justify-center")}
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
            <span className={cn(
              "font-bold text-lg whitespace-nowrap text-sidebar-foreground transition-opacity duration-300",
              isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}>
              FAST<span className="text-primary">Connect</span>
            </span>
          </Link>

          {/* Collapse button - moves to sidebar edge when collapsed */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary transition-all duration-300",
              isCollapsed 
                ? "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-50 bg-sidebar border border-border rounded-full shadow-lg hover:bg-accent dark:hover:bg-primary/30" 
                : "relative"
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform duration-300", isCollapsed && "rotate-180")} />
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
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              "hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary text-muted-foreground hover:text-foreground",
              isCollapsed && "justify-center px-2",
            )}
            disabled={!mounted}
            aria-label="Toggle theme"
          >
            {mounted ? (
              <>
                <div className="relative w-5 h-5 shrink-0">
                  <Sun className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </div>
                {!isCollapsed && <span>Theme</span>}
              </>
            ) : (
              <>
                <Sun className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>Theme</span>}
              </>
            )}
          </button>

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
