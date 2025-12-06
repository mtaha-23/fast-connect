"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-5xl mx-auto">
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-balance leading-[1.1]">
            <span className="text-foreground">Your Gateway to</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/80 animate-gradient-x">
              FAST University
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
            Prepare for admissions with AI-powered test practice, get personalized guidance, explore campus virtually,
            and connect with the FAST community.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup">
              <Button
                size="lg"
                className="relative bg-primary hover:bg-primary/90 text-primary-foreground border-0 px-8 h-14 text-base rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="px-8 h-14 text-base rounded-xl bg-card/50 border-border text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary dark:hover:border-primary/50 hover:border-border transition-all duration-300"
              >
                <Play className="mr-2 w-5 h-5 fill-current" />
                Watch Demo
              </Button>
            </Link>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-2xl" />
            <div className="relative glass-card rounded-2xl overflow-hidden border border-border">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-card/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-muted-foreground ml-2 font-mono">fastconnect ~ assistant</span>
              </div>
              {/* Terminal content */}
              <div className="p-6 font-mono text-sm text-left">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-primary">→</span>
                  <span className="text-foreground">What programs does FAST University offer?</span>
                </div>
                <div className="flex items-start gap-3 pl-6 text-muted-foreground">
                  <span className="text-[oklch(0.7_0.2_120)]">AI:</span>
                  <div className="space-y-1">
                    <p>FAST-NUCES offers undergraduate programs in:</p>
                    <p className="text-primary">• Computer Science (BS-CS)</p>
                    <p className="text-primary">• Software Engineering (BS-SE)</p>
                    <p className="text-primary">• Artificial Intelligence (BS-AI)</p>
                    <p className="text-primary">• Data Science (BS-DS)</p>
                    <p className="text-muted-foreground">+ 8 more programs...</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                  <div className="w-2 h-4 bg-primary animate-pulse" />
                  <span className="text-muted-foreground">Ask me anything...</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-border">
            {[
              { value: "50K+", label: "Active Students" },
              { value: "95%", label: "Success Rate" },
              { value: "10K+", label: "Practice Tests" },
              { value: "24/7", label: "AI Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-3xl sm:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
