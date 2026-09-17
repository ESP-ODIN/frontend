const stats = [
  {
    value: "+184",
    label: "Cette semaine",
  },
  {
    value: "14.2M",
    label: "Installations / Mois",
  },
  {
    value: "99,98%",
    label: "Paquets Signés",
  },
]

export function Hero() {
  return (
    <div className="flex flex-col gap-8 mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
        <div className="flex flex-col gap-5">
            <p className="text-sm font-mono tracking-wider text-primary font-bold">Boutique</p>
            <h1 className="text-4xl font-bold sm:text-5xl">Trouver votre prochain agent.</h1>
            <p className="max-w-md text-foreground/60">2 481 agents provenant de plus de 38 000 auteurs. Lisez REX, vérifiez les autorisations, installez en une seule commande.</p>
        </div>
        <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-8 lg:justify-start">
            {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-2 lg:items-start">
                    <p className="text-xl font-bold whitespace-nowrap">{stat.value}</p>
                    <p className="text-sm text-foreground/60 whitespace-nowrap">{stat.label}</p>
                </div>
            ))}
        </div>
    </div>
  )
}
