import Markdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

// GitHub-flavoured Markdown (tables, task lists, strikethrough, autolinks) rendered
// as React elements — raw HTML in the source is ignored, so user content is safe to render.
const components: Components = {
  h1: ({ node: _node, ...props }) => (
    <h1
      className="mt-6 mb-4 border-b border-muted/40 pb-2 font-heading text-2xl font-bold first:mt-0"
      {...props}
    />
  ),
  h2: ({ node: _node, ...props }) => (
    <h2
      className="mt-6 mb-3 border-b border-muted/40 pb-1.5 font-heading text-xl font-bold first:mt-0"
      {...props}
    />
  ),
  h3: ({ node: _node, ...props }) => (
    <h3
      className="mt-5 mb-2 font-heading text-lg font-bold first:mt-0"
      {...props}
    />
  ),
  h4: ({ node: _node, ...props }) => (
    <h4 className="mt-4 mb-2 font-heading font-bold first:mt-0" {...props} />
  ),
  p: ({ node: _node, ...props }) => (
    <p className="my-3 leading-relaxed first:mt-0 last:mb-0" {...props} />
  ),
  a: ({ node: _node, ...props }) => (
    <a
      className="font-medium text-primary underline-offset-2 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: ({ node: _node, className, ...props }) => (
    <ul
      className={cn(
        "my-3 list-disc space-y-1 pl-6",
        // Task lists: no bullet, the checkbox plays that role.
        className?.includes("contains-task-list") && "list-none pl-1",
        className
      )}
      {...props}
    />
  ),
  ol: ({ node: _node, ...props }) => (
    <ol className="my-3 list-decimal space-y-1 pl-6" {...props} />
  ),
  li: ({ node: _node, className, ...props }) => (
    <li
      className={cn(
        "leading-relaxed marker:text-muted-foreground",
        className?.includes("task-list-item") && "flex items-start gap-2",
        className
      )}
      {...props}
    />
  ),
  input: ({ node: _node, ...props }) => (
    <input className="mt-1.5 accent-primary" disabled {...props} />
  ),
  blockquote: ({ node: _node, ...props }) => (
    <blockquote
      className="my-3 border-l-4 border-primary/40 pl-4 text-muted-foreground"
      {...props}
    />
  ),
  code: ({ node: _node, className, ...props }) => (
    <code
      className={cn(
        "rounded-md bg-muted/15 px-1.5 py-0.5 font-mono text-[0.85em]",
        className
      )}
      {...props}
    />
  ),
  pre: ({ node: _node, ...props }) => (
    <pre
      className="my-3 overflow-x-auto rounded-xl border border-muted/40 bg-muted/10 p-4 font-mono text-xs leading-relaxed [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-xs"
      {...props}
    />
  ),
  hr: ({ node: _node, ...props }) => (
    <hr className="my-6 border-muted/40" {...props} />
  ),
  table: ({ node: _node, ...props }) => (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: ({ node: _node, ...props }) => (
    <th
      className="border border-muted/40 bg-muted/10 px-3 py-1.5 text-left font-semibold"
      {...props}
    />
  ),
  td: ({ node: _node, ...props }) => (
    <td className="border border-muted/40 px-3 py-1.5" {...props} />
  ),
  img: ({ node: _node, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote README images
    <img
      alt={alt ?? ""}
      className="my-3 inline-block max-w-full rounded-lg"
      {...props}
    />
  ),
}

export function MarkdownPreview({
  source,
  className,
}: {
  source: string
  className?: string
}) {
  return (
    <div className={cn("text-sm text-foreground", className)}>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </Markdown>
    </div>
  )
}
