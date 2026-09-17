"use client"
import { Star, MoveDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Snippet } from "@/components/blocks/snippet-1";

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
    <div className="w-full bg-[#14110C] text-[#F6F1E6] p-4 rounded-2xl flex flex-col gap-5 sm:p-6 sm:gap-8 lg:flex-row lg:gap-0">
        <div className="flex-2 flex flex-col gap-3 sm:gap-4">
            <div>
                <p className="font-mono text-xs text-primary uppercase sm:text-sm">À la une · La sélection Odin</p>
                <h2 className="text-xl font-mono font-bold mt-2 sm:text-2xl lg:text-3xl">{spotlightagent.manifest}</h2>
                <h2 className="text-xl font-mono font-semibold mt-1 sm:text-2xl lg:text-3xl">v{spotlightagent.version} vient d'être lancé.</h2>
                <p className="text-sm text-[#F6F1E6]/60 line-clamp-2 sm:line-clamp-none">Comparaisons en ligne, commentaires tenant compte du ton utilisé et un nouveau mode « expliquer la régression ».
                L'agent de révision de code le plus installé sur Herald.
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button render={<Link href={`/agents/${spotlightagent.manifest}`} />}>Installer</Button>
                <Button className="bg-[#76705F]/20 border-[#76705F]/70" variant="outline" render={<Link href={`/agents/${spotlightagent.manifest}`} />}>Voir détails</Button>
            </div>
            <p className="flex flex-wrap items-center gap-1 text-xs text-[#F6F1E6]/60 sm:text-sm">
                <Star className="size-4" /> {spotlightagent.likes} • <MoveDown className="size-4" /> {spotlightagent.downloades} installations by @{spotlightagent.author} • Mis à jour il y a {spotlightagent.ladtupdated}
            </p>

            {/* Compact mobile/tablet CTA — the full manifest table below is desktop-only */}
            <Snippet className="max-w-full overflow-x-auto rounded-md bg-[#76705F]/20 lg:hidden" text={`odin install ${spotlightagent.manifest}`} width="fit-content" dark={true} type="success" />
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
                <Snippet className="max-w-full overflow-x-auto rounded-md bg-[#76705F]/20" text={`odin install ${spotlightagent.manifest}`} width="fit-content" dark={true} type="success" />
            </div>
        </div>
    </div>
  )
}
