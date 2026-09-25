import type { Agent } from "@/components/blocks/agent-icon"

export type AgentDetail = {
  categoryLabel: string
  categorySlug: string
  updatedLabel: string
  installsLabel: string
  starsLabel: string
  forksLabel: string
  ratingLabel: string
  runtimeLabel: string
  uptimeLabel: string
  license: string
  publishedLabel: string
  sizeLabel: string
  overview: string[]
  installSteps: { comment: string; command: string }[]
  configFilename: string
  configLines: string[]
  checks: { title: string; description: string }[]
  permissions: { label: string; granted: boolean }[]
  dependencies: string[]
  similar: string[]
}

export const overrides: Record<string, Partial<AgentDetail>> = {
  "code-reviewer": {
    categoryLabel: "Developer tools",
    categorySlug: "developer-tools",
    updatedLabel: "2h ago",
    installsLabel: "128k",
    starsLabel: "4,218",
    forksLabel: "312",
    ratingLabel: "4.6 / 5",
    runtimeLabel: "TypeScript",
    uptimeLabel: "99.98%",
    license: "MIT",
    publishedLabel: "March 2025",
    sizeLabel: "1.4 MB",
    overview: [
      "code-reviewer plugs into your CI pipeline and reviews every pull request against your codebase's conventions — style, security, potential regressions. It suggests inline diffs directly in your review interface (GitHub, GitLab, Bitbucket).",
      "v2.4 introduces the explain regression mode: when a regression is detected, the agent traces the chain of causality between the change and the effect observed in the tests.",
    ],
    installSteps: [
      { comment: "1. Installer l'agent", command: "odin install code-reviewer" },
      {
        comment: "2. Run a review on the current branch",
        command: "odin run code-reviewer --path . --target origin/main",
      },
    ],
    configFilename: ".odin/code-reviewer.json",
    configLines: [
      "{",
      `  "model": "claude-3-5-sonnet",`,
      `  "threshold": "medium",`,
      `  "focus": ["logic", "security", "style"],`,
      `  "ignore": ["*.test.ts", "*.md", "dist/**"]`,
      "}",
    ],
    checks: [
      {
        title: "Logic regressions",
        description: "compares expected behavior (existing tests) with the introduced changes.",
      },
      {
        title: "Security",
        description: "detects injections, exposed secrets and vulnerable dependencies.",
      },
      {
        title: "Style & conventions",
        description: "adapts to your existing ESLint / Prettier config.",
      },
      {
        title: "Performance",
        description: "flags N+1 queries, unnecessary re-renders and predictable allocations.",
      },
      {
        title: "Documentation",
        description: "checks that modified public functions have up-to-date JSDoc.",
      },
    ],
    permissions: [
      { label: "net:read", granted: true },
      { label: "fs:read", granted: true },
      { label: "fs:write", granted: false },
      { label: "env, shell", granted: false },
    ],
    dependencies: ["@anthropic/sdk ^0.24", "zod ^3.22", "@octokit/rest ^20"],
    similar: ["pr-summarizer", "changelog-bot", "pentest-recon"],
  },
}

const languageLabels: Record<Agent["language"], string> = {
  typescript: "TypeScript",
  python: "Python",
  rust: "Rust",
  "multi-runtime": "Multi-runtime",
}

export function genericDetail(agent: Agent, allAgents: Agent[]): AgentDetail {
  return {
    categoryLabel: agent.category.label,
    categorySlug: agent.category.slug,
    updatedLabel: "a few days ago",
    installsLabel: agent.downloads,
    starsLabel: agent.stars,
    forksLabel: "—",
    ratingLabel: "— / 5",
    runtimeLabel: languageLabels[agent.language],
    uptimeLabel: "—",
    license: "MIT",
    publishedLabel: "2025",
    sizeLabel: "—",
    overview: [agent.description],
    installSteps: [
      { comment: "1. Installer l'agent", command: `odin install ${agent.name}` },
      { comment: "2. Lancer l'agent", command: `odin run ${agent.name}` },
    ],
    configFilename: `.odin/${agent.name}.json`,
    configLines: ["{", `  "model": "claude-3-5-sonnet"`, "}"],
    checks: agent.tags.map((tag) => ({
      title: tag,
      description: `Checks related to ${tag.toLowerCase()}.`,
    })),
    permissions: [
      { label: "net:read", granted: true },
      { label: "fs:read", granted: true },
      { label: "fs:write", granted: false },
      { label: "env, shell", granted: false },
    ],
    dependencies: ["@anthropic/sdk ^0.24"],
    similar: allAgents.filter((a) => a.slug !== agent.slug).slice(0, 3).map((a) => a.slug),
  }
}
