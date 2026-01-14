import Link from "next/link";
import { businessConfig } from "@/lib/config";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";

const footerLinks = {
  services: [
    { href: "/custom-framing", label: "Custom Framing" },
    { href: "/shop", label: "Shop Frames" },
    { href: "/what-we-frame", label: "What We Frame" },
    { href: "/business", label: "Business Services" },
    { href: "/gallery", label: "Gallery" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/quote", label: "Get a Quote" },
  ],
  policies: [
    { href: "/policies/shipping", label: "Shipping" },
    { href: "/policies/returns", label: "Returns" },
    { href: "/policies/privacy", label: "Privacy Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Main Footer */}
      <div className="container-wide py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-heading text-xl font-semibold text-white">
                Model Home Art
              </span>
            </Link>
            <p className="text-sm text-stone-400 mb-6">
              Budget-friendly custom framing in Orange County. We frame just about anything.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>{businessConfig.address.full}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href={`tel:${businessConfig.phone}`} className="hover:text-white transition-colors">
                  {businessConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href={`mailto:${businessConfig.email}`} className="hover:text-white transition-colors">
                  {businessConfig.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>{businessConfig.hours.display}</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-white font-semibold mb-4 mt-6">Policies</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.policies.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & CTA */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-3 mb-6">
              <a
                href={businessConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={businessConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            <div className="p-4 bg-stone-800 rounded-lg">
              <p className="text-white font-medium mb-2">Ready to get started?</p>
              <p className="text-sm text-stone-400 mb-3">
                Get a free quote in {businessConfig.responseTime}.
              </p>
              <Link
                href="/quote"
                className="inline-block w-full text-center py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Get a Fast Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="container-wide py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-stone-500">
            <p>© {new Date().getFullYear()} {businessConfig.name}. All rights reserved.</p>
            <p>Serving {businessConfig.serviceArea}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
