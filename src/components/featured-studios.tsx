import { connection } from "next/server";
import Link from "next/link";
import { ArrowRightIcon, ClapperboardIcon, StarIcon } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { StudioGridSkeleton } from "@/components/loading/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryLabel } from "@/lib/constants";
import {
  getFeaturedStudios,
  type Studio,
} from "@/lib/studios";

/* ---------- Icons (no package needed) ---------- */
const IconPin = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-red-600 dark:text-red-500" fill="currentColor">
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-red-600 dark:text-red-500" fill="currentColor">
    <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zM8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8 2c-2.7 0-8 1.3-8 4v3h16v-3c0-2.7-5.3-4-8-4zM8 13c-.3 0-.6 0-1 .1C5.2 13.4 1 14.6 1 17v3h6v-3c0-1.4.7-2.6 1.8-3.5A9 9 0 0 0 8 13z" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-red-600 dark:text-red-500" fill="currentColor">
    <path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z" />
  </svg>
);

/* ---------- Studio card (same design as the studio-explore page) ---------- */
function StudioCard({ studio }: { studio: Studio }) {
  const amenities = Array.isArray(studio.amenities) ? studio.amenities : [];

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-card p-4 shadow-sm transition hover:shadow-lg">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden rounded-xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.image}
          alt={studio.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {categoryLabel(studio.category)}
        </span>
        {studio.rating > 0 && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur">
            <StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" />
            {studio.rating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-1 pt-5">
        <h3 className="text-2xl font-semibold text-foreground">{studio.title}</h3>
        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm text-muted-foreground">
          {studio.overview}
        </p>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground"
              >
                {a}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                +{amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Specs */}
        <div className="mt-4 flex items-center justify-between gap-2 border-y border-border py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <IconPin />
            {studio.location.city}
          </span>
          <span className="flex items-center gap-1.5">
            <IconUsers />
            Up to {studio.maxCapacity}
          </span>
          <span className="flex items-center gap-1.5">
            <IconShield />${studio.securityDeposit} deposit
          </span>
        </div>

        {/* Price + actions */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-3xl font-semibold text-foreground">
            ${studio.hourlyRate}
            <span className="ml-1 text-sm font-normal text-muted-foreground">/ Hour</span>
          </p>

          <div className="flex gap-2">
            <Link
              href={`/studio-explore/${studio.slug}`}
              className="rounded-md border border-red-600 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-500 transition hover:bg-red-600/10"
            >
              Room Detail
            </Link>
            <Link
              href={`/studio-explore/${studio.slug}`}
              className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Featured studios section (home page) ---------- */

// Top-rated studios from the `studios` collection — the same card grid the
// studio-explore page renders, capped at 6 with a link to the full list.
export async function FeaturedStudios() {
  // Opt out of prerendering so the list is fetched fresh per request.
  await connection();

  const studios = await getFeaturedStudios();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Featured Studios
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Top-rated creative spaces from our collection
          </p>
        </div>
        <Link
          href="/studio-explore"
          className="flex items-center gap-2 rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-500 transition hover:bg-red-600/10"
        >
          Explore All Studios
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {studios.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard key={studio.slug} studio={studio} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClapperboardIcon}
          title="No studios to feature yet"
          description="Our featured wall is waiting for its first listing. Be the first host to take the spotlight — or browse everything that's live."
          className="mt-10"
        >
          <Link
            href="/add-studio"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            List your studio
          </Link>
          <Link
            href="/studio-explore"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Explore all studios
          </Link>
        </EmptyState>
      )}
    </section>
  );
}

/* ---------- Loading skeleton (Suspense fallback in page.tsx) ---------- */

export function FeaturedStudiosSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-2 h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-44 rounded-md" />
      </div>

      <div className="mt-6">
        <StudioGridSkeleton count={6} />
      </div>
    </section>
  );
}
