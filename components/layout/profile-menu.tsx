"use client"

import { useTransition, type ComponentProps, type ReactNode } from "react"
import Link from "next/link"
import { Menu } from "@base-ui/react/menu"
import { ChevronRight, LogIn, LogOut, User, UserPlus } from "lucide-react"

import { logoutAction } from "@/lib/auth/actions"
import { cn } from "@/lib/utils"
import { DevMark } from "../dev/dev-mark"

type ProfileMenuProps = {
  isLoggedIn: boolean
  /** Lien de connexion, avec le ?next= de la page courante. */
  loginHref: string
  /** Email du compte connecté (seule info d'identité dans le JWT). */
  accountEmail?: string | null
}

const NAME_MISSING_NOTE = "first name, last name and username: not in the JWT and no /me endpoint"

const itemClass =
  "group/item flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm outline-none select-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50"

function ItemIcon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-muted/30 bg-muted/10 text-muted-foreground transition-colors [&_svg]:size-4",
        className
      )}
    >
      {children}
    </span>
  )
}

function ItemText({ title, description }: { title: string; description: string }) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="font-medium text-foreground">{title}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </span>
  )
}

function NavLinkItem({ href, ...props }: ComponentProps<typeof Menu.LinkItem> & { href: string }) {
  return (
    <Menu.LinkItem
      closeOnClick
      render={<Link href={href} />}
      className={cn(itemClass, "data-highlighted:bg-primary/10")}
      {...props}
    />
  )
}

/** Bouton profil de la nav, toujours présent : connexion / inscription, ou déconnexion. */
export function ProfileMenu({ isLoggedIn, loginHref, accountEmail }: ProfileMenuProps) {
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(() => logoutAction())
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Account"
        className={cn(
          "relative flex size-8 shrink-0 items-center justify-center rounded-full transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          isLoggedIn
            ? "bg-linear-to-br from-primary to-orange-400 text-primary-foreground shadow-md shadow-primary/25 hover:brightness-110 data-popup-open:brightness-110"
            : "border border-muted/50 text-muted-foreground hover:bg-muted/10 hover:text-foreground data-popup-open:bg-muted/10 data-popup-open:text-foreground"
        )}
      >
        <User className="size-4" />
        {isLoggedIn && (
          <span
            aria-hidden
            className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-background bg-emerald-500"
          />
        )}
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="bottom" align="center" sideOffset={12} collisionPadding={12} className="z-50 outline-none">
          <Menu.Popup className="w-64 origin-(--transform-origin) rounded-2xl border border-muted/40 bg-popover/95 p-1.5 text-popover-foreground shadow-2xl shadow-black/15 backdrop-blur-xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-open:slide-in-from-top-1 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            {/* En-tête : connecté, c'est le lien direct vers le profil. */}
            {isLoggedIn ? (
              <NavLinkItem href="/profile" className={cn(itemClass, "mb-1 py-2.5 data-highlighted:bg-primary/10")}>
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-orange-400 text-primary-foreground">
                  <User className="size-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <span className="truncate">{accountEmail ?? "My account"}</span>
                    <DevMark kind="missing" note={NAME_MISSING_NOTE} />
                  </span>
                  <span className="text-xs text-muted-foreground">Profile</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-data-highlighted/item:translate-x-0.5 group-data-highlighted/item:text-primary" />
              </NavLinkItem>
            ) : (
              <div className="flex items-center gap-3 px-2.5 pt-2 pb-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/15 text-muted-foreground">
                  <User className="size-5" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold text-foreground">Welcome to Odin</span>
                  <span className="text-xs text-muted-foreground">Sign in to publish agents</span>
                </span>
              </div>
            )}

            <div className="mx-1 mb-1.5 h-px bg-muted/30" />

            {isLoggedIn ? (
              <>
                <Menu.Item
                  disabled={isPending}
                  onClick={handleLogout}
                  className={cn(itemClass, "data-highlighted:bg-destructive/10")}
                >
                  <ItemIcon className="group-data-highlighted/item:border-destructive/30 group-data-highlighted/item:text-destructive">
                    <LogOut />
                  </ItemIcon>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-medium text-destructive">
                      {isPending ? "Logging out..." : "Log out"}
                    </span>
                    <span className="text-xs text-muted-foreground">End your session</span>
                  </span>
                </Menu.Item>
              </>
            ) : (
              <>
                <NavLinkItem href={loginHref}>
                  <ItemIcon className="group-data-highlighted/item:border-primary/30 group-data-highlighted/item:text-primary">
                    <LogIn />
                  </ItemIcon>
                  <ItemText title="Log in" description="Already have an account" />
                </NavLinkItem>
                <NavLinkItem href="/register">
                  <ItemIcon className="group-data-highlighted/item:border-primary/30 group-data-highlighted/item:text-primary">
                    <UserPlus />
                  </ItemIcon>
                  <ItemText title="Sign up" description="Create your free account" />
                </NavLinkItem>
              </>
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
