'use client'

import { useState } from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Logo } from '@/components/blocks/logo'
import { SearchBar } from '@/components/blocks/search-bar'
import { CommandMenu } from '@/components/blocks/command-menu'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export function Nav() {
  const [open, setOpen] = useState(false)

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

          {/* Mobile / tablet layout — logo + a burger that opens a real popup drawer, below lg */}
          <div className="flex flex-1 items-center lg:hidden">
              <Logo />
          </div>
          <Button
              variant="outline"
              size="icon-sm"
              className="bg-transparent border-muted/50 lg:hidden"
              aria-label="Ouvrir le menu"
              onClick={() => setOpen(true)}
          >
              <Menu />
          </Button>
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

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              <SearchBar count={100} className="w-full max-w-none" />
              <Button
                  className="w-full text-foreground"
                  variant="outline"
                  size="sm"
                  render={<Link href="/sign-in" onClick={() => setOpen(false)} />}
              >
                  Sign In
              </Button>
              <Button
                  className="w-full rounded-lg"
                  variant="default"
                  size="sm"
                  render={<Link href="/log-in" onClick={() => setOpen(false)} />}
              >
                  Log In
              </Button>
            </div>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <CommandMenu />
    </>
  )
}
