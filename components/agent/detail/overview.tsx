import type { AgentDetail } from "@/lib/api/agents"
import { CodeBlock } from "@/components/shared/code-block"
import { DevMark } from "@/components/dev/dev-mark"

type AgentOverviewProps = {
  detail: AgentDetail
}

export function AgentOverview({ detail }: AgentOverviewProps) {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="border-b border-border/60 pb-3 text-2xl font-bold text-foreground">
          Overview
        </h2>
        {detail.overview.map((paragraph, i) => (
          <p key={i} className="text-foreground/80">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="border-b border-border/60 pb-3 text-2xl font-bold text-foreground">
          Quick install <DevMark kind="mock" note="install steps generated from the agent name" />
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
          Configuration <DevMark kind="mock" note="hardcoded config, manifest_toml isn't exposed by the API" />
        </h2>
        <p className="text-foreground/80">
          Create a{" "}
          <code className="rounded bg-muted/15 px-1.5 py-0.5 font-mono text-sm">
            {detail.configFilename}
          </code>{" "}
          file at the root of the repo:
        </p>
        <CodeBlock lines={detail.configLines} />
      </section>
    </div>
  )
}
