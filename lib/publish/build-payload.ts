import { buildManifest } from "./manifest-toml"
import type {
  ManifestSource,
  PublishAgentPayload,
  PublishFormData,
} from "./types"

export function buildPublishPayload(
  data: PublishFormData
): PublishAgentPayload {
  return {
    manifest: buildManifest(data),
    manifest_source: data.source.kind as ManifestSource,
  }
}
