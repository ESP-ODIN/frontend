import { AGENT_TYPE_OPTIONS } from "@/lib/publish/constants"
import type { AgentType } from "@/lib/agents/types"
import { cn } from "@/lib/utils"

type AgentTypeBadgeProps = {
  type: AgentType
  /**
   * "badge" : pastille avec l'icône seule ; le label se déplie au survol de la carte parente
   * (classe `group/agent`, ou `data-active` pour une sélection au clavier) ou de la pastille.
   * "label" : icône + label toujours visibles (fiches où le type est une ligne d'info).
   */
  variant?: "badge" | "label"
  /** "inverted" pour les fonds sombres fixes (Spotlight). */
  tone?: "default" | "inverted"
  className?: string
}

/** Indication discrète du type d'agent (workflow / autonomous), reprise sur toutes les cartes. */
export function AgentTypeBadge({ type, variant = "badge", tone = "default", className }: AgentTypeBadgeProps) {
  const option = AGENT_TYPE_OPTIONS.find((item) => item.id === type)
  if (!option) return null

  const Icon = option.icon

  if (variant === "label") {
    return (
      <span className={cn("inline-flex shrink-0 items-center gap-1.5 font-mono", className)}>
        <Icon aria-hidden className="size-3.5" />
        {option.label}
      </span>
    )
  }

  return (
    <span
      role="img"
      aria-label={`${option.label} agent`}
      className={cn(
        "group/type inline-flex shrink-0 items-center rounded-full border p-1 font-mono text-[11px] leading-none transition-colors",
        tone === "inverted"
          ? "border-white/15 bg-white/5 text-[#F6F1E6]/60 hover:border-primary/50 hover:text-[#F6F1E6] group-hover/agent:border-primary/50 group-hover/agent:text-[#F6F1E6]"
          : "border-muted/40 bg-muted/10 text-muted-foreground hover:border-primary/30 hover:text-foreground group-hover/agent:border-primary/30 group-hover/agent:text-foreground group-data-active/agent:border-primary/30 group-data-active/agent:text-foreground",
        className
      )}
    >
      <Icon aria-hidden className="size-3 shrink-0" />
      <span
        aria-hidden
        className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover/type:ml-1 group-hover/type:max-w-24 group-hover/type:pr-0.5 group-hover/type:opacity-100 group-hover/agent:ml-1 group-hover/agent:max-w-24 group-hover/agent:pr-0.5 group-hover/agent:opacity-100 group-data-active/agent:ml-1 group-data-active/agent:max-w-24 group-data-active/agent:pr-0.5 group-data-active/agent:opacity-100"
      >
        {option.label}
      </span>
    </span>
  )
}
