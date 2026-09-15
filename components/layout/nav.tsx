"use client"

import { usePathname } from 'next/navigation'
import { Logo } from '@/components/blocks/logo'
import { SearchBar } from '@/components/blocks/search-bar'
import { CommandMenu } from '@/components/blocks/command-menu'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bell, User } from 'lucide-react'
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

  return (
    <>
      <div className="flex items-center justify-between gap-4 pb-4">
          <div className="flex flex-1 items-center">
              <Logo  />
              <div className='pl-2'>
                {links.map((link) => {
                    const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "px-3 py-2 text-sm font-medium text-foreground/80 hover:underline hover:text-primary",
                                isActive && "font-extrabold underline"
                            )}
                        >
                            {link.label}
                        </Link>
                    )
                })}
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
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
      </div>
      <CommandMenu />
    </>
  )
}
