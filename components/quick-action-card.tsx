import Link from "next/link"
import { cn } from "@/lib/utils"
import { type LucideIcon, ArrowRight } from "lucide-react"

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  gradient: string
}

export function QuickActionCard({ title, description, icon: Icon, href, gradient }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "group relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 transition-all duration-300",
          "hover:-translate-y-1 hover:border-blue-500/30 overflow-hidden",
        )}
      >
        {/* Background Gradient on Hover */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
            "bg-gradient-to-br",
            gradient,
          )}
        />

        <div className="relative">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg",
              "bg-gradient-to-br",
              gradient,
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>

          <h3 className="font-semibold text-lg mb-1 text-white">{title}</h3>
          <p className="text-sm text-white/40 mb-4">{description}</p>

          <div className="flex items-center text-sm font-medium text-blue-400">
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
