import { FolderLock, Globe, KeyRound, SquareTerminal } from "lucide-react"

import { Badge } from "@/components/blocks/badge"
import type { PermissionsSection } from "@/lib/publish/types"

const FILESYSTEM_LABELS: Record<PermissionsSection["filesystem"], string> = {
  none: "Aucun accès filesystem",
  "read-only": "Filesystem lecture seule",
  "read-write": "Filesystem lecture/écriture",
}

function terminalLabel({
  access,
  commands,
}: PermissionsSection["terminal"]): string {
  if (access === "none") return "Pas d'accès terminal"
  if (access === "full") return "Terminal : accès complet"
  const count = commands.length
  return `Terminal : ${count} commande${count !== 1 ? "s" : ""} autorisée${count !== 1 ? "s" : ""}`
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
        {permissions.network ? "Internet autorisé" : "Pas d'accès internet"}
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
        {permissions.env.length} variable
        {permissions.env.length !== 1 && "s"} d&apos;env.
      </Badge>
    </div>
  )
}
