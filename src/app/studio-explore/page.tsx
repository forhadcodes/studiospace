import { connection } from "next/server";
import Link from "next/link";
import { SearchIcon, SearchXIcon } from "lucide-react";
import { cn } from "cn";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CATEGORY_FORM_LABELS,
  CATEGORY_SLUGS,
  categoryLabel,
  isCategorySlug,
} from "@/lib/constants";
import { listStudios, type Studio } from "@/lib/studios";

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

/* ---------- Card ---------- */
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

/* ---------- Page ---------- */

type ExploreSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

// Builds /studio-explore links that preserve the active search/category.
function filterHref({ q, category }: { q?: string; category?: string }) {
  const search = new URLSearchParams();
  if (q) search.set("q", q);
  if (category) search.set("category", category);
  const qs = search.toString();
  return qs ? `/studio-explore?${qs}` : "/studio-explore";
}

const chipBase =
  "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors";

function chipClass(active: boolean) {
  return cn(
    chipBase,
    active
      ? "border-red-600 bg-red-600/10 text-red-600 dark:text-red-500"
      : "border-border text-muted-foreground hover:border-red-600/40 hover:text-foreground",
  );
}

const primaryCta =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700";
const outlineCta =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted";

const StudioExplorePage = async ({
  searchParams,
}: {
  searchParams: ExploreSearchParams;
}) => {
  // Opt out of prerendering so the studio list is fetched fresh per request.
  await connection();

  const params = await searchParams;
  const query = firstValue(params.q);
  const categoryParam = firstValue(params.category);
  const category = isCategorySlug(categoryParam) ? categoryParam : undefined;

  const { studios, total } = await listStudios({
    search: query || undefined,
    category,
    page: 1,
    limit: 48,
  });

  const hasFilters = Boolean(query || category);

  const emptyDescription = hasFilters
    ? query
      ? `We couldn't find anything for “${query}”${
          category ? ` in ${CATEGORY_FORM_LABELS[category]}` : ""
        }. Try a different keyword or clear the filters.`
      : `${
          category
            ? `Nothing in ${CATEGORY_FORM_LABELS[category]} yet.`
            : "Nothing here yet."
        } Try another category or clear the filters.`
    : "New spaces are added all the time. Check back soon, or be the first to list your own studio.";

  return (
    <main className="min-h-screen bg-section">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Explore All Studios
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Find your perfect creative space from our curated collection
        </p>

        {/* Search */}
        <form
          action="/studio-explore"
          className="mt-8 flex flex-col gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search studios by name, city or style…"
              aria-label="Search studios"
              className="h-10 w-full border-transparent bg-transparent pl-9 shadow-none focus-visible:border-border"
            />
          </div>
          {category ? (
            <input type="hidden" name="category" value={category} />
          ) : null}
          <Button
            type="submit"
            className="h-10 w-full bg-red-600 text-white hover:bg-red-700 sm:w-auto"
          >
            <SearchIcon data-icon="inline-start" />
            Search
          </Button>
        </form>

        {/* Category filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href={filterHref({ q: query || undefined })}
            className={chipClass(!category)}
          >
            All studios
          </Link>
          {CATEGORY_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={filterHref({ q: query || undefined, category: slug })}
              className={chipClass(category === slug)}
            >
              {CATEGORY_FORM_LABELS[slug]}
            </Link>
          ))}
        </div>

        {studios.length > 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            {hasFilters ? (
              <>
                Showing {studios.length} of {total}{" "}
                {total === 1 ? "studio" : "studios"}
                {query ? <> for &ldquo;{query}&rdquo;</> : null}
                {category ? <> in {CATEGORY_FORM_LABELS[category]}</> : null}
              </>
            ) : (
              <>
                Showing {studios.length}{" "}
                {studios.length === 1 ? "studio" : "studios"}
              </>
            )}
          </p>
        ) : null}

        {studios.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio.slug} studio={studio} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchXIcon}
            title={
              hasFilters
                ? "No studios match your search"
                : "No studios listed yet"
            }
            description={emptyDescription}
            className="mt-8"
          >
            {hasFilters ? (
              <Link href="/studio-explore" className={outlineCta}>
                Clear filters
              </Link>
            ) : null}
            <Link href="/add-studio" className={primaryCta}>
              List your studio
            </Link>
          </EmptyState>
        )}
      </section>
    </main>
  );
};

export default StudioExplorePage;
