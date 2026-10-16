export const MAX_AGENT_TAGS = 4

export function limitTags(tags: string[] | undefined): string[] {
  return (tags ?? []).slice(0, MAX_AGENT_TAGS)
}

export function tagHref(tag: string): string {
  return `/marketplace?tag=${encodeURIComponent(tag)}`
}
