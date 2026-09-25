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
      "Une suite d'étapes déterministes que l'agent exécute dans l'ordre.",
    icon: Workflow,
  },
  {
    id: "autonomous",
    label: "Autonomous",
    description:
      "L'agent construit et adapte son propre plan pour atteindre l'objectif.",
    icon: Bot,
  },
]

export const RUNTIME_OPTIONS: { id: RuntimeId; label: string }[] = [
  { id: "python3", label: "Python 3" },
  { id: "node", label: "Node.js" },
  { id: "binary", label: "Binaire natif" },
  { id: "docker", label: "Docker" },
]

export const FILESYSTEM_ACCESS_OPTIONS: {
  id: FilesystemAccess
  label: string
}[] = [
  { id: "none", label: "Aucun accès" },
  { id: "read-only", label: "Lecture seule" },
  { id: "read-write", label: "Lecture / écriture" },
]

export const TERMINAL_ACCESS_OPTIONS: {
  id: TerminalAccess
  label: string
  description: string
}[] = [
  {
    id: "none",
    label: "Aucun accès",
    description: "L'agent n'exécute aucune commande système.",
  },
  {
    id: "restricted",
    label: "Commandes autorisées uniquement",
    description: "L'agent ne peut exécuter que les commandes listées.",
  },
  {
    id: "full",
    label: "Accès complet",
    description: "L'agent peut exécuter n'importe quelle commande shell.",
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
    label: "Importer depuis GitHub",
    description:
      "On scanne le manifest.toml de votre dépôt et on préremplit le formulaire.",
    icon: FolderGit2,
  },
  {
    id: "form",
    label: "Créer avec le formulaire",
    description:
      "Pas de manifest.toml ? Renseignez-le ici, il sera enregistré côté Odin.",
    icon: FilePen,
  },
]

export const MAX_TAGS = 4

export const SECURITY_REVIEW = {
  estimatedDuration: "24 à 48 heures",
  checks: [
    "Analyse statique du code",
    "Scan des vulnérabilités",
    "Vérification des permissions déclarées",
    "Exécution de tests en sandbox",
  ],
}

export const WIZARD_STEPS: {
  id: WizardStepId
  label: string
  tables: string[]
}[] = [
  { id: "source", label: "Source", tables: [] },
  { id: "package", label: "Package", tables: ["package"] },
  { id: "run", label: "Exécution", tables: ["run"] },
  {
    id: "permissions",
    label: "Permissions",
    tables: ["permissions", "permissions.terminal"],
  },
  { id: "review", label: "Récapitulatif", tables: [] },
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
