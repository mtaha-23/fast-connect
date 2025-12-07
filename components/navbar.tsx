"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LayoutDashboard } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/hooks/use-auth"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  
  // Only show dashboard if user is logged in AND email is verified
  const canAccessDashboard = user && user.emailVerified

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "/about", label: "About Us" },
  ]

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-background/80 dark:bg-[#0a0a12]/80 backdrop-blur-xl border-b border-border" 
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-card backdrop-blur-sm border border-border flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg dark:shadow-black/20 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="FASTConnect Logo"
                  width={40}
                  height={40}
                  className="object-contain p-1.5"
                />
              </div>
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground">
                FAST<span className="text-primary">Connect</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            {canAccessDashboard ? (
              <Link href="/dashboard">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary px-5">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary px-5">
                  Sign in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background/95 dark:bg-[#0a0a12]/95 backdrop-blur-xl border-b border-border">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-border">
              {canAccessDashboard ? (
                <Link href="/dashboard" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary"
                  >
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
