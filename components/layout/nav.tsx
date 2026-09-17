"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/blocks/logo'
import { SearchBar } from '@/components/blocks/search-bar'
import { CommandMenu } from '@/components/blocks/command-menu'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bell, Menu, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/social', label: 'Réseau Social' },
  { href: '/cli', label: 'CLI' },
  { href: '/docs', label: 'Docs' },
  { href: '/about', label: 'À propos' },
]

export function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 pb-4">
          {/* Desktop layout — unchanged from the original design, shown from lg upward */}
          <div className="hidden flex-1 items-center lg:flex">
              <Logo  />
              <div className='pl-2'>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "px-3 py-2 text-sm font-medium text-foreground/80 hover:underline hover:text-primary",
                            isActive(link.href) && "font-extrabold underline"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
          </div>

          <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
            <SearchBar count={100} className="max-w-md" />
            <Button size="sm" className="rounded-lg" render={<Link href="/publish" />}>
                Publier un agent
            </Button>
            <Button
                className="bg-transparent border-muted/50"
                variant="outline"
                size="icon-sm"
                aria-label="Notifications"
                render={<Link href="/notifications" />}
            >
                <Bell />
            </Button>
            <Button
                className="bg-transparent border-muted/50"
                variant="outline"
                size="icon-sm"
                aria-label="Profil"
                render={<Link href="/profile" />}
            >
                <User />
            </Button>
          </div>

          {/* Mobile / tablet layout — collapsed behind a menu toggle below lg */}
          <div className="flex flex-1 items-center lg:hidden">
            <Logo />
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <Button
                className="bg-transparent border-muted/50"
                variant="outline"
                size="icon-sm"
                aria-label="Profil"
                render={<Link href="/profile" />}
            >
                <User />
            </Button>
            <Button
                variant="outline"
                size="icon-sm"
                className="bg-transparent border-muted/50"
                aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
            >
                {mobileOpen ? <X /> : <Menu />}
            </Button>
          </div>
      </div>

      {mobileOpen && (
        <div className="flex flex-col gap-4 pb-4 lg:hidden">
          <SearchBar count={100} className="w-full max-w-none" />

          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted/10 hover:text-foreground",
                  isActive(link.href) && "bg-muted/10 font-extrabold text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button size="sm" className="flex-1 rounded-lg" render={<Link href="/publish" />}>
                Publier un agent
            </Button>
            <Button
                className="bg-transparent border-muted/50"
                variant="outline"
                size="icon-sm"
                aria-label="Notifications"
                render={<Link href="/notifications" />}
            >
                <Bell />
            </Button>
          </div>
        </div>
      )}
      <CommandMenu />
    </>
  )
}
