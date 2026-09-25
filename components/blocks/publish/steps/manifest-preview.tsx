"use client"

import { useState } from "react"
import { Check, Copy, Download, FileCode2 } from "lucide-react"

import { Button } from "@/components/ui/button"

const TABLE_LINE = /^\[[^\]]+\]$/
const KEY_VALUE_LINE = /^(\S+)(\s*=\s*)(.*)$/

function renderLine(line: string, index: number) {
  if (line === "") return <div key={index}>&nbsp;</div>
  if (TABLE_LINE.test(line)) {
    return (
      <div key={index} className="font-bold text-primary">
        {line}
      </div>
    )
  }
  const match = KEY_VALUE_LINE.exec(line)
  if (match) {
    const [, key, equals, value] = match
    return (
      <div key={index}>
        <span className="text-amber-400">{key}</span>
        <span className="text-[#F6F1E6]/60">{equals}</span>
        <span className="text-emerald-400">{value}</span>
      </div>
    )
  }
  return (
    <div key={index} className="text-[#F6F1E6]">
      {line}
    </div>
  )
}

export function ManifestPreview({ toml }: { toml: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(toml)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleDownload() {
    const url = URL.createObjectURL(new Blob([toml], { type: "text/plain" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "manifest.toml"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-muted/40">
      <div className="flex items-center justify-between gap-2 border-b border-muted/40 bg-background-100 px-4 py-2">
        <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <FileCode2 className="size-3.5" />
          manifest.toml
        </span>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            icon={copied ? Check : Copy}
            onClick={handleCopy}
            aria-label="Copier le manifest"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            icon={Download}
            onClick={handleDownload}
            aria-label="Télécharger le manifest"
          />
        </div>
      </div>
      <pre className="overflow-x-auto bg-[#14110C] p-5 font-mono text-sm leading-relaxed">
        <code>{toml.trimEnd().split("\n").map(renderLine)}</code>
      </pre>
    </div>
  )
}
