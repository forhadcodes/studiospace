import { BrandLoader } from "@/components/loading/brand-loader"

/** Fallback for routes that don't ship their own loading UI. */
export default function RootLoading() {
  return (
    <main className="flex min-h-[60vh] flex-1 items-center justify-center bg-section px-6">
      <BrandLoader label="Loading StudioSpace…" hint="Setting the lights." />
    </main>
  )
}
