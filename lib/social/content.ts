import type { PostKind } from "@/lib/social/types"

/**
 * L'API social ne stocke qu'un `content` texte. Le front y encode le reste avec des conventions
 * lisibles telles quelles par un humain :
 * - 1re ligne seule suivie d'une ligne vide = titre ;
 * - hashtags (#rag, #ci…) = tags, dont #report / #tutorial / #question / #showcase = genre ;
 * - hashtag égal au nom d'un agent du catalogue = agent cité (« re: code-reviewer »).
 */

export const MAX_POST_LENGTH = 2000
export const MAX_TITLE_LENGTH = 140
export const MAX_MEDIA_URL_LENGTH = 255

export const POST_KINDS: {
  id: PostKind
  label: string
  filterLabel: string
  /** Hashtag qui encode le genre, null pour « General » (aucun hashtag). */
  tag: string | null
}[] = [
  { id: "general", label: "General", filterLabel: "General", tag: null },
  { id: "faq", label: "FAQ", filterLabel: "FAQ", tag: "faq" },
  {
    id: "tutorial",
    label: "Tutorial",
    filterLabel: "Tutorials",
    tag: "tutorial",
  },
  { id: "rex", label: "REX", filterLabel: "REX", tag: "rex" },
]

const KIND_BY_TAG: Record<string, PostKind> = {
  faq: "faq",
  question: "faq",
  help: "faq",
  tutorial: "tutorial",
  howto: "tutorial",
  rex: "rex",
  report: "rex",
}

/** Genre encodé par un hashtag (#faq, #question…), null si c'est un tag ordinaire. */
export function kindFromTag(tag: string): PostKind | null {
  return KIND_BY_TAG[tag] ?? null
}

const HASHTAG_RE = /(^|[\s(])#([\p{L}\p{N}][\p{L}\p{N}_-]{0,39})/gu
const TAGS_LINE_RE = /^(?:\s*#[\p{L}\p{N}][\p{L}\p{N}_-]{0,39})+\s*$/u

/** "Mon Premier Agent" -> "mon-premier-agent" : forme d'un nom d'agent en hashtag. */
export function toTag(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}_-]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
}

export type ParsedPost = {
  title: string | null
  /** Texte sans le titre ni la ligne finale de hashtags. */
  body: string
  /** Hashtags en minuscules, sans doublon, dans l'ordre d'apparition. */
  tags: string[]
  kind: PostKind
}

export function parsePost(content: string): ParsedPost {
  const text = content.replace(/\r\n/g, "\n").trim()
  const tags = [
    ...new Set([...text.matchAll(HASHTAG_RE)].map((m) => m[2].toLowerCase())),
  ]
  const kind = tags.map((tag) => KIND_BY_TAG[tag]).find(Boolean) ?? "general"

  const paragraphs = text.split(/\n{2,}/)
  // La ligne de hashtags ajoutée par le composer est affichée en chips, pas dans le texte.
  if (
    paragraphs.length > 1 &&
    TAGS_LINE_RE.test(paragraphs[paragraphs.length - 1])
  ) {
    paragraphs.pop()
  }
  // Un titre n'a de sens qu'avec un texte en dessous : un post d'une ligne reste du texte.
  let title: string | null = null
  if (
    paragraphs.length > 1 &&
    !paragraphs[0].includes("\n") &&
    paragraphs[0].length <= MAX_TITLE_LENGTH &&
    !TAGS_LINE_RE.test(paragraphs[0])
  ) {
    title = paragraphs.shift()!.trim()
  }

  return { title, body: paragraphs.join("\n\n").trim(), tags, kind }
}

export type ComposeInput = {
  title: string
  body: string
  kind: PostKind | null
  tags: string[]
  agents: string[]
}

/** Inverse de parsePost : ce que le composer envoie dans `content`. */
export function composePost({
  title,
  body,
  kind,
  tags,
  agents,
}: ComposeInput): string {
  const kindTag = POST_KINDS.find((option) => option.id === kind)?.tag
  const allTags = [
    ...new Set(
      [kindTag, ...agents.map(toTag), ...tags.map(toTag)].filter(Boolean)
    ),
  ]
  // Pas de doublon avec les hashtags déjà écrits dans le texte.
  const inline = new Set(parsePost(body).tags)
  const trailing = allTags.filter((tag) => !inline.has(tag!))

  return [title.trim(), body.trim(), trailing.map((tag) => `#${tag}`).join(" ")]
    .filter(Boolean)
    .join("\n\n")
}

/** Découpe un texte en morceaux texte / hashtag / lien, pour le rendu. */
export type ContentToken =
  | { type: "text"; value: string }
  | { type: "tag"; value: string }
  | { type: "link"; value: string }

const TOKEN_RE =
  /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])|(^|[\s(])#([\p{L}\p{N}][\p{L}\p{N}_-]{0,39})/gu

export function tokenize(text: string): ContentToken[] {
  const tokens: ContentToken[] = []
  let last = 0
  for (const match of text.matchAll(TOKEN_RE)) {
    const start = match.index ?? 0
    if (match[1]) {
      if (start > last)
        tokens.push({ type: "text", value: text.slice(last, start) })
      tokens.push({ type: "link", value: match[1] })
      last = start + match[1].length
    } else {
      const lead = match[2] ?? ""
      const tagStart = start + lead.length
      if (tagStart > last)
        tokens.push({ type: "text", value: text.slice(last, tagStart) })
      tokens.push({ type: "tag", value: match[3].toLowerCase() })
      last = tagStart + 1 + match[3].length
    }
  }
  if (last < text.length) tokens.push({ type: "text", value: text.slice(last) })
  return tokens
}

export function isMediaUrlValid(url: string): boolean {
  if (!url) return true
  if (url.length > MAX_MEDIA_URL_LENGTH) return false
  try {
    return new URL(url).protocol === "https:"
  } catch {
    return false
  }
}
