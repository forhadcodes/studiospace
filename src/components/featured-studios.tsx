import Image from "next/image"
import Link from "next/link"
import { MapPinIcon, StarIcon } from "lucide-react"
import { connection } from "next/server"

import { buttonVariants } from "@/components/ui/button"
import { categoryLabel } from "@/lib/constants"
import { getFeaturedStudios, type Studio } from "@/lib/studios"

function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={studio.image}
          alt={studio.title}
          fill
          sizes="(min-width: 1024px) 384px, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-neutral-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {categoryLabel(studio.category)}
        </span>
        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
          <StarIcon className="size-3.5 fill-current" />
          {studio.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold text-neutral-900">{studio.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-neutral-500">
          <MapPinIcon className="size-4" />
          {studio.location.city}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="text-lg font-bold text-neutral-900">
            ${studio.hourlyRate}
            <span className="text-sm font-medium text-neutral-500"> / hr</span>
          </p>
          <Link
            href={`/studios/${studio.slug}`}
            className={buttonVariants({
              className:
                "bg-red-600 text-white hover:bg-red-600/90 group-hover:bg-red-600/90",
            })}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}

/** Dynamically rendered: fetches the 6 top-rated / newest studios from MongoDB. */
async function FeaturedStudios() {
  await connection() // opt out of prerendering — fetched fresh per request
  const studios = await getFeaturedStudios()

  return (
    <section className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.15em] text-red-600 uppercase">
              Fresh & Top Rated
            </p>
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Featured Studios
            </h2>
          </div>
          <Link
            href="/studios"
            className={buttonVariants({
              variant: "outline",
              className: "h-10 rounded-lg border-neutral-300",
            })}
          >
            View All Studios
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard key={studio.slug} studio={studio} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedStudiosSkeleton() {
  return (
    <section className="animate-pulse bg-neutral-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 h-8 w-72 rounded-lg bg-neutral-200" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-72 rounded-xl border border-neutral-200 bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { StudioCard }
export { FeaturedStudios, FeaturedStudiosSkeleton }

