import { Navbar } from "@/components/navbar"
import { AnimatedBackground } from "@/components/animated-background"
import { Footer } from "@/components/footer"

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using FASTConnect, you accept and agree to be bound by the terms and provision of this 
                agreement. If you do not agree to these Terms of Service, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Permission is granted to temporarily use FASTConnect for personal, non-commercial purposes. This license 
                does not include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose</li>
                <li>Attempting to reverse engineer any software</li>
                <li>Removing any copyright or proprietary notations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To access certain features, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information as necessary</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree not to use FASTConnect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Interfere with or disrupt the platform's operation</li>
                <li>Attempt to gain unauthorized access to any part of the platform</li>
                <li>Use automated systems to access the platform without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Academic Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for the accuracy of academic information you provide. Recommendations and advice 
                provided by our AI Batch Advisor are suggestions only and should not replace official academic counseling. 
                Always consult with your academic advisor for official guidance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of FASTConnect, including but not limited to text, graphics, 
                logos, and software, are the exclusive property of FASTConnect and are protected by copyright, trademark, 
                and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The information on FASTConnect is provided on an "as is" basis. We make no warranties, expressed or 
                implied, and hereby disclaim all warranties including, without limitation, implied warranties of 
                merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall FASTConnect or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                to use FASTConnect, even if we have been notified of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account and access to the platform immediately, without prior notice, 
                for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third 
                parties, or for any other reason.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. We will notify users of any material 
                changes by posting the new Terms of Service on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                Email: <a href="mailto:support@fastconnect.com" className="text-primary hover:underline">support@fastconnect.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

