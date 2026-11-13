"use client"

import { useEffect, useState } from "react"
import { CircleCheck, CircleX, Clock, Hourglass } from "lucide-react"

import {
  listSubmissions,
  SUBMISSIONS_MOCK_NOTE,
  withdrawSubmission,
  type Submission,
  type SubmissionStatus,
} from "@/lib/publish/submissions"
import { getCategoryLabel } from "@/lib/data/categories"
import { formatTimeAgo } from "@/lib/format/time-ago"
import { getRuntimeLabel, SECURITY_REVIEW } from "@/lib/publish/constants"
import { cn } from "@/lib/utils"
import { AgentIcon } from "@/components/agent/agent-icon"
import { AgentTypeBadge } from "@/components/agent/agent-type-badge"
import { Button } from "@/components/ui/button"
import { DevMark } from "@/components/dev/dev-mark"

const STATUS: Record<SubmissionStatus, { label: string; icon: typeof Clock; className: string }> = {
  in_review: { label: "In review", icon: Hourglass, className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  published: { label: "Published", icon: CircleCheck, className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  rejected: { label: "Rejected", icon: CircleX, className: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400" },
}

function SubmissionCard({ submission, onWithdraw }: { submission: Submission; onWithdraw: () => void }) {
  const [confirming, setConfirming] = useState(false)
  const status = STATUS[submission.status]

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-muted/40 bg-background-100 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <AgentIcon name={submission.name} className="size-10 shrink-0 text-sm" />
          <div className="min-w-0">
            <p className="flex items-center gap-2">
              <span className="truncate font-mono text-sm font-bold text-foreground">{submission.name}</span>
              <span className="font-mono text-xs text-muted-foreground">v{submission.version}</span>
              <AgentTypeBadge type={submission.type} />
            </p>
            <p className="text-xs text-muted-foreground">
              {getCategoryLabel(submission.category)} · {getRuntimeLabel(submission.runtime)} · submitted{" "}
              {formatTimeAgo(submission.submittedAt)}
            </p>
          </div>
        </div>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", status.className)}>
          <status.icon aria-hidden className="size-3.5" />
          {status.label}
        </span>
      </div>

      {submission.status === "in_review" && (
        <>
          <ol className="grid gap-2 sm:grid-cols-2">
            {SECURITY_REVIEW.checks.map((check) => (
              <li key={check} className="flex items-center gap-2 rounded-lg border border-muted/30 px-3 py-2 text-sm">
                <Clock aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-foreground">{check}</span>
                <span className="text-xs text-muted-foreground">Queued</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Usually takes {SECURITY_REVIEW.estimatedDuration}. Your agent goes live on the marketplace once every check passes.
            </p>
            {confirming ? (
              <span className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Withdraw this submission?</span>
                <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
                  Keep it
                </Button>
                <Button variant="destructive" size="sm" onClick={onWithdraw}>
                  Withdraw
                </Button>
              </span>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
                Withdraw
              </Button>
            )}
          </div>
        </>
      )}
    </li>
  )
}

/** Publications envoyées depuis /publish et pas encore en ligne. Rien ne s'affiche s'il n'y en a pas. */
export function SubmissionsPanel() {
  const [submissions, setSubmissions] = useState<Submission[]>([])

  useEffect(() => {
    setSubmissions(listSubmissions())
  }, [])

  if (submissions.length === 0) return null

  return (
    <section aria-labelledby="submissions-title" className="flex flex-col gap-3">
      <h2 id="submissions-title" className="flex items-center gap-2 font-semibold text-foreground">
        Submissions <DevMark kind="mock" note={SUBMISSIONS_MOCK_NOTE} />
      </h2>
      <ul className="flex flex-col gap-3">
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            onWithdraw={() => {
              withdrawSubmission(submission.id)
              setSubmissions(listSubmissions())
            }}
          />
        ))}
      </ul>
    </section>
  )
}
