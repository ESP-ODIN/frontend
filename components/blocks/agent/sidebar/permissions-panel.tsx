import { Check, X } from "lucide-react"

import type { AgentDetail } from "@/lib/data/agent-details"
import { cn } from "@/lib/utils"
import { AgentSidebarPanel } from "@/components/blocks/agent/sidebar/panel"
import { Separator } from "@/components/ui/separator"

type AgentPermissionsPanelProps = {
  detail: AgentDetail
}

export function AgentPermissionsPanel({ detail }: AgentPermissionsPanelProps) {
  return (
    <AgentSidebarPanel title="Permissions">
      <ul className="flex flex-col gap-2.5">
        {detail.permissions.map((permission) => (
          <li key={permission.label} className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-sm">
{permission.granted ? (
              <Check className="size-4 text-emerald-600" />
            ) : (
              <X className="size-4 text-muted-foreground/50" />
            )}
            <span
              className={cn(
                "font-mono",
                permission.granted ? "text-foreground" : "text-muted-foreground/70"
              )}
            >
              {permission.label}
            </span>
            </div>
              <Separator className="mt-2 mb-2" />
          </li>
        ))}
      </ul>
    </AgentSidebarPanel>
  )
}
