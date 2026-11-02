"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  LoaderCircleIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import EditStudioExplore from "@/components/EditStudioExplore";
import DeleteStudioDialog from "@/components/DeleteStudioDialog";
import BookingCard from "@/components/booking/BookingCard";

/* ---------- Types ---------- */
// Flat shape this page renders (matching what the edit/delete dialogs expect).
interface Studio {
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
  rating?: number;
  reviewCount?: number;
}

// Raw shape returned by GET /api/studios/:id (see src/lib/studios.ts).
interface ApiStudio {
  slug: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: { address: string; city: string };
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  rating: number;
  reviewCount: number;
}

/* ---------- Helpers ---------- */

// Flatten the API studio (nested location, slug id) into this page's shape.
function normalizeStudio(studio: ApiStudio): Studio {
  return {
    _id: studio.slug,
    title: studio.title,
    category: studio.category,
    address: studio.location?.address ?? "",
    city: studio.location?.city ?? "",
    hourlyRate: studio.hourlyRate,
    securityDeposit: studio.securityDeposit,
    maxCapacity: studio.maxCapacity,
    image: studio.image,
    gallery: Array.isArray(studio.gallery) ? studio.gallery : [],
    amenities: Array.isArray(studio.amenities) ? studio.amenities : [],
    overview: studio.overview,
    rating: studio.rating,
    reviewCount: studio.reviewCount,
  };
}

// "photo-studio" -> "Photo Studio"
function formatCategory(cat: string): string {
  return cat
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function fetchStudio(id: string): Promise<Studio | null> {
  const res = await fetch(`/api/studios/${id}`, { cache: "no-store" });
  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as { studio: ApiStudio };
  return data.studio ? normalizeStudio(data.studio) : null;
}

/* ---------- Page ---------- */
export default function StudioDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  /* ---------- GET /api/studios/:id ---------- */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchStudio(id);
        if (!cancelled) {
          setStudio(data);
          setFailed(!data);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ---------- Refresh after a successful edit (used as onSaved) ---------- */
  async function refreshStudio() {
    const data = await fetchStudio(id);
    if (data) setStudio(data);
  }

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <span className="flex items-center gap-3 text-sm text-gray-500">
          <LoaderCircleIcon className="size-5 animate-spin text-red-600" />
          Loading studio…
        </span>
      </main>
    );
  }

  /* ---------- Not found / API error state ---------- */
  if (failed || !studio) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Studio not found
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            This listing may have been removed, or the server that holds it is
            unreachable.
          </p>
          <Link
            href="/studio-explore"
            className={`${buttonVariants({
              variant: "outline",
              className: "mt-8",
            })} text-red-600 hover:text-red-600`}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Back to Studios
          </Link>
        </section>
      </main>
    );
  }

  const amenities = Array.isArray(studio.amenities) ? studio.amenities : [];
  const rating = studio.rating ? Number(studio.rating) : 0;
  const reviewCount = studio.reviewCount ? Number(studio.reviewCount) : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Top bar: back link + action buttons */}
        <div className="flex items-center justify-between">
          <Link
            href="/studio-explore"
            className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Studios
          </Link>

          {/* Edit + Delete */}
          <div className="flex items-center gap-2">
            <EditStudioExplore studio={studio} onSaved={refreshStudio} />

            <DeleteStudioDialog />
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-5 overflow-hidden rounded-2xl bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={studio.image}
            alt={studio.title}
            className="h-[280px] w-full object-cover sm:h-[420px]"
          />
        </div>

        {/* Details + booking card */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div>
            {/* Location badge */}
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPinIcon className="h-4 w-4 text-red-600" />
              {formatCategory(studio.category)} · {studio.city}
            </span>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {studio.title}
            </h1>

            {/* Rating + capacity row */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
              {rating > 0 && (
                <span className="flex items-center gap-1.5">
                  <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-900">
                    {rating.toFixed(1)}
                  </span>
                  {reviewCount > 0 && <span>({reviewCount} reviews)</span>}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <UsersIcon className="h-4 w-4 text-red-600" />
                Up to {Number(studio.maxCapacity)} guests
              </span>
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-red-600" />
                {studio.address}, {studio.city}
              </span>
            </div>

            {/* Overview */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                {studio.overview}
              </p>
            </div>

            {/* Highlights (amenities checklist) */}
            {amenities.length > 0 && (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Highlights
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Everything this space includes
                </p>
                <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2.5 text-sm text-gray-700"
                    >
                      <BadgeCheckIcon className="h-5 w-5 shrink-0 text-red-600" />
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
