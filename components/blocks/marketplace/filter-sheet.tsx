"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FilterBar } from "@/components/blocks/filter-bar"
import type { MarketplaceFilters } from "@/lib/marketplace-filters"

type FilterSheetProps = {
  filters: MarketplaceFilters
  onChange: (next: MarketplaceFilters) => void
  activeCount: number
}

export function FilterSheet({ filters, onChange, activeCount }: FilterSheetProps) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger
        render={
          <Button
            variant="outline"
            icon={SlidersHorizontal}
            className="w-full justify-center rounded-lg bg-transparent lg:hidden"
          >
            Filtrer{activeCount > 0 && ` · ${activeCount}`}
          </Button>
        }
      />

      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-t-3xl border-t border-muted/40 bg-popover text-popover-foreground shadow-2xl outline-none data-open:animate-in data-open:slide-in-from-bottom data-open:fade-in-0 data-closed:animate-out data-closed:slide-out-to-bottom data-closed:fade-out-0 lg:hidden">
          <div className="flex shrink-0 items-center justify-between border-b border-muted/40 px-5 py-4">
            <DialogPrimitive.Title className="text-base font-bold text-foreground">
              Filtrer les agents
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              render={
                <button
                  type="button"
                  aria-label="Fermer"
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/10 hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              }
            />
          </div>
          <DialogPrimitive.Description className="sr-only">
            Filtrer les agents par catégorie, type, langage et date de mise à jour
          </DialogPrimitive.Description>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FilterBar className="w-full" filters={filters} onChange={onChange} />
          </div>

          <div className="shrink-0 border-t border-muted/40 p-4">
            <DialogPrimitive.Close render={<Button className="w-full rounded-lg" size="lg" />}>
              Voir les résultats
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
