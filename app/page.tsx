import { Navbar } from "@/components/navbar"
import { AnimatedBackground } from "@/components/animated-background"
import { HeroSection } from "@/components/hero-section"
import { ModulesSection } from "@/components/modules-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />
      <HeroSection />
      <ModulesSection />
      <CTASection />
      <Footer />
    </main>
  )
}
