"use client"

import { Bot, GraduationCap, BarChart3, FileText, Globe, Users, Brain, Compass } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Bot,
    title: "AI Chatbot",
    description: "Get instant answers about admissions, programs, and campus life from our intelligent AI assistant.",
  },
  {
    icon: GraduationCap,
    title: "Entry Test Practice",
    description: "Prepare with thousands of practice questions and mock tests tailored to FAST entrance exams.",
  },
  {
    icon: Brain,
    title: "AI Batch Advisor",
    description: "Get personalized batch recommendations based on your interests and academic performance.",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Understand your admission chances with data-driven predictions and insights.",
  },
  {
    icon: FileText,
    title: "Campus Resources",
    description: "Access study materials, past papers, and essential documents for your preparation.",
  },
  {
    icon: Users,
    title: "Social Feed",
    description: "Stay updated with announcements, events, and connect with the FAST community.",
  },
  {
    icon: Globe,
    title: "360° Campus Tour",
    description: "Explore FAST campus virtually with our immersive 360-degree tour experience.",
  },
  {
    icon: Compass,
    title: "Smart Navigation",
    description: "Find your way around with intelligent campus navigation and location services.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Everything you need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">succeed</span>
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            FASTConnect combines AI-powered tools and resources to help you prepare for FAST University admissions and
            beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "group relative p-6 rounded-2xl transition-all duration-500",
                "bg-white/[0.02] hover:bg-white/[0.05]",
                "border border-white/5 hover:border-blue-500/30",
              )}
            >
              {/* Icon container */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-blue-500/40 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
