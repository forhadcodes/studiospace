"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  MapPinIcon,
  StarIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import EditStudioExplore from "@/components/EditStudioExplore";
import DeleteStudioDialog from "@/components/DeleteStudioDialog";
import BookingCard from "@/components/booking/BookingCard";
import { authClient } from "@/lib/auth-client";

/* ---------- Types ---------- */

// Flat shape rendered by this page (matching what the edit/delete dialogs need).
export interface Studio {
  _id: string;
  title: string;
  category: string;
  address: string;
  city: string;
  hourlyRate: string | number;
  securityDeposit: string | number;
  maxCapacity: string | number;
  image: string;
  gallery?: string[];
  amenities?: string[];
  overview: string;
  /** Owner info from Mongo — owner e-mail gates edit/delete, name shows the host. */
  ownerEmail?: string;
  ownerName?: string;
  ownerPhoto?: string;
  rating?: number;
  reviewCount?: number;
}

// "photo-studio" -> "Photo Studio"
function formatCategory(cat: string): string {
  return cat
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ---------- Component ---------- */

// Client-side presentation layer. The server page fetches the studio (and the
// JWT) and passes it in, so this file never touches next/headers or auth.
export default function StudioDetails({
  studio,
  viewerEmail,
}: {
  studio: Studio;
  /** Signed-in viewer's e-mail (null when anonymous or session unavailable). */
  viewerEmail?: string | null;
}) {
  const router = useRouter();

  const amenities = Array.isArray(studio.amenities) ? studio.amenities : [];
  const gallery = Array.isArray(studio.gallery) ? studio.gallery : [];
  const slides = [studio.image, ...gallery].filter(Boolean);
  const rating = studio.rating ? Number(studio.rating) : 0;
  const reviewCount = studio.reviewCount ? Number(studio.reviewCount) : 0;
  const hostName =
    studio.ownerName?.trim() ||
    (studio.ownerEmail ? studio.ownerEmail.split("@")[0] : "Host");

  // Edit/delete are owner-only: the API enforces it (403) and we hide the
  // buttons up front so users don't discover it via an error.
  //
  // Two sources for the viewer's e-mail, in order:
  // 1. `viewerEmail` — resolved server-side by the RSC page (fast, no flicker).
  // 2. The client-side BetterAuth session — safety net for the case where the
  //    server couldn't resolve the session (cookie-cache miss etc.). The
  //    buttons behind this gate stay hidden on the server render either way,
  //    so there is no hydration mismatch; they just appear once resolved.
  const { data: clientSession } = authClient.useSession();
  const viewer =
    viewerEmail ?? clientSession?.user?.email ?? null;

  const canManage =
    Boolean(viewer) &&
    Boolean(studio.ownerEmail) &&
    studio.ownerEmail!.toLowerCase() === viewer!.toLowerCase();

  // The edit dialog saves through /api/studios/:id; refresh the server
  // component so it re-fetches the updated studio.
  function refreshStudio() {
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-section">
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Top bar: back link + action buttons */}
        <div className="flex items-center justify-between">
          <Link
            href="/studio-explore"
            className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Studios
          </Link>

          {/* Edit + Delete — owner only (the APIs enforce this too) */}
          {canManage && (
            <div className="flex items-center gap-2">
              <EditStudioExplore studio={studio} onSaved={refreshStudio} />

              <DeleteStudioDialog studioId={studio._id} />
            </div>
          )}
        </div>

        {/* Hero image / gallery carousel */}
        <div className="mt-5 overflow-hidden rounded-2xl bg-muted">
          <Carousel className="w-full" opts={{ loop: slides.length > 1 }}>
            <CarouselContent className="ml-0">
              {slides.map((src, index) => (
                <CarouselItem key={`${src}-${index}`} className="pl-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${studio.title} photo ${index + 1}`}
                    className="h-[280px] w-full object-cover sm:h-[420px]"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {slides.length > 1 && (
              <>
                <CarouselPrevious className="left-3" />
                <CarouselNext className="right-3" />
              </>
            )}
          </Carousel>
        </div>

        {/* Details + booking card */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div>
            {/* Location badge */}
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPinIcon className="h-4 w-4 text-red-600 dark:text-red-500" />
              {formatCategory(studio.category)} · {studio.city}
            </span>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {studio.title}
            </h1>

            {/* Rating + capacity row */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {rating > 0 && (
                <span className="flex items-center gap-1.5">
                  <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">
                    {rating.toFixed(1)}
                  </span>
                  {reviewCount > 0 && <span>({reviewCount} reviews)</span>}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <UsersIcon className="h-4 w-4 text-red-600 dark:text-red-500" />
                Up to {Number(studio.maxCapacity)} guests
              </span>
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-red-600 dark:text-red-500" />
                {studio.address}, {studio.city}
              </span>
            </div>

            {/* Host */}
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                {studio.ownerPhoto ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={studio.ownerPhoto}
                    alt={hostName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="size-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hosted by</p>
                <p className="text-sm font-semibold text-foreground">
                  {hostName}
                </p>
              </div>
            </div>

            {/* Overview */}
            <div className="mt-8 border-t border-border pt-8">
              <h2 className="text-2xl font-semibold text-foreground">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {studio.overview}
              </p>
            </div>

            {/* Highlights (amenities checklist) */}
            {amenities.length > 0 && (
              <div className="mt-8 border-t border-border pt-8">
                <h2 className="text-2xl font-semibold text-foreground">
                  Highlights
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Everything this space includes
                </p>
                <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2.5 text-sm text-foreground/80"
                    >
                      <BadgeCheckIcon className="h-5 w-5 shrink-0 text-red-600 dark:text-red-500" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column: booking summary card */}
          <BookingCard studio={studio} />
        </div>
      </section>
    </main>
  );
}
