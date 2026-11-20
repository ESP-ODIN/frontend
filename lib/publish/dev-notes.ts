/**
 * Notes des DevMarks du formulaire de publication : ce que POST /catalog/agents ne prend pas encore.
 * Le body accepte seulement name, creator_id, category, agent_type, runtime, description et
 * readme_markdown.
 */
export const PUBLISH_MISSING_NOTES = {
  version:
    "version: not in POST /catalog/agents (agent_version table exists but no route writes it)",
  tags: "tags: not in POST /catalog/agents, not sent",
  changelog:
    "changelog: not in POST /catalog/agents (agent_version.changelog has no write route)",
  entrypoint: "run.entrypoint: not in POST /catalog/agents, not sent",
  args: "run.args: not in POST /catalog/agents, not sent",
  permissions:
    "permissions: not in POST /catalog/agents, nothing in this step is sent",
  manifest:
    "manifest: not stored, only name, category, type, runtime, description and README are sent",
  repository:
    "repository link and manifest source: not in POST /catalog/agents (agent_version.repo_link has no write route)",
  readme:
    "README: read from raw.githubusercontent.com on the default branch, sent empty if the repo is private or the file is missing",
} as const
