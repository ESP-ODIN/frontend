"use client"
import { Star, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Snippet } from "@/components/blocks/snippet-1";

const spotlightagent = {
  manifest: "code-reviewer",
  version: "2.4.1",
  author: "antrhopic",
  likes: "4,218",
  downloades: "128k",
  ladtupdated: "2h",
  type: "workflow",
  runtime: "typescript@5.4",
  sandbox: "net:read fs:read"
};

export function SpotlightCard() {
  return (
    <div className="w-full bg-[#14110C] text-[#F6F1E6] p-6 rounded-2xl flex">
        <div className="flex-2 flex flex-col gap-4">
            <div>
                <p className="font-mono text-sm text-primary uppercase">À la une · La sélection Odin</p>
                <h2 className="text-3xl font-mono font-bold mt-2">{spotlightagent.manifest}</h2>
                <h2 className="text-3xl font-mono font-semibold mt-1">v{spotlightagent.version} vient d'être lancé.</h2>
                <p className="text-sm text-[#F6F1E6]/60">Comparaisons en ligne, commentaires tenant compte du ton utilisé et un nouveau mode « expliquer la régression ».
                L'agent de révision de code le plus installé sur Herald.
                </p>
            </div>
            <div className="flex gap-2">
                <Button>Installer</Button>
                <Button className="bg-[#76705F]/20 border-[#76705F]/70" variant="outline">Voir détails</Button>
            </div>
            <p className="flex items-center gap-1 text-sm text-[#F6F1E6]/60">
                <Star className="size-4" /> {spotlightagent.likes} • <MoveDown className="size-4" /> {spotlightagent.downloades} installations by @{spotlightagent.author} • Mis à jour il y a {spotlightagent.ladtupdated}
            </p>
        </div>
        <Separator orientation="vertical" className="mx-8 bg-white/10" />
        <div className="flex-1 flex flex-col justify-center gap-6">
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
                <Snippet className="rounded-md bg-[#76705F]/20" text={`odin install ${spotlightagent.manifest}`} width="fit-content" dark={true} type="success" />
            </div>
        </div>
    </div>
  )
}
