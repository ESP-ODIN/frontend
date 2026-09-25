import Link from "next/link"

import { Logo } from "@/components/blocks/logo"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type FooterColumn = {
  title: string
  links: { label: string; href: string }[]
}

const columns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "CLI", href: "/docs/cli" },
      { label: "SDK", href: "/docs/sdk" },
      { label: "API", href: "/docs/api" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discover", href: "/discover" },
      { label: "Featured agents", href: "/agents/featured" },
      { label: "Top authors", href: "/authors" },
      { label: "Showcase", href: "/showcase" },
      { label: "Discord", href: "/discord" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Changelog", href: "/changelog" },
      { label: "Blog", href: "/blog" },
      { label: "Examples", href: "/examples" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
      { label: "Legal", href: "/legal" },
    ],
  },
]

type FooterProps = {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <ScrollReveal as="footer" className={cn("flex flex-col gap-16 pt-30 pb-8", className)}>
      <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-8">
        <div className="flex max-w-xs flex-col gap-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            The package manager for AI agents. Discover, install, share — like npm, for
            artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-16">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <p className="text-xs font-mono tracking-wider text-foreground">
                {column.title.toUpperCase()}
              </p>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <span className="transition-transform group-hover:translate-x-0.5">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Separator />
        <p className="flex items-center justify-center gap-2 text-center font-mono text-xs text-muted-foreground">
          <span className="fx-live-dot size-1.5 rounded-full bg-primary" />
          © Odin · v0.1.0
        </p>
      </div>
    </ScrollReveal>
  )
}
