"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { ScrollAnimate } from "@/components/scroll-animate"

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 dark:bg-primary/20 rounded-full blur-[150px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollAnimate animationId="cta-section" direction="up">
          <div className="relative glass-card rounded-3xl p-12 md:p-16 border border-border">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-primary/10" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border text-sm text-muted-foreground mb-8">
                <span>Start your journey today</span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground text-balance">
                Ready to join{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                  FAST community
                </span>
                ?
              </h2>

              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
                Create your free account and get access to AI-powered test preparation, predictive analytics, and
                everything you need to succeed.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="relative bg-primary hover:bg-primary/90 text-primary-foreground border-0 px-8 h-14 text-base rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/60 hover:shadow-[0_20px_50px_rgb(59,130,246,0.4)] dark:hover:shadow-[0_20px_50px_rgb(99,102,241,0.4)] transition-all duration-300 group hover:scale-105 active:scale-100 overflow-hidden"
                  >
                    {/* Animated background gradient on hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Shine effect */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                    
                    <span className="relative z-10 flex items-center">
                      Create Free Account
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 h-14 text-base rounded-xl bg-card/50 border-border text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary dark:hover:border-primary/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 active:scale-100 hover:shadow-lg"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  )
}
