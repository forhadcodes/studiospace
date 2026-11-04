import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton building blocks shared by route-level `loading.tsx` files and
 * client-side fetch states. They mirror the real layouts (studio cards, list
 * rows, studio details, forms) so the page does not jump when data arrives.
 */

/** One studio card, matching `StudioCard` in studio-explore / featured-studios. */
export function StudioCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-card p-4 shadow-sm">
      <Skeleton className="h-52 w-full rounded-xl" />
      <div className="px-1 pt-5">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <div className="mt-3 flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <div className="mt-4 flex items-center justify-between border-y border-border py-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Skeleton className="h-8 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Responsive grid of studio card skeletons. */
export function StudioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <StudioCardSkeleton key={index} />
      ))}
    </div>
  )
}

/** One horizontal row card (My Bookings / My Listings). */
export function RowCardSkeleton() {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row">
      <Skeleton className="h-40 w-full rounded-xl sm:w-56 sm:shrink-0" />
      <div className="flex flex-1 flex-col">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="mt-3 h-6 w-2/3" />
        <Skeleton className="mt-3 h-4 w-56" />
        <Skeleton className="mt-2 h-4 w-64" />
        <Skeleton className="mt-4 h-7 w-20" />
        <div className="mt-4 flex gap-2 sm:ml-auto sm:mt-auto">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  )
}

/** Stack of row card skeletons. */
export function RowListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, index) => (
        <RowCardSkeleton key={index} />
      ))}
    </div>
  )
}

/** Studio details page: hero image, overview column and booking card. */
export function StudioDetailSkeleton() {
  return (
    <main className="min-h-screen bg-section">
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>

        <Skeleton className="mt-5 h-[280px] w-full rounded-2xl sm:h-[420px]" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <Skeleton className="h-4 w-52" />
            <Skeleton className="mt-4 h-12 w-4/5" />
            <div className="mt-5 flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="mt-8 border-t border-border pt-8">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-11/12" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </div>
            <div className="mt-8 border-t border-border pt-8">
              <Skeleton className="h-7 w-28" />
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-5 w-40" />
                ))}
              </div>
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-border bg-card p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-10 w-32" />
            <Skeleton className="mt-6 h-10 w-full rounded-md" />
            <Skeleton className="mt-4 h-11 w-full rounded-md" />
            <Skeleton className="mt-6 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-2 h-4 w-4/6" />
          </div>
        </div>
      </section>
    </main>
  )
}

/** Add Studio form placeholder. */
export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <main className="flex-1 bg-section">
      <section className="mx-auto w-full max-w-5xl px-6 py-14 md:py-20">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
          <div className="space-y-5">
            {Array.from({ length: fields }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-2 h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </section>
    </main>
  )
}

/** Profile card placeholder. */
export function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-section">
      <section className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <Skeleton className="h-5 w-32" />
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-5">
            <Skeleton className="size-20 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="mt-2 h-4 w-56" />
            </div>
          </div>
          <div className="mt-8 space-y-4 border-t border-border pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="mt-8 flex gap-3">
            <Skeleton className="h-9 w-32 rounded-md" />
            <Skeleton className="h-9 w-36 rounded-md" />
          </div>
        </div>
      </section>
    </main>
  )
}
