import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  count: number
}

export function SearchBar({ count }: SearchBarProps) {
  return (
    <div className="relative flex items-center rounded-lg border border-input bg-background/30 px-3 py-1 text-base transition-colors outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
      <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={`Search ${count} agents...`}
        className="rounded-full border-none bg-transparent pl-10 pr-16 shadow-none focus-visible:ring-0"
      />
      <span className="absolute right-1.5 rounded-full bg-white border border-muted/50 px-2 py-1 text-xs text-muted-foreground">
        ⌘K
      </span>
    </div>
  )
}
