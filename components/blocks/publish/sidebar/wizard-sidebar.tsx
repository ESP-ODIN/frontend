import { MarketplacePreviewCard } from "@/components/blocks/publish/sidebar/marketplace-preview-card"
import { ChecklistPanel } from "@/components/blocks/publish/sidebar/checklist-panel"

export function WizardSidebar() {
  return (
    <aside className="flex w-full flex-col gap-6 lg:sticky lg:top-28 lg:w-80 lg:shrink-0">
      <MarketplacePreviewCard />
      <ChecklistPanel />
    </aside>
  )
}
