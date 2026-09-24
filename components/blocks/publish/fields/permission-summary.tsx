import { FolderLock, Globe, KeyRound, SquareTerminal } from "lucide-react"

import { Badge } from "@/components/blocks/badge"
import type { PermissionsInfo } from "@/lib/publish/types"

const FILESYSTEM_LABELS: Record<PermissionsInfo["filesystemAccess"], string> = {
  none: "Aucun accès filesystem",
  "read-only": "Filesystem lecture seule",
  "read-write": "Filesystem lecture/écriture",
}

function terminalLabel({
  terminalAccess,
  allowedCommands,
}: PermissionsInfo): string {
  if (terminalAccess === "none") return "Pas d'accès terminal"
  if (terminalAccess === "full") return "Terminal : accès complet"
  const count = allowedCommands.length
  return `Terminal : ${count} commande${count !== 1 ? "s" : ""} autorisée${count !== 1 ? "s" : ""}`
}

export function PermissionSummary({
  permissions,
}: {
  permissions: PermissionsInfo
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={permissions.internetAccess ? "primary" : "muted"}
        className="gap-1.5"
      >
        <Globe className="size-3" />
        {permissions.internetAccess
          ? "Internet autorisé"
          : "Pas d'accès internet"}
      </Badge>
      <Badge
        variant={permissions.filesystemAccess !== "none" ? "primary" : "muted"}
        className="gap-1.5"
      >
        <FolderLock className="size-3" />
        {FILESYSTEM_LABELS[permissions.filesystemAccess]}
      </Badge>
      <Badge
        variant={permissions.terminalAccess !== "none" ? "primary" : "muted"}
        className="gap-1.5"
      >
        <SquareTerminal className="size-3" />
        {terminalLabel(permissions)}
      </Badge>
      <Badge
        variant={permissions.envVars.length > 0 ? "primary" : "muted"}
        className="gap-1.5"
      >
        <KeyRound className="size-3" />
        {permissions.envVars.length} variable
        {permissions.envVars.length !== 1 && "s"} d&apos;env.
      </Badge>
    </div>
  )
}
