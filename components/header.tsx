"use client"

import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between min-h-14 sm:h-16 py-2 sm:py-0 pl-14 pr-4 md:px-6">
        {/* Left Side */}
        <div className="min-w-0 pr-2">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">{title}</h1>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
    </header>
  )
}
