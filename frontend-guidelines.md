# Odin — Bonnes pratiques Frontend

Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui

---

## 1. Structure des composants

Ne mélange jamais les composants shadcn bruts avec tes compositions métier. Trois niveaux :

```
components/
├─ ui/           # Composants shadcn générés par la CLI — NE JAMAIS ÉDITER À LA MAIN
├─ blocks/       # Compositions produit réutilisables (ex: PricingCard, AgentCard)
└─ layout/       # Header, Footer, Sidebar, Nav — structure de page
```

**Règle d'or** : `components/ui/` reste intouché autant que possible. Si tu dois personnaliser un composant shadcn (ex: le `Button` avec une variante spécifique à Odin), tu as deux options :

1. **Ajouter une variante** dans le fichier généré (`buttonVariants` avec `cva`) — acceptable car c'est prévu par le design du composant lui-même.
2. **Wrapper plutôt qu'éditer la logique interne** :

```tsx
// components/blocks/install-button.tsx
import { Button } from "@/components/ui/button"

export function InstallButton(props: React.ComponentProps<typeof Button>) {
  return <Button className="font-mono rounded-full" {...props} />
}
```

Pourquoi : la CLI shadcn peut re-générer/mettre à jour un composant (`npx shadcn add button --overwrite`). Si tu as bidouillé sa logique interne, tu perds tout au prochain update. Une variante ou un wrapper survit.

**Nommage des fichiers** : kebab-case (`agent-card.tsx`), export nommé en PascalCase (`export function AgentCard`).

---

## 2. Server Components vs Client Components

Par défaut, **tout est Server Component** dans l'App Router. Un composant doit passer en Client (`"use client"`) seulement s'il a besoin de :
- state (`useState`, `useReducer`)
- effets (`useEffect`)
- interactivité navigateur (`onClick`, `onChange`...)
- hooks de contexte (`useContext`, y compris les providers shadcn comme `ThemeProvider`)

**Erreur fréquente** : mettre `"use client"` en haut d'une page entière parce qu'un seul bouton a besoin d'interactivité. Isole plutôt le bouton dans son propre petit composant client, et garde la page en Server Component pour profiter du rendu serveur (SEO, perf, pas de JS inutile envoyé au navigateur).

```
app/marketplace/page.tsx        ← Server Component (fetch les agents, SEO)
components/blocks/agent-filter.tsx  ← "use client" (interactif, isolé)
```

---

## 3. Routing & conventions App Router

Fichiers spéciaux à connaître dans chaque dossier de route :

| Fichier | Rôle |
|---|---|
| `page.tsx` | Le contenu de la route |
| `layout.tsx` | Wrapper persistant (ne re-render pas à la navigation) |
| `loading.tsx` | Affiché automatiquement pendant le chargement (Suspense) |
| `error.tsx` | Boundary d'erreur (doit être `"use client"`) |
| `not-found.tsx` | Page 404 personnalisée |

**Route groups** : utilise `(nom)` pour organiser sans affecter l'URL — utile pour toi vu qu'Odin a plusieurs sections (marketplace, profil, publication) :

```
app/
├─ (marketing)/          # pages publiques : landing, docs
│  └─ page.tsx
├─ (app)/                # zone authentifiée
│  ├─ layout.tsx         # layout avec sidebar, vérifie l'auth
│  ├─ dashboard/page.tsx
│  └─ agents/[slug]/page.tsx   # route dynamique pour la fiche d'un agent
```

**Metadata** : chaque `page.tsx` doit exporter ses métadonnées (SEO) plutôt que de les mettre uniquement dans le layout global :

```tsx
export const metadata = {
  title: "Marketplace — Odin",
  description: "Découvrez et installez des agents IA.",
}
```

---

## 4. Liens & navigation

**Toujours `next/link` pour la navigation interne**, jamais `<a href>` seul :

