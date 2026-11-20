import { getAgentAvatar } from "@/lib/agents/avatar"
import { cn } from "@/lib/utils"

function initials(label: string): string {
  const clean = label.replace(/^@/, "").trim()
  const words = clean.split(/[\s._-]+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return clean.slice(0, 2).toUpperCase() || "?"
}

type UserAvatarProps = {
  /** Sert à la couleur : toujours la même pour une même personne. */
  seed: string
  label: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZES = {
  sm: "size-7 text-[10px]",
  md: "size-10 text-xs",
  lg: "size-11 text-sm",
}

/** Pastille aux initiales, dégradé dérivé de l'id (pas de photo de profil dans l'API). */
export function UserAvatar({
  seed,
  label,
  size = "md",
  className,
}: UserAvatarProps) {
  const { from, to, angle } = getAgentAvatar(seed)

  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full font-mono font-bold text-white shadow-sm ring-2 ring-background select-none",
        SIZES[size],
        className
      )}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})`,
      }}
    >
      <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
        {initials(label)}
      </span>
    </span>
  )
}
