import { cn } from "@/lib/utils"

type CodeBlockProps = {
  lines: string[]
  className?: string
}

function renderLine(line: string, i: number) {
  if (line.trim().startsWith("#")) {
    return (
      <div key={i} className="text-[#F6F1E6]/40">
        {line}
      </div>
    )
  }

  if (line.trim().startsWith("$")) {
    return (
      <div key={i}>
        <span className="text-primary">$</span>
        <span className="text-[#F6F1E6]">{line.slice(1)}</span>
      </div>
    )
  }

  if (line.trim() === "") {
    return <div key={i}>&nbsp;</div>
  }

  const jsonMatch = line.match(/^(\s*)("[^"]+")(\s*:\s*)(.*)$/)
  if (jsonMatch) {
    const [, indent, key, colon, rest] = jsonMatch
    return (
      <div key={i}>
        {indent}
        <span className="text-amber-400">{key}</span>
        {colon}
        <span className="text-emerald-400">{rest}</span>
      </div>
    )
  }

  return (
    <div key={i} className="text-[#F6F1E6]">
      {line}
    </div>
  )
}

export function CodeBlock({ lines, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-xl bg-[#14110C] p-5 font-mono text-sm leading-relaxed",
        className
      )}
    >
      <code>{lines.map(renderLine)}</code>
    </pre>
  )
}