```tsx
import Link from "next/link"

<Link href="/agents/code-reviewer">Voir l'agent</Link>
```
Pourquoi : `next/link` fait du prefetching automatique (la page est chargée en arrière-plan quand le lien est visible à l'écran) et évite un rechargement complet.

**Navigation programmatique** (ex: après soumission d'un formulaire) → `useRouter` de `next/navigation` (pas `next/router`, qui est l'ancien Pages Router) :

```tsx
"use client"
import { useRouter } from "next/navigation"

const router = useRouter()
router.push("/dashboard")       // ajoute à l'historique
router.replace("/dashboard")    // remplace, pas de retour arrière possible
```

**Redirection côté serveur** (ex: protéger une route, rediriger après une Server Action) → `redirect()` de `next/navigation`, appelée directement dans un Server Component ou une Server Action :

```tsx
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")
  // ...
}
```

**Lien actif dans la nav** (ex: surligner l'item de menu courant) → `usePathname` :

```tsx
"use client"
import { usePathname } from "next/navigation"

const pathname = usePathname()
const isActive = pathname === "/marketplace"
```

---

## 5. Formulaires

Pattern standard avec shadcn : `react-hook-form` + `zod` + le composant `Form` de shadcn (validation typée, accessible par défaut car basé sur Radix Label/aria).

```bash
npx shadcn@latest add form
npm install zod
```

```tsx
const schema = z.object({
  name: z.string().min(2, "Trop court"),
})

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
})
```

Ne réinvente pas la validation à la main avec du `useState` par champ — c'est le piège n°1 qui rend les formulaires illisibles et peu accessibles.

---

## 6. Data fetching

- **Server Component** : `fetch()` directement dans le composant `async`, avec option de cache/revalidation :
```tsx
const res = await fetch("https://api.odin.dev/agents", { next: { revalidate: 60 } })
```
- **Mutation (formulaire, action utilisateur)** : privilégie une **Server Action** plutôt qu'une route API + `fetch` côté client, quand c'est possible :
```tsx
"use server"
export async function publishAgent(formData: FormData) { /* ... */ }
```
- Pas de `useEffect` + `fetch` pour charger des données au montage d'une page si un Server Component peut le faire — c'est plus lent et moins bon pour le SEO.

---

## 7. Performance

- **Images** : toujours `next/image`, jamais `<img>` — optimisation automatique (format, taille, lazy loading).
- **Lazy load des composants lourds** : `Dialog`, `Sheet`, `Calendar` (Radix) alourdissent le bundle initial. Si le composant n'est pas visible au premier rendu :
```tsx
const AgentDialog = dynamic(() => import("@/components/blocks/agent-dialog"))
```
- Les polices sont déjà bien gérées via `next/font` (Inter/Fira Code) — rien à faire de plus ici.

---

## 8. Accessibilité

shadcn (via Radix) te donne une bonne base (focus trap, ARIA, navigation clavier) **gratuitement** — mais ça ne veut pas dire que tout est automatiquement accessible :
- Toujours un `alt` pertinent sur `next/image`
- Toujours un `<Label htmlFor>` lié à chaque input (le composant `Form` de shadcn le fait automatiquement si tu suis le pattern)
- Vérifie le contraste : ton gris neutre `#A3A3A3` sur fond crème `#FAF9F6` est limite en contraste pour du texte (ratio ~2.3:1, sous le seuil AA de 4.5:1) — à réserver aux bordures/éléments décoratifs, pas au texte de contenu.

---

## 9. Variables d'environnement

- Préfixe `NEXT_PUBLIC_` uniquement pour ce qui doit être exposé au navigateur (clé API publique, URL). Tout le reste (secrets, clés privées) sans préfixe → jamais accessible côté client.
- `.env.local` dans `.gitignore` (à vérifier — ne doit jamais être commit).

---

## 10. TypeScript

- Type explicite sur les props de chaque composant exporté, pas de `any`.
- Utilise `React.ComponentProps<typeof X>` pour étendre un composant shadcn (voir exemple `InstallButton` plus haut) plutôt que de redéfinir toutes les props à la main.
