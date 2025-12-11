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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 px-8 h-14 text-base rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 group"
                  >
                    Create Free Account
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 h-14 text-base rounded-xl bg-card/50 border-border text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary dark:hover:border-primary/50 hover:border-border transition-all duration-300"
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
