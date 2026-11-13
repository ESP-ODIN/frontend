"use client"

import { useRef } from "react"
import { Check, UserPlus } from "lucide-react"

import { CREATOR_FOLLOW_NOTE } from "@/lib/api/creator-follows"
import { cn } from "@/lib/utils"
import { useCreatorFollow } from "@/hooks/use-creator-follow"
import { useExplosion } from "@/components/motion/explosion-burst"
import { DevMark } from "@/components/dev/dev-mark"

type FollowCreatorButtonProps = {
  creatorId: string
  isLoggedIn: boolean
  /** "compact" : à côté d'un nom de créateur (en-tête d'une fiche agent). */
  size?: "default" | "compact"
  className?: string
}

const FOLLOW_COLORS = ["#60a5fa", "#93c5fd", "#bfdbfe", "#e85d04", "#ffb35c"]
const ICON_ANIMATION = "fx-icon-follow"

const SIZES = {
  compact: "h-6 gap-1 px-2 text-xs [&_svg]:size-3",
  default: "h-8 gap-1.5 px-3 text-sm [&_svg]:size-3.5",
}

/** Suivre un créateur : ses nouveaux agents et versions arrivent dans le profil de l'utilisateur. */
export function FollowCreatorButton({
  creatorId,
  isLoggedIn,
  size = "default",
  className,
}: FollowCreatorButtonProps) {
  const { following, toggle } = useCreatorFollow(creatorId, isLoggedIn)
  const Icon = following ? Check : UserPlus
  const burst = useExplosion<HTMLSpanElement>()
  const iconRef = useRef<HTMLSpanElement>(null)

  function handleClick() {
    // Relance l'animation de l'icône même si la classe est déjà là.
    const icon = iconRef.current
    if (icon) {
      icon.classList.remove(ICON_ANIMATION)
      void icon.offsetWidth
      icon.classList.add(ICON_ANIMATION)
    }
    burst.explode(following ? { mode: "implode" } : { colors: FOLLOW_COLORS })
    toggle()
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span ref={burst.containerRef} className="relative inline-flex">
        <button
          type="button"
          aria-pressed={following}
          onClick={handleClick}
          className={cn(
            "inline-flex shrink-0 items-center rounded-full border font-medium transition-[color,background-color,border-color,transform] outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-95",
            SIZES[size],
            following
              ? "border-blue-400/40 bg-blue-400/10 text-blue-600 hover:bg-blue-400/15 dark:text-blue-400"
              : "border-border text-foreground/70 hover:border-foreground/25 hover:bg-foreground/5 hover:text-foreground"
          )}
        >
          <span ref={iconRef} className="inline-flex">
            <Icon aria-hidden />
          </span>
          {following ? "Following" : "Follow"}
        </button>
      </span>
      <DevMark kind="mock" note={CREATOR_FOLLOW_NOTE} />
    </span>
  )
}
