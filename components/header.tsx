"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Side */}
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          {description && <p className="text-sm text-white/50">{description}</p>}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Search..."
              className="w-64 pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-500/50"
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-white/50 hover:text-white hover:bg-white/5">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-[#14141f] border-white/10">
              <div className="p-4">
                <h3 className="font-semibold mb-3 text-white">Notifications</h3>
                <div className="space-y-3">
                  {[
                    { title: "New test available", desc: "Mathematics Entry Test 2024", time: "2 min ago" },
                    { title: "Score updated", desc: "Your analytics have been refreshed", time: "1 hour ago" },
                    { title: "New resource added", desc: "Past Papers - Computer Science", time: "3 hours ago" },
                  ].map((notif, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{notif.title}</p>
                        <p className="text-xs text-white/50 truncate">{notif.desc}</p>
                        <p className="text-xs text-white/30 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
