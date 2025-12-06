"use client"

import { Button } from "@/components/ui/button"
import { Bot, GraduationCap, BarChart3, FileText, Globe, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

const modules = [
  {
    icon: Bot,
    title: "AI Chatbot",
    description:
      "Chat with our AI assistant for instant help with admissions queries, program information, and campus guidance.",
    features: ["24/7 availability", "Natural language processing", "Context-aware responses"],
    href: "/dashboard/chatbot",
  },
  {
    icon: GraduationCap,
    title: "Entry Test Practice",
    description:
      "Comprehensive test preparation with timed practice sessions, detailed explanations, and progress tracking.",
    features: ["10,000+ questions", "Timed mock tests", "Detailed analytics"],
    href: "/dashboard/test-practice",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Get data-driven insights about your admission probability based on your test scores and performance.",
    features: ["Score predictions", "Admission probability", "Improvement suggestions"],
    href: "/dashboard/analytics",
  },
  {
    icon: FileText,
    title: "Campus Resources",
    description: "Access a comprehensive library of study materials, past papers, and official documents.",
    features: ["Past papers archive", "Study guides", "Official documents"],
    href: "/dashboard/resources",
  },
  {
    icon: Globe,
    title: "360° Campus Tour",
    description: "Explore the FAST campus virtually with our immersive 360-degree tour experience.",
    features: ["Interactive navigation", "Building information", "Virtual walkthrough"],
    href: "/dashboard/tour",
  },
  {
    icon: Users,
    title: "Social Feed",
    description: "Stay connected with the FAST community through announcements, events, and updates.",
    features: ["Official announcements", "Event updates", "Community posts"],
    href: "/dashboard/feed",
  },
]

export function ModulesSection() {
  return (
    <section id="modules" className="py-32 relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            Modules
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
            Powerful tools for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
              every need
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Explore our comprehensive suite of tools designed to support your journey to FAST University.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div
              key={module.title}
              className="group relative bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-500"
            >
              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-border flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                  <module.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {module.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-4 leading-relaxed text-sm">{module.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {module.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={module.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-primary/20 dark:hover:text-primary border border-border hover:border-primary/30 transition-all"
                >
                  Try it out!
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
