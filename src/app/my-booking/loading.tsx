import { RowListSkeleton } from "@/components/loading/skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function MyBookingsLoading() {
  return (
    <main className="min-h-screen bg-section">
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-3 h-4 w-80" />

        <div className="mt-8 border-t border-border pt-8">
          <RowListSkeleton count={3} />
        </div>
      </section>
    </main>
  )
}
