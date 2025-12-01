"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Powered by Advanced AI Technology</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">New</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-balance leading-[1.1]">
            <span className="text-white">Your Gateway to</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 animate-gradient-x">
              FAST University
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
            Prepare for admissions with AI-powered test practice, get personalized guidance, explore campus virtually,
            and connect with the FAST community.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup">
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 px-8 h-14 text-base rounded-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="px-8 h-14 text-base rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <Play className="mr-2 w-5 h-5 fill-current" />
                Watch Demo
              </Button>
            </Link>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-2xl" />
            <div className="relative glass-card rounded-2xl overflow-hidden border border-white/10">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-white/40 ml-2 font-mono">fastconnect ~ assistant</span>
              </div>
              {/* Terminal content */}
              <div className="p-6 font-mono text-sm text-left">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-blue-400">→</span>
                  <span className="text-white/80">What programs does FAST University offer?</span>
                </div>
                <div className="flex items-start gap-3 pl-6 text-white/50">
                  <span className="text-green-400">AI:</span>
                  <div className="space-y-1">
                    <p>FAST-NUCES offers undergraduate programs in:</p>
                    <p className="text-blue-400">• Computer Science (BS-CS)</p>
                    <p className="text-blue-400">• Software Engineering (BS-SE)</p>
                    <p className="text-blue-400">• Artificial Intelligence (BS-AI)</p>
                    <p className="text-blue-400">• Data Science (BS-DS)</p>
                    <p className="text-white/30">+ 8 more programs...</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                  <div className="w-2 h-4 bg-blue-400 animate-pulse" />
                  <span className="text-white/30">Ask me anything...</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-white/5">
            {[
              { value: "50K+", label: "Active Students" },
              { value: "95%", label: "Success Rate" },
              { value: "10K+", label: "Practice Tests" },
              { value: "24/7", label: "AI Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-3xl sm:text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
