import Link from "next/link"
import Image from "next/image"

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Modules", href: "#modules" },
    { label: "Pricing", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Study Materials", href: "#" },
    { label: "Past Papers", href: "#" },
    { label: "FAQs", href: "#" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Contact", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-[#0a0a12]/90 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg shadow-black/20 overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="FASTConnect Logo"
                    width={40}
                    height={40}
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="absolute inset-0 rounded-xl bg-[#0a0a12]/30 blur-lg opacity-50 transition-opacity" />
              </div>
              <span className="text-xl font-bold text-white">
                FAST<span className="text-blue-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed">where every student finds a path.</p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4 text-white">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/40 hover:text-blue-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">© {new Date().getFullYear()} FASTConnect. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-white/30 hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-white/30 hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
