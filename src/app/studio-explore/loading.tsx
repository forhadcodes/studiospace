import { StudioGridSkeleton } from "@/components/loading/skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function StudioExploreLoading() {
  return (
    <main className="min-h-screen bg-section">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-11 w-80" />
        <Skeleton className="mt-3 h-4 w-full max-w-md" />

        {/* Search + filter bar */}
        <Skeleton className="mt-8 h-[68px] w-full rounded-2xl" />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24 rounded-full" />
          ))}
        </div>

        <Skeleton className="mt-8 h-4 w-40" />

        <div className="mt-6">
          <StudioGridSkeleton count={6} />
        </div>
      </section>
    </main>
  )
}
