import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

export type AppPage = {
  href: string
  label: string
  description: string
}

const APP_DIR = path.join(process.cwd(), "app")
const PAGE_FILE = /^page\.(tsx|ts|jsx|js)$/

function readMetadataField(source: string, field: "title" | "description") {
  return source.match(new RegExp(`${field}:\\s*"([^"]+)"`))?.[1]
}

function labelFromHref(href: string) {
  if (href === "/") return "Home"
  const segment = href.split("/").pop() ?? ""
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Mirrors the App Router conventions: (group) folders don't appear in the URL,
// [dynamic] segments need a param so they can't be listed, _private and api aren't pages.
async function collectPages(dir: string, segments: string[]): Promise<AppPage[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const pages: AppPage[] = []

  for (const entry of entries) {
    if (entry.isFile() && PAGE_FILE.test(entry.name)) {
      const href = `/${segments.join("/")}`
      const source = await readFile(path.join(dir, entry.name), "utf8")
      pages.push({
        href,
        label: readMetadataField(source, "title")?.replace(/ — Odin$/, "") ?? labelFromHref(href),
        description: readMetadataField(source, "description") ?? "",
      })
    }

    if (!entry.isDirectory()) continue
    const name = entry.name
    if (name.startsWith("[") || name.startsWith("_") || name === "api") continue

    const isGroup = name.startsWith("(") && name.endsWith(")")
    pages.push(...(await collectPages(path.join(dir, name), isGroup ? segments : [...segments, name])))
  }

  return pages
}

export async function getAppPages(): Promise<AppPage[]> {
  const pages = await collectPages(APP_DIR, [])
  return pages.sort((a, b) => a.href.localeCompare(b.href))
}
