import type {
  ManifestSource,
  PublishAgentPayload,
  PublishFormData,
  RuntimeId,
} from "./types"

export function buildPublishPayload(
  data: PublishFormData
): PublishAgentPayload {
  const { terminalAccess, allowedCommands } = data.permissions

  return {
    name: data.general.packageName,
    description: data.general.description,
    agent_type: data.general.type,
    category: data.general.category,
    runtime: data.general.runtime as RuntimeId,
    tags: data.general.tags,
    readme_markdown: data.manifest.readme,
    repository_url: data.manifest.repoUrl,
    homepage_url: data.manifest.homepageUrl || null,
    manifest_source: data.manifest.source as ManifestSource,
    version: {
      number: data.manifest.version,
      changelog_markdown: data.manifest.changelog,
      entrypoint: data.manifest.entrypoint,
      args: data.manifest.args,
    },
    permissions: {
      network: data.permissions.internetAccess,
      filesystem: data.permissions.filesystemAccess,
      terminal: {
        access: terminalAccess,
        commands: terminalAccess === "restricted" ? allowedCommands : [],
      },
      env_vars: data.permissions.envVars,
    },
  }
}
