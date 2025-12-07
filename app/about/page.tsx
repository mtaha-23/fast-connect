import { Navbar } from "@/components/navbar"
import { AnimatedBackground } from "@/components/animated-background"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />
      <AboutSection />
      <Footer />
    </main>
  )
}

