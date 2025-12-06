"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-12 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-primary/8 rounded-full blur-[80px]" />
        <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="auth-wave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A90E2" stopOpacity="0" />
              <stop offset="50%" stopColor="#4A90E2" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4A90E2" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="auth-wave-dark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(15)].map((_, i) => (
            <path
              key={i}
              d={`M-100 ${100 + i * 50} Q ${300} ${50 + i * 50 + Math.sin(i) * 30} ${700} ${100 + i * 50} T 1500 ${100 + i * 50}`}
              fill="none"
              stroke="url(#auth-wave)"
              strokeWidth="1"
              opacity={0.3 - i * 0.015}
              className="animate-wave dark:hidden"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
          {[...Array(15)].map((_, i) => (
            <path
              key={`dark-${i}`}
              d={`M-100 ${100 + i * 50} Q ${300} ${50 + i * 50 + Math.sin(i) * 30} ${700} ${100 + i * 50} T 1500 ${100 + i * 50}`}
              fill="none"
              stroke="url(#auth-wave-dark)"
              strokeWidth="1"
              opacity={0.4 - i * 0.02}
              className="animate-wave hidden dark:block"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/15 dark:bg-primary/20 rounded-full blur-[150px] animate-pulse-glow" />
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-primary/10 dark:bg-primary/15 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-10 justify-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-card backdrop-blur-sm border border-border flex items-center justify-center shadow-lg dark:shadow-black/20 overflow-hidden">
              <Image
                src="/logo.png"
                alt="FASTConnect Logo"
                width={48}
                height={48}
                className="object-contain p-1.5"
              />
            </div>
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg opacity-50 transition-opacity" />
          </div>
          <span className="text-3xl font-bold text-foreground">
            FAST<span className="text-primary">Connect</span>
          </span>
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>

        {/* Form Content */}
        <div className="bg-card/50 border border-border rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  )
}
