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

const socialLinks = [
  { label: "Twitter", href: "https://twitter.com/travelama", icon: "twitter" },
  { label: "Facebook", href: "https://facebook.com/travelama", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com/travelama", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com/company/travelama", icon: "linkedin" }
];

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="text-2xl font-bold text-white mb-4">
              Travelama
            </div>
            <p className="text-sm mb-6 max-w-xs">
              Digital property guides that delight your guests and save you time.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 hover:bg-ocean-600 flex items-center justify-center transition-colors">
                    {social.icon[0].toUpperCase()}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
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
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="font-semibold text-white mb-2">
              Stay Updated
            </h3>
            <p className="text-sm mb-4">
              Get tips, updates, and exclusive content for hosts.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 text-white"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-ocean-600 text-white font-semibold rounded-lg hover:bg-ocean-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div>
              © {currentYear} Travelama. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span>Made with ❤️ for hosts</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
