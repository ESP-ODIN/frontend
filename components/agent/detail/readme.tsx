"use client"

import {
  Children,
  isValidElement,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { BookOpen, Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

/** Texte brut d'un nœud React, pour les ancres des titres et le bouton copier. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (isValidElement<{ children?: ReactNode }>(node))
    return textOf(node.props.children)
  return ""
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
}

function heading(level: 1 | 2 | 3 | 4, className: string) {
  const Tag = `h${level}` as const
  return function Heading({ children }: { children?: ReactNode }) {
    const id = slugify(textOf(children))
    return (
      <Tag id={id} className={cn("group scroll-mt-28", className)}>
        {children}
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
        >
          #
        </a>
      </Tag>
    )
  }
}

function CodeBlock({ language, code }: { language?: string; code: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="group/code relative overflow-hidden rounded-xl bg-[#14110C]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-1.5">
        <span className="font-mono text-[11px] tracking-wider text-[#F6F1E6]/40 uppercase">
          {language ?? "text"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy the code"
          className="rounded-md p-1 text-[#F6F1E6]/50 transition-colors hover:bg-white/10 hover:text-[#F6F1E6]"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-[#F6F1E6]">
        <code>{code}</code>
      </pre>
    </div>
  )
}

const components: Components = {
  h1: heading(
    1,
    "mt-8 mb-4 border-b border-border/60 pb-2 text-2xl font-bold text-foreground first:mt-0"
  ),
  h2: heading(
    2,
    "mt-8 mb-3 border-b border-border/60 pb-2 text-xl font-bold text-foreground first:mt-0"
  ),
  h3: heading(3, "mt-6 mb-2 text-lg font-semibold text-foreground first:mt-0"),
  h4: heading(4, "mt-5 mb-2 font-semibold text-foreground first:mt-0"),
  p: ({ children }) => (
    <p className="my-3 leading-7 text-foreground/80">{children}</p>
  ),
  a: ({ href, children }) => {
    const external = Boolean(href && /^https?:\/\//.test(href))
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
      >
        {children}
      </a>
    )
  },
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  ul: ({ children, className }) => (
    <ul
      className={cn(
        "my-3 flex flex-col gap-1.5 pl-6 text-foreground/80",
        className?.includes("contains-task-list")
          ? "list-none pl-1"
          : "list-disc marker:text-primary/60"
      )}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 flex list-decimal flex-col gap-1.5 pl-6 text-foreground/80 marker:font-mono marker:text-sm marker:text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children, className }) => (
    <li
      className={cn(
        "pl-1 leading-7",
        className?.includes("task-list-item") && "flex items-start gap-2 pl-0"
      )}
    >
      {children}
    </li>
  ),
  input: (props: ComponentProps<"input">) =>
    props.type === "checkbox" ? (
      <input
        type="checkbox"
        checked={props.checked}
        disabled
        readOnly
        className="mt-2 size-3.5 shrink-0 accent-primary"
      />
    ) : null,
  blockquote: ({ children }) => (
    <blockquote className="my-4 rounded-r-lg border-l-4 border-primary/50 bg-primary/5 px-4 py-1 text-foreground/70 [&>p]:my-2">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-border/60" />,
  pre: ({ children }) => {
    // react-markdown met un <code class="language-xxx"> dans le <pre>.
    const child = Children.toArray(children)[0]
    if (isValidElement<{ className?: string; children?: ReactNode }>(child)) {
      const language = child.props.className?.match(/language-([\w-]+)/)?.[1]
      const code = textOf(child.props.children).replace(/\n$/, "")
      return <CodeBlock language={language} code={code} />
    }
    return <pre>{children}</pre>
  },
  code: ({ children, className }) => (
    // Seul le code en ligne arrive ici : les blocs sont rendus par `pre`.
    <code
      className={cn(
        "rounded-md border border-border/60 bg-muted/15 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
        className
      )}
    >
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/10">{children}</thead>,
  th: ({ children, style }) => (
    <th
      style={style}
      className="border-b border-border/60 px-4 py-2 text-left font-semibold text-foreground"
    >
      {children}
    </th>
  ),
  td: ({ children, style }) => (
    <td
      style={style}
      className="border-b border-border/40 px-4 py-2 text-foreground/80 [tr:last-child>&]:border-b-0"
    >
      {children}
    </td>
  ),
  img: ({ src, alt }) =>
    typeof src === "string" && /^https?:\/\//.test(src) ? (
      // eslint-disable-next-line @next/next/no-img-element -- images externes de README, tailles inconnues
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        className="my-2 inline-block max-w-full rounded-lg align-middle"
      />
    ) : (
      // Chemin relatif au repo : on n'a pas l'URL du repo pour le résoudre.
      <span className="text-sm text-muted-foreground italic">
        [{alt || "image"}]
      </span>
    ),
}

/**
 * README de l'agent (readme_markdown de l'API marketplace), en GitHub Flavored Markdown. Le HTML
 * brut n'est pas interprété (pas de rehype-raw) : il est affiché en texte, pas de risque d'injection.
 */
export function AgentReadme({ markdown }: { markdown: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60">
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/5 px-5 py-3">
        <BookOpen className="size-4 text-muted-foreground" />
        <span className="font-mono text-sm font-medium text-foreground">
          README.md
        </span>
      </div>
      <article className="min-w-0 px-5 py-6 break-words sm:px-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {markdown}
        </ReactMarkdown>
      </article>
    </div>
  )
}
