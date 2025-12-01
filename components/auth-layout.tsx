"use client"

import type React from "react"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#0a0a12]">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12 relative">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">
              FAST<span className="text-blue-400">Connect</span>
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
            <p className="text-white/50 mt-2">{description}</p>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {/* Animated wave background */}
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="auth-wave" x1="0%" y1="0%" x2="100%" y2="0%">
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
                opacity={0.4 - i * 0.02}
                className="animate-wave"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </svg>
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse-glow" />
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />

        {/* Feature Card */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative w-full max-w-md">
            <div className="relative glass-card rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">FASTConnect</h3>
                  <p className="text-sm text-white/50">AI-Powered University Platform</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { icon: "🤖", text: "AI Chatbot for instant help" },
                  { icon: "📝", text: "Entry test practice & analytics" },
                  { icon: "🎓", text: "Smart batch recommendations" },
                  { icon: "🌐", text: "360° virtual campus tour" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm text-white/70">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-[#0a0a12]"
                    />
                  ))}
                </div>
                <div className="text-sm text-white/50">
                  <span className="text-white font-medium">50K+</span> students joined
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>
    </div>
  )
}
