import Link from "next/link";

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Demo Property", href: "/stay/demo-property" },
      { label: "What's New", href: "#blog" }
    ]
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Blog", href: "#blog" },
      { label: "Help Center", href: "/help" },
      { label: "Templates", href: "#features" },
      { label: "Community", href: "#" }
    ]
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Partners", href: "#integrations" }
    ]
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "GDPR", href: "/gdpr" }
    ]
  }
};

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sand-50 border-t border-sand-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                <span className="text-white font-serif text-xl font-semibold">N</span>
              </div>
              <span className="font-serif text-2xl font-medium text-neutral-900 tracking-tight">
                Nesterway
              </span>
            </Link>
            <p className="text-neutral-600 mb-6 max-w-xs leading-relaxed">
              Digital guest guides for modern hosts. Beautiful, simple, and loved by guests.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {['X', 'IG', 'LI'].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-sand-200 hover:bg-ocean-500 text-neutral-600 hover:text-white flex items-center justify-center transition-colors text-sm font-medium"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-medium text-neutral-900 mb-4 text-sm uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-neutral-600 hover:text-neutral-900 transition-colors text-[15px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-12 border-t border-sand-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl font-medium text-neutral-900 mb-2">
                Stay in the loop
              </h3>
              <p className="text-neutral-600">
                Tips, updates, and insights for hosts. No spam, ever.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-64 px-4 py-3 bg-white border border-sand-300 rounded-full focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-neutral-900 text-white font-medium rounded-full hover:bg-neutral-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sand-200">
        <div className="container mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
            <div>
              © {currentYear} Nesterway. All rights reserved.
            </div>
            <div className="flex items-center gap-1">
              Made with <span className="text-coral-500">♥</span> for hosts everywhere
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
