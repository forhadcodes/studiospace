import Link from "next/link"
import { Aperture } from "lucide-react"

import { NewsletterForm } from "@/components/newsletter-form"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studio-explore" },
  { label: "How It Works", href: "/how-it-work" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "#contact" },
]

const categories = [
  { label: "Photography Studios", href: "/studio-explore" },
  { label: "Video & Film Studios", href: "/studio-explore" },
  { label: "Podcast Studios", href: "/studio-explore" },
  { label: "Recording Studios", href: "/studio-explore" },
  { label: "Rehearsal Spaces", href: "/studio-explore" },
]

/** Official "X" logo (2023 rebrand) — do NOT use the old Twitter bird icon. */
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.046 1.793-4.73 4.535-4.73 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.49 0-1.956.934-1.956 1.887v2.298h3.328l-.532 3.489h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  )
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

const socialLinks = [
  { label: "X", href: "https://x.com", icon: XLogo },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookLogo },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramLogo },
  { label: "YouTube", href: "https://youtube.com", icon: YouTubeLogo },
]

function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand + mission */}
        <div>
          <Link href="/" className="flex items-center gap-2 text-white">
            <Aperture className="size-7" />
            <span className="text-2xl font-bold tracking-tight">StudioSpace</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
            Connecting creators with professional studio spaces. Book fully
            equipped photography, video, podcast, and recording studios by the
            hour — instantly and hassle-free.
          </p>
          {/* Social links */}
          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-9 place-items-center rounded-full border border-white/10 text-neutral-400 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick navigation */}
        <nav aria-label="Quick navigation">
          <h4 className="text-sm font-semibold tracking-wider text-white uppercase">
            Quick Links
          </h4>
          <ul className="mt-5 flex flex-col gap-3">
            {quickLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Popular categories */}
        <nav aria-label="Popular studio categories">
          <h4 className="text-sm font-semibold tracking-wider text-white uppercase">
            Popular Categories
          </h4>
          <ul className="mt-5 flex flex-col gap-3">
            {categories.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Newsletter */}
        <div>
          <h4 className="text-sm font-semibold tracking-wider text-white uppercase">
            Newsletter
          </h4>
          <p className="mt-5 text-sm text-neutral-400">
            New studios, offers, and booking tips — straight to your inbox.
          </p>
          <NewsletterForm className="mt-4" />
        </div>
      </div>

      {/* Bottom bar: copyright & terms */}
      <div className="border-t border-white/10 px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 StudioSpace. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <Link href="#terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="#privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
