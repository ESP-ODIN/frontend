"use client"

import { useState } from "react"
import {
  AlertTriangle,
  CircleCheck,
  FilePen,
  Loader2,
  ScanSearch,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldShell } from "@/components/publish/fields/field-shell"
import { usePublishWizard } from "@/components/publish/wizard-context"
import { DevMark } from "@/components/dev/dev-mark"
import { scanManifestFromRepo } from "@/lib/api/publish"
import { DEFAULT_FORM_DATA } from "@/lib/publish/constants"
import { isGithubRepoUrlValid } from "@/lib/publish/validation"

type ScanState =
  | { status: "idle" }
  | { status: "scanning" }
  | { status: "error"; message: string }

function withDefaults<T extends object>(defaults: T, scanned: Partial<T>): T {
  const result = { ...defaults }
  for (const key of Object.keys(scanned) as (keyof T)[]) {
    const value = scanned[key]
    if (value !== undefined) result[key] = value as T[keyof T]
  }
  return result
}

/**
 * Import du repo : le scan cherche un manifest.toml à la racine. S'il existe, il préremplit les
 * étapes suivantes ("repository") ; sinon, le manifest sera créé avec le formulaire ("form").
 */
export function RepoUrlField() {
  const { data, updateSection } = usePublishWizard()
  const [scan, setScan] = useState<ScanState>({ status: "idle" })
  // Avertissements du dernier scan : purement informatifs, pas besoin de les garder dans l'URL.
  const [warnings, setWarnings] = useState<string[]>([])
  const { repoUrl, scannedRepoUrl, kind } = data.source
  const isUrlValid = isGithubRepoUrlValid(repoUrl)
  const isScanned = scannedRepoUrl !== "" && scannedRepoUrl === repoUrl
  const isScanStale = scannedRepoUrl !== "" && scannedRepoUrl !== repoUrl

  async function handleScan() {
    if (!isUrlValid || scan.status === "scanning") return

    setScan({ status: "scanning" })
    try {
      const result = await scanManifestFromRepo(repoUrl)
      if (!result.found) {
        // Le formulaire repart de zéro s'il avait été prérempli par un manifest précédent.
        if (kind === "repository") {
          updateSection("package", DEFAULT_FORM_DATA.package)
          updateSection("run", DEFAULT_FORM_DATA.run)
          updateSection("permissions", DEFAULT_FORM_DATA.permissions)
        }
        updateSection("source", {
          kind: "form",
          scannedRepoUrl: repoUrl,
          readmeFile: DEFAULT_FORM_DATA.source.readmeFile,
        })
        setWarnings([])
        setScan({ status: "idle" })
        return
      }

      const { scanned } = result
      updateSection("source", {
        kind: "repository",
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
      setWarnings(result.warnings)
      setScan({ status: "idle" })
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
        trailing={<DevMark kind="mock" note="manifest scan is faked, no API endpoint" />}
        error={formatError ?? scanError}
        hint="We look for a manifest.toml at the root of the repository. If there is one, it prefills the next steps; otherwise you'll create it with the form. The README will be shown on the agent page."
      >
        <div className="flex gap-2">
          <Input
            id="repo-url"
            value={repoUrl}
            onChange={(event) => {
              updateSection("source", { repoUrl: event.target.value })
              if (scan.status === "error") setScan({ status: "idle" })
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                handleScan()
              }
            }}
            placeholder="https://github.com/my-org/my-agent"
            className="font-mono"
            aria-invalid={Boolean(formatError ?? scanError)}
          />
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
                Importing…
              </>
            ) : isScanned ? (
              "Re-import"
            ) : (
              "Import"
            )}
          </Button>
        </div>
      </FieldShell>

      {isScanned && kind === "form" && (
        <div className="flex animate-in items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 duration-300 fade-in-0">
          <FilePen className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              Repository imported, but no{" "}
              <span className="font-mono">manifest.toml</span> was found.
            </p>
            <p className="text-xs text-muted-foreground">
              No problem: fill in the next steps and we&apos;ll create the
              manifest for you. It will be stored on Odin&apos;s side.
            </p>
          </div>
        </div>
      )}

      {isScanned && kind === "repository" && (
        <div className="flex animate-in flex-col gap-2 rounded-2xl border border-muted/40 bg-muted/5 p-4 duration-300 fade-in-0">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CircleCheck className="size-4 shrink-0 text-primary" />
            <span>
              Repository imported with its{" "}
              <span className="font-mono">manifest.toml</span>: the Package,
              Run and Permissions steps are prefilled.
            </span>
          </p>
          {warnings.length > 0 && (
            <ul className="flex flex-col gap-1 pl-6">
              {warnings.map((warning) => (
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
          The link changed since the last import: import it again to continue.
        </p>
      )}
    </div>
  )
}
