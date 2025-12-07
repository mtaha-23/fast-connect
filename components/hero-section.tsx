"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Ensure video plays (some browsers require this)
    const video = videoRef.current
    if (video) {
      video.play().catch((error) => {
        console.log("Video autoplay prevented:", error)
      })
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Video Background - Only in Hero Section */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectFit: "cover" }}
        >
          <source src="/bg%20video.mp4" type="video/mp4" />
          <source src="/new video.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability - theme aware */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background/80 dark:from-[#0a0a12]/80 dark:via-[#0d0d1a]/85 dark:to-[#0a0a12]/90" />
      </div>
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
            <Link href="#services">
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
