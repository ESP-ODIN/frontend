"use client"
import { Star, MoveDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AuroraBackground } from "@/components/motion/aurora-background";
import { CopyCommand } from "@/components/motion/copy-command";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

const spotlightagent = {
  manifest: "code-reviewer",
  version: "2.4.1",
  author: "anthropic",
  likes: "4,218",
  downloades: "128k",
  ladtupdated: "2h",
  type: "workflow",
  runtime: "typescript@5.4",
  sandbox: "net:read fs:read"
};

export function SpotlightCard() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#14110C] p-4 text-[#F6F1E6] sm:p-6 lg:p-8">
        <AuroraBackground className="opacity-80" />
        <ScrollReveal className="relative flex flex-col gap-5 sm:gap-8 lg:flex-row lg:gap-0">
        <div className="flex-2 flex flex-col gap-3 sm:gap-4">
            <div>
                <p className="font-mono text-xs text-primary uppercase sm:text-sm">Spotlight · Odin&apos;s pick</p>
                <h2 className="text-xl font-mono font-bold mt-2 sm:text-2xl lg:text-3xl">{spotlightagent.manifest}</h2>
                <h2 className="text-xl font-mono font-semibold mt-1 sm:text-2xl lg:text-3xl">v{spotlightagent.version} just launched.</h2>
                <p className="text-sm text-[#F6F1E6]/60 line-clamp-2 sm:line-clamp-none">Inline diffs, tone-aware comments and a new “explain the regression” mode.
                The most installed code review agent on Herald.
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                <Magnetic>
                    <Button className="fx-shine" render={<Link href={`/agents/${spotlightagent.manifest}`} />}>Install</Button>
                </Magnetic>
                <Button className="border-white/15 bg-white/5 text-[#F6F1E6] hover:bg-white/10 hover:text-[#F6F1E6]" variant="outline" render={<Link href={`/agents/${spotlightagent.manifest}`} />}>View details</Button>
            </div>
            <p className="flex flex-wrap items-center gap-1 text-xs text-[#F6F1E6]/60 sm:text-sm">
                <Star className="size-4" /> {spotlightagent.likes} • <MoveDown className="size-4" /> {spotlightagent.downloades} installs by @{spotlightagent.author} • Updated {spotlightagent.ladtupdated} ago
            </p>

            <CopyCommand className="w-fit max-w-full overflow-x-auto text-xs lg:hidden" command={`odin install ${spotlightagent.manifest}`} />
        </div>
        <Separator orientation="vertical" className="mx-8 hidden bg-white/10 lg:block" />
        <div className="hidden flex-1 flex-col justify-center gap-6 lg:flex">
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 font-mono text-sm [&>dd]:m-0">
                <dt className="text-[#F6F1E6]/40">Manifest</dt>
                <dd>{spotlightagent.manifest}</dd>

                <dt className="text-[#F6F1E6]/40">Version</dt>
                <dd>{spotlightagent.version}</dd>

                <dt className="text-[#F6F1E6]/40">Type</dt>
                <dd>{spotlightagent.type}</dd>

                <dt className="text-[#F6F1E6]/40">Runtime</dt>
                <dd>{spotlightagent.runtime}</dd>

                <dt className="text-[#F6F1E6]/40">Sandbox</dt>
                <dd className="text-emerald-400">{spotlightagent.sandbox}</dd>
            </dl>

            <div>
                <CopyCommand className="text-xs" command={`odin install ${spotlightagent.manifest}`} />
            </div>
        </div>
        </ScrollReveal>
    </div>
  )
}
