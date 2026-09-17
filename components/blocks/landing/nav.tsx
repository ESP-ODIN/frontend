'use client'

import { useState } from 'react'
import { Logo } from '@/components/blocks/logo'
import { SearchBar } from '@/components/blocks/search-bar'
import { CommandMenu } from '@/components/blocks/command-menu'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between gap-4 pb-4">
          {/* Desktop layout — unchanged from the original design, shown from lg upward */}
          <div className="hidden flex-1 items-center lg:flex">
              <Logo  />
          </div>
          <SearchBar count={100} className="hidden max-w-md lg:flex" />
          <div className="hidden flex-1 items-center justify-end lg:flex">
              <Button className= "text-foreground" variant="link" size="sm" render={<Link href="/sign-in" />}>
                  Sign In
              </Button>
              <Button className= "rounded-lg" variant="default" size="sm" render={<Link href="/log-in" />}>
                  Log In
              </Button>
          </div>

          {/* Mobile / tablet layout — collapsed behind a menu toggle below lg */}
          <div className="flex flex-1 items-center lg:hidden">
              <Logo />
          </div>
          <Button
              variant="outline"
              size="icon-sm"
              className="bg-transparent border-muted/50 lg:hidden"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
          >
              {mobileOpen ? <X /> : <Menu />}
          </Button>
      </div>

      {mobileOpen && (
        <div className="flex flex-col gap-3 pb-4 lg:hidden">
          <SearchBar count={100} className="w-full max-w-none" />
          <Button
              className="w-full text-foreground"
              variant="outline"
              size="sm"
              render={<Link href="/sign-in" onClick={() => setMobileOpen(false)} />}
          >
              Sign In
          </Button>
          <Button
              className="w-full rounded-lg"
              variant="default"
              size="sm"
              render={<Link href="/log-in" onClick={() => setMobileOpen(false)} />}
          >
              Log In
          </Button>
        </div>
      )}
      <CommandMenu />
    </>
  )
}
