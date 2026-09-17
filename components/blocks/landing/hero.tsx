"use client"
import Link from "next/link";
import { Snippet } from "@/components/blocks/snippet-1";
import { Button } from "@/components/ui/button";
import { CoreValues } from "@/components/blocks/landing/core-values";
import { ArrowRight } from "lucide-react";

type HeroProps = {
  className?: string
}

export function Hero({ className }: HeroProps) {
  return (
    <div className="flex flex-col items-center px-4 text-center sm:px-0">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Gestionnaire de paquets pour <span className="text-primary">Agents IA</span>.
        </h1>
        <div className="flex flex-col items-center gap-6">
            <p className="mt-6 max-w-lg text-md text-muted-foreground">
                Découvrir, installer et partager des agents intelligents à partir d’une ligne de commande
            </p>
            <CoreValues />
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Snippet text="curl -sSL get.odin.dev | sh" dark />
                <Button className="py-6 px-4" icon={ArrowRight} iconPosition="right" render={<Link href="/marketplace" />}>Parcourir la boutique</Button>
            </div>
        </div>
    </div>
  )
}
