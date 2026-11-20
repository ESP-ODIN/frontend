import type { AgentDetail } from "@/lib/api/agents"
import { AgentReadme } from "@/components/agent/detail/readme"

type AgentOverviewProps = {
  detail: AgentDetail
}

/** La description est déjà dans l'en-tête de la page : l'Overview n'affiche que le README. */
export function AgentOverview({ detail }: AgentOverviewProps) {
  if (!detail.readme) {
    return (
      <p className="rounded-xl border border-dashed border-border/70 px-4 py-10 text-center text-sm text-muted-foreground">
        This agent doesn&apos;t have a README yet.
      </p>
    )
  }

  return <AgentReadme markdown={detail.readme} />
}
