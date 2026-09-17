"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { ArrowRight, Menu, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/blocks/logo"
import { CommandMenu, commandMenuHandle } from "@/components/blocks/command-menu"
import { Magnetic } from "@/components/motion/magnetic"

export type NavLink = { label: string; href: string }

type FloatingNavProps = {
  links?: NavLink[]
  smoothScroll?: boolean
  minimal?: boolean
  ctaHref?: string
  showCta?: boolean
}

export function FloatingNav({
  links = [],
  smoothScroll = false,
  minimal = false,
  ctaHref = "/sign-in",
  showCta = true,
}: FloatingNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!smoothScroll) return
    const previous = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = previous
    }
  }, [smoothScroll])

  useEffect(() => {
    let frame = 0
    function onScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 24))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  if (minimal) {
    return (
      <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4 sm:px-4">
        <nav className="flex items-center rounded-full border border-muted/30 bg-background/70 px-3 py-2 shadow-lg shadow-black/5 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2 rounded-full py-1 pl-1">
            <Logo />
          </Link>
        </nav>
      </header>
    )
  }

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4 sm:px-4">
        <nav
          className={cn(
            "flex w-full max-w-3xl items-center justify-between gap-1 rounded-full border border-muted/30 bg-background/70 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-500 ease-out sm:gap-2",
            scrolled ? "max-w-2xl px-2 py-2" : "px-2.5 py-2 sm:px-3 sm:py-2.5"
          )}
        >
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 rounded-full py-1 pl-1">
            <Logo showName={!scrolled} />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-3 py-1.5 text-sm whitespace-nowrap text-foreground/70 transition-colors hover:bg-muted/10 hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-1.5">
            <DialogPrimitive.Trigger
              handle={commandMenuHandle}
              aria-label="Rechercher"
              className="hidden size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/10 hover:text-foreground sm:flex"
            >
              <Search className="size-4" />
            </DialogPrimitive.Trigger>

            {showCta && (
              <Magnetic>
                {scrolled ? (
                  <Button
                    className="fx-shine rounded-full"
                    size="icon-sm"
                    aria-label="Essayer Odin"
                    render={<Link href={ctaHref} />}
                  >
                    <ArrowRight />
                  </Button>
                ) : (
                  <Button
                    className="fx-shine rounded-full px-3 sm:px-4"
                    size="sm"
                    icon={ArrowRight}
                    iconPosition="right"
                    render={<Link href={ctaHref} />}
                  >
                    <span className="hidden sm:inline">Essayer Odin</span>
                    <span className="sm:hidden">Essayer</span>
                  </Button>
                )}
              </Magnetic>
            )}

            {links.length > 0 && (
              <Button
                variant="outline"
                size="icon-sm"
                className="shrink-0 border-muted/50 bg-transparent lg:hidden"
                aria-label="Ouvrir le menu"
                onClick={() => setOpen(true)}
              >
                <Menu />
              </Button>
            )}
          </div>
        </nav>
      </header>

      {links.length > 0 && (
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
                Naviguer sur le site Odin
              </DialogPrimitive.Description>

              <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                {links.map((link) => (
                   <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted/10"
                  >
                    {link.label}
                  </Link>
                ))}
                {showCta && (
                  <div className="mt-4 border-t border-muted/40 pt-4">
                    <Button
                      className="w-full rounded-lg"
                      variant="default"
                      size="sm"
                      render={<Link href={ctaHref} onClick={() => setOpen(false)} />}
                    >
                      Essayer Odin
                    </Button>
                  </div>
                )}
              </div>
            </DialogPrimitive.Popup>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}

      <CommandMenu />
    </>
  )
}
