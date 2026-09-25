import {
  Bot,
  FilePen,
  FolderGit2,
  Workflow,
  type LucideIcon,
} from "lucide-react"

import type {
  AgentTypeOption,
  FilesystemAccess,
  ManifestSource,
  PublishFormData,
  RuntimeId,
  TerminalAccess,
  WizardStepId,
} from "./types"

export const AGENT_TYPE_OPTIONS: AgentTypeOption[] = [
  {
    id: "workflow",
    label: "Workflow",
    description:
      "A sequence of deterministic steps the agent runs in order.",
    icon: Workflow,
  },
  {
    id: "autonomous",
    label: "Autonomous",
    description:
      "The agent builds and adapts its own plan to reach the goal.",
    icon: Bot,
  },
]

export const RUNTIME_OPTIONS: { id: RuntimeId; label: string }[] = [
  { id: "python3", label: "Python 3" },
  { id: "node", label: "Node.js" },
  { id: "binary", label: "Native binary" },
  { id: "docker", label: "Docker" },
]

export const FILESYSTEM_ACCESS_OPTIONS: {
  id: FilesystemAccess
  label: string
}[] = [
  { id: "none", label: "No access" },
  { id: "read-only", label: "Read only" },
  { id: "read-write", label: "Read / write" },
]

export const TERMINAL_ACCESS_OPTIONS: {
  id: TerminalAccess
  label: string
  description: string
}[] = [
  {
    id: "none",
    label: "No access",
    description: "The agent doesn't run any system command.",
  },
  {
    id: "restricted",
    label: "Allowed commands only",
    description: "The agent can only run the listed commands.",
  },
  {
    id: "full",
    label: "Full access",
    description: "The agent can run any shell command.",
  },
]

export const MANIFEST_SOURCE_OPTIONS: {
  id: ManifestSource
  label: string
  description: string
  icon: LucideIcon
}[] = [
  {
    id: "repository",
    label: "Import from GitHub",
    description:
      "We scan the manifest.toml in your repository and prefill the form.",
    icon: FolderGit2,
  },
  {
    id: "form",
    label: "Create with the form",
    description:
      "No manifest.toml? Fill it in here, it will be stored on Odin's side.",
    icon: FilePen,
  },
]

export const MAX_TAGS = 4

export const SECURITY_REVIEW = {
  estimatedDuration: "24 to 48 hours",
  checks: [
    "Static code analysis",
    "Vulnerability scan",
    "Declared permissions check",
    "Sandboxed test run",
  ],
}

export const WIZARD_STEPS: {
  id: WizardStepId
  label: string
  tables: string[]
}[] = [
  { id: "source", label: "Source", tables: [] },
  { id: "package", label: "Package", tables: ["package"] },
  { id: "run", label: "Run", tables: ["run"] },
  {
    id: "permissions",
    label: "Permissions",
    tables: ["permissions", "permissions.terminal"],
  },
  { id: "review", label: "Summary", tables: [] },
]

export const DEFAULT_README_FILE = "README.md"

export const DEFAULT_FORM_DATA: PublishFormData = {
  source: {
    kind: "",
    repoUrl: "",
    scannedRepoUrl: "",
    readmeFile: DEFAULT_README_FILE,
  },
  package: {
    name: "",
    version: "",
    description: "",
    type: "workflow",
    category: "",
    tags: [],
    changelog: "",
  },
  run: {
    runtime: "",
    entrypoint: "",
    args: [],
  },
  permissions: {
    network: false,
    filesystem: "none",
    env: [],
    terminal: {
      access: "none",
      commands: [],
    },
  },
}
