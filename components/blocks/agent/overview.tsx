import type { AgentDetail } from "@/lib/api/agents"
import { CodeBlock } from "@/components/blocks/code-block"

type AgentOverviewProps = {
  detail: AgentDetail
}

export function AgentOverview({ detail }: AgentOverviewProps) {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="border-b border-border/60 pb-3 text-2xl font-bold text-foreground">
          Vue d&apos;ensemble
        </h2>
        {detail.overview.map((paragraph, i) => (
          <p key={i} className="text-foreground/80">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="border-b border-border/60 pb-3 text-2xl font-bold text-foreground">
          Installation rapide
        </h2>
        <CodeBlock
          lines={detail.installSteps.flatMap((step, i) => [
            `# ${step.comment}`,
            `$ ${step.command}`,
            ...(i < detail.installSteps.length - 1 ? [""] : []),
          ])}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="border-b border-border/60 pb-3 text-2xl font-bold text-foreground">
          Configuration
        </h2>
        <p className="text-foreground/80">
          Créez un fichier{" "}
          <code className="rounded bg-muted/15 px-1.5 py-0.5 font-mono text-sm">
            {detail.configFilename}
          </code>{" "}
          à la racine du repo :
        </p>
        <CodeBlock lines={detail.configLines} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="border-b border-border/60 pb-3 text-2xl font-bold text-foreground">
          Ce que l&apos;agent vérifie
        </h2>
        <ul className="flex flex-col gap-2">
          {detail.checks.map((check) => (
            <li key={check.title} className="flex gap-2 text-foreground/80">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground/40" />
              <p>
                <span className="font-semibold text-foreground">{check.title}</span> —{" "}
                {check.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
