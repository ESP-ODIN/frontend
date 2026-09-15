import { agents } from "@/lib/data/agents"
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

const overrides: Record<string, Partial<AgentDetail>> = {
  "code-reviewer": {
    categoryLabel: "Developer tools",
    categorySlug: "developer-tools",
    updatedLabel: "il y a 2h",
    installsLabel: "128k",
    starsLabel: "4,218",
    forksLabel: "312",
    ratingLabel: "4.6 / 5",
    runtimeLabel: "TypeScript",
    uptimeLabel: "99.98%",
    license: "MIT",
    publishedLabel: "mars 2025",
    sizeLabel: "1.4 MB",
    overview: [
      "code-reviewer s'intègre dans votre pipeline CI et examine chaque pull request contre les conventions de votre codebase — style, sécurité, régressions potentielles. Il propose des diffs inline directement dans votre interface de revue (GitHub, GitLab, Bitbucket).",
      "La v2.4 introduit le mode explain regression : lorsqu'une régression est détectée, l'agent retrace la chaîne de causalité entre la modification et l'effet observé dans les tests.",
    ],
    installSteps: [
      { comment: "1. Installer l'agent", command: "odin install code-reviewer" },
      {
        comment: "2. Lancer une revue sur la branche courante",
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
        title: "Régressions logiques",
        description: "compare le comportement attendu (tests existants) aux changements introduits.",
      },
      {
        title: "Sécurité",
        description: "détecte les injections, les secrets exposés, les dépendances vulnérables.",
      },
      {
        title: "Style & conventions",
        description: "s'adapte à votre ESLint / Prettier config existante.",
      },
      {
        title: "Performance",
        description: "signale les N+1, les re-renders inutiles, les allocations prévisibles.",
      },
      {
        title: "Documentation",
        description: "vérifie que les fonctions publiques modifiées ont des JSDoc à jour.",
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

function toTitleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function toSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
}

function genericDetail(agent: Agent): AgentDetail {
  const category = agent.tags[0] ?? "Agents"

  return {
    categoryLabel: toTitleCase(category),
    categorySlug: toSlug(category),
    updatedLabel: "il y a quelques jours",
    installsLabel: agent.downloads,
    starsLabel: agent.stars,
    forksLabel: "—",
    ratingLabel: "— / 5",
    runtimeLabel: agent.tags[1] ?? "Multi-runtime",
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
      description: `Vérifications liées à ${tag.toLowerCase()}.`,
    })),
    permissions: [
      { label: "net:read", granted: true },
      { label: "fs:read", granted: true },
      { label: "fs:write", granted: false },
      { label: "env, shell", granted: false },
    ],
    dependencies: ["@anthropic/sdk ^0.24"],
    similar: agents.filter((a) => a.slug !== agent.slug).slice(0, 3).map((a) => a.slug),
  }
}

export function getAgent(slug: string): Agent | null {
  return agents.find((item) => item.slug === slug) ?? null
}

// Deliberately excludes Agent fields (icon is a component reference and
// can't be passed as a prop into a Client Component).
export function getAgentDetail(slug: string): AgentDetail | null {
  const agent = agents.find((item) => item.slug === slug)
  if (!agent) return null

  return { ...genericDetail(agent), ...overrides[slug] }
}

export function getSimilarAgents(slugs: string[]): Agent[] {
  return slugs
    .map((slug) => agents.find((agent) => agent.slug === slug))
    .filter((agent): agent is Agent => Boolean(agent))
}
