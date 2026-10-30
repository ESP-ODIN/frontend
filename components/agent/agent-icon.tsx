import { useId } from "react"
import type { LucideIcon } from "lucide-react"

import { getAgentAvatar } from "@/lib/agents/avatar"
import { cn } from "@/lib/utils"

type AgentIconProps = {
  icon?: LucideIcon
  name: string
  className?: string
}

const glyphs: React.ReactNode[] = [
  <circle key="ring" cx="32" cy="32" r="12" fill="none" stroke="#fff" strokeWidth="5" />,
  <rect key="diamond" x="20" y="20" width="24" height="24" rx="4" fill="#fff" fillOpacity=".9" transform="rotate(45 32 32)" />,
  <path key="triangle" d="M32 16 48 46H16Z" fill="#fff" fillOpacity=".9" />,
  <path key="plus" d="M18 32h28M32 18v28" stroke="#fff" strokeWidth="6" strokeLinecap="round" />,
  <g key="dots">
    <circle cx="24" cy="32" r="7" fill="#fff" />
    <circle cx="40" cy="32" r="7" fill="#fff" fillOpacity=".6" />
  </g>,
  <path key="chevron" d="M20 40 32 22l12 18" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />,
  <g key="squares">
    <rect x="18" y="18" width="12" height="12" rx="3" fill="#fff" />
    <rect x="34" y="34" width="12" height="12" rx="3" fill="#fff" fillOpacity=".6" />
  </g>,
  <path key="pie" d="M32 18a14 14 0 1 0 14 14H32Z" fill="#fff" fillOpacity=".9" />,
]

export function AgentIcon({ icon: Icon, name, className }: AgentIconProps) {
  const gradientId = useId()
  const avatar = getAgentAvatar(name)

  return (
    <div
      role="img"
      aria-label={`${name || "Agent"} avatar`}
      className={cn("relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg", className)}
    >
      <svg viewBox="0 0 64 64" aria-hidden className="absolute inset-0 size-full">
        <defs>
          <linearGradient id={gradientId} gradientTransform={`rotate(${avatar.angle} .5 .5)`}>
            <stop offset="0" stopColor={avatar.from} />
            <stop offset="1" stopColor={avatar.to} />
          </linearGradient>
        </defs>
        <rect width="64" height="64" fill={`url(#${gradientId})`} />
        <circle cx={avatar.blobX} cy={avatar.blobY} r="22" fill="#fff" fillOpacity=".14" />
        {!Icon && glyphs[avatar.glyph]}
      </svg>
      {Icon && <Icon className="relative size-1/2 text-white" />}
    </div>
  )
}
