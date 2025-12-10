import Link from "next/link"
import Image from "next/image"

const footerLinks = {
 
  Contact: [
    { label: "Instagram", href: "https://www.instagram.com/fastconnect/" },
    { label: "support@fastconnect.com", href: "mailto:support@fastconnect.com" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ]
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Logo/Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-card backdrop-blur-sm border border-border flex items-center justify-center shadow-lg dark:shadow-black/20 overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="FASTConnect Logo"
                    width={32}
                    height={32}
                    className="object-contain p-1"
                  />
                </div>
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-lg opacity-50 transition-opacity" />
              </div>
              <span className="text-lg font-bold text-foreground">
                FAST<span className="text-primary">Connect</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              where every student finds a path.
            </p>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-2 text-foreground text-sm">{category}</h3>
              <ul className="space-y-1.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-xs text-muted-foreground hover:text-primary dark:hover:text-primary/80 transition-colors inline-block"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} FASTConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
