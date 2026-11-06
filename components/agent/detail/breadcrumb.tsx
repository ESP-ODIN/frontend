import { Fragment } from "react"
import Link from "next/link"

import { limitTags, tagHref } from "@/lib/agents/tags"
import { DevMark } from "@/components/dev/dev-mark"

type AgentBreadcrumbProps = {
  tags?: string[]
  name: string
}

export function AgentBreadcrumb({ tags, name }: AgentBreadcrumbProps) {
  const visibleTags = limitTags(tags)

  return (
    <p className="flex flex-wrap items-center gap-x-1.5 font-mono text-sm text-muted-foreground">
      <Link href="/marketplace" className="hover:text-foreground">
        Marketplace
      </Link>
      <span>/</span>
      {visibleTags.length > 0 && (
        <>
          <span className="flex flex-wrap items-center gap-x-1.5">
            {visibleTags.map((tag, i) => (
              <Fragment key={tag}>
                {i > 0 && <span className="text-muted-foreground/50">·</span>}
                <Link href={tagHref(tag)} className="transition-colors hover:text-primary">
                  #{tag}
                </Link>
              </Fragment>
            ))}
          </span>
          <span>/</span>
        </>
      )}
      <span className="text-foreground">{name}</span>
      <DevMark kind="missing" note="tags: no tags column in the DB" />
    </p>
  )
}
