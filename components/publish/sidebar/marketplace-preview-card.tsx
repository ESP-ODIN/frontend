"use client"

import { Bookmark, Download, Eye, ThumbsUp } from "lucide-react"

import { AgentIcon } from "@/components/agent/agent-icon"
import { Badge } from "@/components/ui/badge"
import { usePublishWizard } from "@/components/publish/wizard-context"
import { DevMark } from "@/components/dev/dev-mark"

export function MarketplacePreviewCard() {
  const { data } = usePublishWizard()
  const { package: pkg } = data

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-muted/40 bg-background-100 p-5 transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <AgentIcon name={pkg.name} />
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-bold text-foreground">
              {pkg.name || "my-agent"}
            </p>
            <p className="text-xs text-muted-foreground">
              by @you <DevMark kind="mock" note="no logged-in user, author is hardcoded" />
            </p>
          </div>
        </div>
        <Badge variant="outline" size="sm" className="shrink-0">
          {pkg.version || "0.1.0"}
        </Badge>
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">
        {pkg.description || "Your description will appear here."}
      </p>

      {pkg.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {pkg.tags.map((tag) => (
            <Badge key={tag} size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-muted/40 pt-3 font-mono text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ThumbsUp className="size-3" />0
        </span>
        <span className="flex items-center gap-1">
          <Bookmark className="size-3" />0
        </span>
        <span className="flex items-center gap-1">
          <Eye className="size-3" />0
        </span>
        <span className="flex items-center gap-1">
          <Download className="size-3" />0
        </span>
      </div>
    </div>
  )
}
