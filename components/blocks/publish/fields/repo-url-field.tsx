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

// Only fills keys the owner hasn't touched yet (still at their default value),
// so a scan never overwrites what was typed in step 1 or in the permissions.
function fillUntouched<T extends object>(
  current: T,
  defaults: T,
  scanned: Partial<T>
): Partial<T> {
  const patch: Partial<T> = {}
  for (const key of Object.keys(scanned) as (keyof T)[]) {
    const value = scanned[key]
    if (value === undefined) continue
    if (JSON.stringify(current[key]) === JSON.stringify(defaults[key])) {
      patch[key] = value
    }
  }
  return patch
}

export function RepoUrlField() {
  const { data, updateGeneral, updateManifest, updatePermissions } =
    usePublishWizard()
  const [scan, setScan] = useState<ScanState>({ status: "idle" })
  const { repoUrl, scannedRepoUrl, source } = data.manifest
  const isImport = source === "repository"
  const isUrlValid = isGithubRepoUrlValid(repoUrl)
  const isScanStale =
    isImport && scannedRepoUrl !== "" && scannedRepoUrl !== repoUrl

  async function handleScan() {
    if (!isUrlValid || scan.status === "scanning") return

    setScan({ status: "scanning" })
    try {
      const result = await scanManifestFromRepo(repoUrl)
      if (!result.found) {
        // No manifest.toml: nothing gets prefilled, the owner is sent to the manual form.
        // Values left over from a previous repo's scan are wiped so they can't leak in.
        const { version, entrypoint, args, changelog, readme } =
          DEFAULT_FORM_DATA.manifest
        updateManifest({
          source: "form",
          scannedRepoUrl: "",
          ...(scannedRepoUrl !== "" && {
            version,
            entrypoint,
            args,
            changelog,
            readme,
          }),
        })
        setScan({ status: "not-found" })
        return
      }
      const { scanned, readme, changelog } = result
      // Manifest-step fields mirror the file exactly: an explicit scan overwrites them.
      updateManifest({
        version: scanned.manifest.version ?? "",
        entrypoint: scanned.manifest.entrypoint ?? "",
        args: scanned.manifest.args ?? [],
        homepageUrl: scanned.manifest.homepageUrl ?? "",
        readme,
        changelog,
        scannedRepoUrl: repoUrl,
      })
      updateGeneral(
        fillUntouched(data.general, DEFAULT_FORM_DATA.general, scanned.general)
      )
      updatePermissions(
        fillUntouched(
          data.permissions,
          DEFAULT_FORM_DATA.permissions,
          scanned.permissions
        )
      )

      const warnings = [...result.warnings]
      const typedName = data.general.packageName
      const manifestName = scanned.general.packageName
      if (typedName && manifestName && typedName !== manifestName) {
        warnings.unshift(
          `Le manifest déclare « ${manifestName} » mais le package s'appelle « ${typedName} » à l'étape 1.`
        )
      }
      setScan({ status: "done", warnings })
    } catch (error) {
      setScan({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Impossible de lire ce dépôt pour l'instant. Réessayez.",
      })
    }
  }

  const formatError =
    repoUrl.length > 0 && !isUrlValid
      ? "Format attendu : https://github.com/org/repo"
      : undefined
  const scanError = scan.status === "error" ? scan.message : undefined

  return (
    <div className="flex flex-col gap-3">
      <FieldShell
        id="repo-url"
        label="Lien du repo GitHub"
        required
        error={formatError ?? scanError}
        hint={
          isImport
            ? "Le manifest.toml à la racine du dépôt préremplira le formulaire. S'il n'existe pas, vous passerez en création manuelle."
            : "Le dépôt qui contient le code de votre agent."
        }
      >
        <div className="flex gap-2">
          <Input
            id="repo-url"
            value={repoUrl}
            onChange={(event) => {
              updateManifest({ repoUrl: event.target.value })
              if (scan.status !== "scanning") setScan({ status: "idle" })
            }}
            onKeyDown={(event) => {
              if (isImport && event.key === "Enter") {
                event.preventDefault()
                handleScan()
              }
            }}
            placeholder="https://github.com/mon-org/mon-agent"
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
                  Scan…
                </>
              ) : scannedRepoUrl === repoUrl && repoUrl !== "" ? (
                "Rescanner"
              ) : (
                "Scanner"
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
              Aucun <span className="font-mono">manifest.toml</span> trouvé dans
              ce dépôt.
            </p>
            <p className="text-xs text-muted-foreground">
              On est passé en création manuelle : remplissez le formulaire
              ci-dessous, les informations seront enregistrées côté Odin.
            </p>
          </div>
        </div>
      )}

      {isImport && scan.status === "done" && (
        <div className="flex animate-in flex-col gap-2 rounded-2xl border border-muted/40 bg-muted/5 p-4 duration-300 fade-in-0">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CircleCheck className="size-4 shrink-0 text-primary" />
            <span>
              <span className="font-mono">manifest.toml</span> importé. Les
              champs vides des étapes 1 et Permissions ont aussi été complétés.
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
          Le lien a changé depuis le dernier scan : relancez-le pour continuer.
        </p>
      )}
    </div>
  )
}
