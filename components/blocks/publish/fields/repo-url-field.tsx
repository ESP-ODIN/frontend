"use client"

import { useState } from "react"
import {
  AlertTriangle,
  CircleCheck,
  FileX2,
  Loader2,
  ScanSearch,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { scanManifestFromRepo } from "@/lib/api/publish"
import { DEFAULT_FORM_DATA } from "@/lib/publish/constants"
import { isGithubRepoUrlValid } from "@/lib/publish/validation"

type ScanState =
  | { status: "idle" }
  | { status: "scanning" }
  | { status: "done"; warnings: string[] }
  | { status: "not-found" }
  | { status: "error"; message: string }

function withDefaults<T extends object>(defaults: T, scanned: Partial<T>): T {
  const result = { ...defaults }
  for (const key of Object.keys(scanned) as (keyof T)[]) {
    const value = scanned[key]
    if (value !== undefined) result[key] = value as T[keyof T]
  }
  return result
}

export function RepoUrlField() {
  const { data, updateSection } = usePublishWizard()
  const [scan, setScan] = useState<ScanState>({ status: "idle" })
  const { repoUrl, scannedRepoUrl, kind } = data.source
  const isImport = kind === "repository"
  const isUrlValid = isGithubRepoUrlValid(repoUrl)
  const isScanStale =
    isImport && scannedRepoUrl !== "" && scannedRepoUrl !== repoUrl

  async function handleScan() {
    if (!isUrlValid || scan.status === "scanning") return

    setScan({ status: "scanning" })
    try {
      const result = await scanManifestFromRepo(repoUrl)
      if (!result.found) {
        updateSection("source", {
          kind: "form",
          scannedRepoUrl: "",
          readmeFile: DEFAULT_FORM_DATA.source.readmeFile,
        })
        if (scannedRepoUrl !== "") {
          updateSection("package", DEFAULT_FORM_DATA.package)
          updateSection("run", DEFAULT_FORM_DATA.run)
          updateSection("permissions", DEFAULT_FORM_DATA.permissions)
        }
        setScan({ status: "not-found" })
        return
      }
      const { scanned } = result
      updateSection("source", {
        scannedRepoUrl: repoUrl,
        readmeFile: scanned.readmeFile,
      })
      updateSection(
        "package",
        withDefaults(DEFAULT_FORM_DATA.package, scanned.package)
      )
      updateSection("run", withDefaults(DEFAULT_FORM_DATA.run, scanned.run))
      updateSection("permissions", {
        ...withDefaults(DEFAULT_FORM_DATA.permissions, scanned.permissions),
        terminal: withDefaults(
          DEFAULT_FORM_DATA.permissions.terminal,
          scanned.terminal
        ),
      })
      setScan({ status: "done", warnings: result.warnings })
    } catch (error) {
      setScan({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to read this repository right now. Please try again.",
      })
    }
  }

  const formatError =
    repoUrl.length > 0 && !isUrlValid
      ? "Expected format: https://github.com/org/repo"
      : undefined
  const scanError = scan.status === "error" ? scan.message : undefined

  return (
    <div className="flex flex-col gap-3">
      <FieldShell
        id="repo-url"
        label="GitHub repo link"
        required
        error={formatError ?? scanError}
        hint={
          isImport
            ? "The manifest.toml at the root of the repository will prefill the form. If it doesn't exist, you'll switch to manual creation."
            : "The repository containing your agent's code. Its README will be shown on the agent page."
        }
      >
        <div className="flex gap-2">
          <Input
            id="repo-url"
            value={repoUrl}
            onChange={(event) => {
              updateSection("source", { repoUrl: event.target.value })
              if (scan.status !== "scanning") setScan({ status: "idle" })
            }}
            onKeyDown={(event) => {
              if (isImport && event.key === "Enter") {
                event.preventDefault()
                handleScan()
              }
            }}
            placeholder="https://github.com/my-org/my-agent"
            className="font-mono"
            aria-invalid={Boolean(formatError ?? scanError)}
          />
          {isImport && (
            <Button
              type="button"
              icon={scan.status === "scanning" ? undefined : ScanSearch}
              disabled={!isUrlValid || scan.status === "scanning"}
              onClick={handleScan}
              className="shrink-0 rounded-lg"
            >
              {scan.status === "scanning" ? (
                <>
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                  Scanning…
                </>
              ) : scannedRepoUrl === repoUrl && repoUrl !== "" ? (
                "Rescan"
              ) : (
                "Scan"
              )}
            </Button>
          )}
        </div>
      </FieldShell>

      {!isImport && scan.status === "not-found" && (
        <div className="flex animate-in items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 duration-300 fade-in-0">
          <FileX2 className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              No <span className="font-mono">manifest.toml</span> found in this
              repository.
            </p>
            <p className="text-xs text-muted-foreground">
              We switched to manual creation: fill in the next steps, the
              manifest will be stored on Odin&apos;s side.
            </p>
          </div>
        </div>
      )}

      {isImport && scan.status === "done" && (
        <div className="flex animate-in flex-col gap-2 rounded-2xl border border-muted/40 bg-muted/5 p-4 duration-300 fade-in-0">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CircleCheck className="size-4 shrink-0 text-primary" />
            <span>
              <span className="font-mono">manifest.toml</span> imported: the
              Package, Run and Permissions steps are prefilled.
            </span>
          </p>
          {scan.warnings.length > 0 && (
            <ul className="flex flex-col gap-1 pl-6">
              {scan.warnings.map((warning) => (
                <li
                  key={warning}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <AlertTriangle className="mt-0.5 size-3 shrink-0 text-primary" />
                  {warning}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isScanStale && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="size-3.5 shrink-0 text-primary" />
          The link changed since the last scan: run it again to continue.
        </p>
      )}
    </div>
  )
}
