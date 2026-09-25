import { FolderLock, Globe, KeyRound, SquareTerminal } from "lucide-react"

import { Badge } from "@/components/blocks/badge"
import type { PermissionsSection } from "@/lib/publish/types"

const FILESYSTEM_LABELS: Record<PermissionsSection["filesystem"], string> = {
  none: "No filesystem access",
  "read-only": "Read-only filesystem",
  "read-write": "Read/write filesystem",
}

function terminalLabel({
  access,
  commands,
}: PermissionsSection["terminal"]): string {
  if (access === "none") return "No terminal access"
  if (access === "full") return "Terminal: full access"
  const count = commands.length
  return `Terminal: ${count} allowed command${count !== 1 ? "s" : ""}`
}

export function PermissionSummary({
  permissions,
}: {
  permissions: PermissionsSection
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={permissions.network ? "primary" : "muted"}
        className="gap-1.5"
      >
        <Globe className="size-3" />
        {permissions.network ? "Internet allowed" : "No internet access"}
      </Badge>
      <Badge
        variant={permissions.filesystem !== "none" ? "primary" : "muted"}
        className="gap-1.5"
      >
        <FolderLock className="size-3" />
        {FILESYSTEM_LABELS[permissions.filesystem]}
      </Badge>
      <Badge
        variant={permissions.terminal.access !== "none" ? "primary" : "muted"}
        className="gap-1.5"
      >
        <SquareTerminal className="size-3" />
        {terminalLabel(permissions.terminal)}
      </Badge>
      <Badge
        variant={permissions.env.length > 0 ? "primary" : "muted"}
        className="gap-1.5"
      >
        <KeyRound className="size-3" />
        {permissions.env.length} env. variable
        {permissions.env.length !== 1 && "s"}
      </Badge>
    </div>
  )
}
