"use client"

import { Download, Star } from "lucide-react"

import { AgentIcon } from "@/components/blocks/agent-icon"
import { Badge } from "@/components/blocks/badge"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function MarketplacePreviewCard() {
  const { data } = usePublishWizard()
  const { general } = data
  const initials = general.packageName.slice(0, 2).toUpperCase() || "??"

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-muted/40 bg-background-100 p-5 transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <AgentIcon label={initials} color="primary" />
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-bold text-foreground">
              {general.packageName || "mon-agent"}
            </p>
            <p className="text-xs text-muted-foreground">by @vous</p>
          </div>
        </div>
        <Badge variant="outline" size="sm" className="shrink-0">
          0.1.0
        </Badge>
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">
        {general.description || "Votre description apparaîtra ici."}
      </p>

      {general.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {general.tags.map((tag) => (
            <Badge key={tag} size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-muted/40 pt-3 font-mono text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="size-3" />0
        </span>
        <span className="flex items-center gap-1">
          <Download className="size-3" />0
        </span>
      </div>
    </div>
  )
}
