"use client"

import { Bookmark, Check, Eye, ThumbsDown, ThumbsUp } from "lucide-react"

import type { AgentDetail } from "@/lib/api/agents"
import { CopyCommand } from "@/components/motion/copy-command"
import { ActionButton } from "@/components/blocks/agent/action-button"
import { formatCount, parseCount } from "@/lib/format-count"
import { useAgentInteractions } from "@/lib/hooks/use-agent-interactions"
import { useExplosion } from "@/components/motion/explosion-burst"
import { DevMark } from "@/components/dev/dev-mark"

type AgentInstallBarProps = {
  agentId: string
  agentName: string
  detail: AgentDetail
}

const SAVE_COLORS = ["#e85d04", "#ffb35c", "#ffd8a8", "#fbbf24"]
const FOLLOW_COLORS = ["#60a5fa", "#93c5fd", "#bfdbfe", "#e85d04", "#ffb35c"]

const PILL = "rounded-full border border-border bg-input/30 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md hover:shadow-black/5"

export function AgentInstallBar({ agentId, agentName, detail }: AgentInstallBarProps) {
  const { liked, disliked, saved, following, toggleLike, toggleDislike, toggleSave, toggleFollow } =
    useAgentInteractions(agentId)
  const like = useExplosion<HTMLSpanElement>()
  const dislike = useExplosion<HTMLSpanElement>()
  const save = useExplosion<HTMLSpanElement>()
  const follow = useExplosion<HTMLSpanElement>()

  const likesLabel = detail.likesLabel ?? "0"
  const savesLabel = detail.savesLabel ?? "0"
  const likesCount = formatCount(parseCount(likesLabel) + (liked ? 1 : 0), likesLabel)
  const savesCount = formatCount(parseCount(savesLabel) + (saved ? 1 : 0), savesLabel)

  function handleLike() {
    like.explode(liked ? { mode: "implode" } : {})
    toggleLike()
  }

  function handleDislike() {
    // No celebration for a dislike: only the soft implode, whichever way it toggles
    dislike.explode({ mode: "implode", count: 8 })
    toggleDislike()
  }

  function handleSave() {
    save.explode(saved ? { mode: "implode" } : { colors: SAVE_COLORS, count: 12 })
    toggleSave()
  }

  function handleFollow() {
    follow.explode(following ? { mode: "implode" } : { colors: FOLLOW_COLORS })
    toggleFollow()
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <CopyCommand
        command={`odin install ${agentName}`}
        className="max-w-full overflow-x-auto border-white/10 bg-[#14110C] hover:border-white/25"
      />

      <div
        role="group"
        aria-label="Rate this agent"
        className={`${PILL} inline-flex items-center ${liked ? "border-primary/50" : ""}`}
      >
        <span ref={like.containerRef} className="relative inline-flex">
          <ActionButton
            icon={ThumbsUp}
            label="Like"
            count={likesCount}
            pressed={liked}
            onClick={handleLike}
            iconAnimation="fx-icon-like"
            iconHover="group-hover/action:-translate-y-0.5 group-hover/action:-rotate-12"
            pressedClassName="bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
            className="h-[34px] rounded-r-none pr-3"
          />
        </span>
        <span aria-hidden className="h-5 w-px bg-border" />
        <span ref={dislike.containerRef} className="relative inline-flex">
          <ActionButton
            icon={ThumbsDown}
            aria-label="Dislike"
            pressed={disliked}
            onClick={handleDislike}
            iconAnimation="fx-icon-dislike"
            iconHover="group-hover/action:translate-y-0.5 group-hover/action:rotate-12"
            pressedClassName="bg-foreground/10 text-foreground hover:bg-foreground/15"
            className="h-[34px] rounded-l-none pr-3.5 pl-3"
          />
        </span>
      </div>

      <span ref={save.containerRef} className="relative inline-flex">
        <ActionButton
          icon={Bookmark}
          label={saved ? "Saved" : "Save"}
          count={savesCount}
          pressed={saved}
          onClick={handleSave}
          iconAnimation="fx-icon-save"
          iconHover="group-hover/action:-translate-y-0.5"
          pressedClassName="border-primary/50 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
          className={PILL}
        />
      </span>

      <span ref={follow.containerRef} className="relative inline-flex">
        <ActionButton
          icon={following ? Check : Eye}
          label={following ? "Following" : "Follow"}
          pressed={following}
          onClick={handleFollow}
          iconAnimation="fx-icon-follow"
          iconHover="group-hover/action:scale-110"
          pressedClassName="border-blue-400/50 bg-blue-400/10 text-blue-500 hover:bg-blue-400/15 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-400"
          fillOnPress={false}
          className={PILL}
        />
      </span>

      <DevMark kind="mock" note="like / dislike / save / follow are stored in localStorage, counts are not in the API" />
    </div>
  )
}
