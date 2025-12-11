"use client"

import Image from "next/image"
import { Linkedin, Github } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollAnimate } from "@/components/scroll-animate"

const teamMembers = [
  {
    name: "Muhammad Taha",
    role: "Developer",
    image: "/Muhammad Taha.png",
    linkedin: "https://www.linkedin.com/in/muhammad--taha/",
    github: "https://github.com/mtaha-23",
  },
  {
    name: "Sharjeel Khan",
    role: "Developer",
    image: "/Sharjeel Khan.jpg", 
    linkedin: "https://linkedin.com/in/sharjeel-khan",
    github: "https://github.com/sharjeel-khan",
  },
  {
    name: "Zaid Ahmed",
    role: "Developer",
    image: "/Zaid Ahmed.jpg", 
    linkedin: "https://linkedin.com/in/zaid-ahmed-123",
    github: "https://github.com/zaid-ahmed-123",
  }
]

export function AboutSection() {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Us Header */}
        <ScrollAnimate animationId="about-header" direction="up">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              About Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
              Meet the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                Team
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are a team of passionate developers from FAST-NUCES, dedicated to helping students succeed in their
              journey to FAST University through innovative technology and AI-powered solutions.
            </p>
          </div>
        </ScrollAnimate>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <ScrollAnimate
              key={member.name}
              animationId={`team-member-${member.name}`}
              direction="up"
              delay={index * 100}
            >
              <div className="group relative bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-500 text-center">
              {/* Profile Image */}
              <div className="relative mb-6 mx-auto w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-border group-hover:border-primary/50 transition-colors">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name and Role */}
              <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                {member.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{member.role}</p>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-4">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-card border border-border hover:bg-primary/20 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all"
                  aria-label={`${member.name}'s LinkedIn`}
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-card border border-border hover:bg-primary/20 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all"
                  aria-label={`${member.name}'s GitHub`}
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </ScrollAnimate>
          ))}
        </div>

        {/* About FASTConnect */}
        <ScrollAnimate animationId="about-fastconnect" direction="up" delay={300}>
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-card/50 border border-border rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-4 text-foreground">About FASTConnect</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  FASTConnect is a comprehensive platform designed to help students prepare for FAST-NUCES admissions and
                  succeed in their academic journey. Our platform combines cutting-edge AI technology with comprehensive
                  resources to provide students with everything they need.
                </p>
                <p>
                  From AI-powered chatbots that answer admission queries 24/7, to comprehensive test practice with
                  thousands of questions, predictive analytics for admission probability, and virtual campus tours,
                  FASTConnect is your all-in-one solution for FAST University admissions.
                </p>
                <p>
                  Built by students, for students. We understand the challenges you face and have created tools that make
                  your journey to FAST University smoother and more successful.
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  )
}

