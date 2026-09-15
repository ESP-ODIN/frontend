import { Code2, Command } from "lucide-react"

import type { Agent } from "@/components/blocks/agent-icon"

export const agents: Agent[] = [
  {
    slug: "code-reviewer",
    name: "code-reviewer",
    author: "@anthropic",
    description: "Reviews pull requests, flags regressions and proposes inline diffs in CI.",
    tags: ["Workflow", "GitHub", "CI"],
    stars: "4.2k",
    downloads: "128k",
    version: "v2.4.1",
    icon: Code2,
    color: "primary",
  },
  {
    slug: "rag-index",
    name: "rag-index",
    author: "@vercel-labs",
    description: "Builds, refreshes and queries vector indexes from your docs and codebase.",
    tags: ["Agent", "RAG", "Embeddings"],
    stars: "2.8k",
    downloads: "94k",
    version: "v1.7.0",
    icon: Command,
    color: "amber",
  },
  {
    slug: "sql-analyst",
    author: "@postgres",
    name: "sql-analyst",
    description: "Connects to your warehouse, writes SQL, and explains results in plain English.",
    tags: ["Workflow", "Data", "SQL"],
    stars: "3.6k",
    downloads: "71k",
    version: "v0.9.4",
    label: "pg",
    color: "blue",
  },
]
