"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
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
  const [open, setOpen] = useState(false)

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

          {/* Mobile / tablet layout — logo + a burger that opens a real popup drawer, below lg */}
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
                aria-label="Ouvrir le menu"
                onClick={() => setOpen(true)}
            >
                <Menu />
            </Button>
          </div>
      </div>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <DialogPrimitive.Popup className="fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-sm flex-col border-l border-muted/40 bg-popover text-popover-foreground shadow-2xl outline-none data-open:animate-in data-open:slide-in-from-right data-open:fade-in-0 data-closed:animate-out data-closed:slide-out-to-right data-closed:fade-out-0 lg:hidden">
            <div className="flex shrink-0 items-center justify-between border-b border-muted/40 px-4 py-4">
              <Logo />
              <DialogPrimitive.Title className="sr-only">Menu de navigation</DialogPrimitive.Title>
              <DialogPrimitive.Close
                render={
                  <button
                    type="button"
                    aria-label="Fermer"
                    className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/10 hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                }
              />
            </div>
            <DialogPrimitive.Description className="sr-only">
              Rechercher des agents et naviguer sur Odin
            </DialogPrimitive.Description>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
              <SearchBar count={100} className="w-full max-w-none" />

              <nav className="flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted/10 hover:text-foreground",
                      isActive(link.href) && "bg-muted/10 font-extrabold text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-2 border-t border-muted/40 p-4">
              <Button
                  size="sm"
                  className="flex-1 rounded-lg"
                  render={<Link href="/publish" onClick={() => setOpen(false)} />}
              >
                  Publier un agent
              </Button>
              <Button
                  className="bg-transparent border-muted/50"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Notifications"
                  render={<Link href="/notifications" onClick={() => setOpen(false)} />}
              >
                  <Bell />
              </Button>
            </div>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <CommandMenu />
    </>
  )
}
