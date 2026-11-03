import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { ArrowLeftIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import StudioDetails, {
  type Studio,
} from "@/components/studio/StudioDetails";
import { auth } from "@/lib/auth";
import { getStudioById } from "@/lib/studios";

export const metadata: Metadata = {
  title: "Studio Details | StudioSpace",
  description:
    "View studio photos, amenities, hourly rates and book your next creative session on StudioSpace.",
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/* ---------- Types ---------- */

// Accepts both shapes we may receive:
// - Express:   { _id, title, city, address, ... } (flat)
// - Next API:  { slug, title, location: { address, city }, ... } (nested)
type RawStudio = {
  _id?: unknown;
  slug?: string;
  title?: string;
  category?: string;
  hourlyRate?: number | string;
  securityDeposit?: number | string;
  maxCapacity?: number | string;
  location?: { address?: string; city?: string };
  address?: string;
  city?: string;
  image?: string;
  gallery?: string[] | string;
  amenities?: string[] | string;
  overview?: string;
  rating?: number;
  reviewCount?: number;
};

/* ---------- Helpers ---------- */

// Mongo documents sometimes store lists as comma-separated strings.
function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

// Flatten either response shape into the flat shape the UI expects.
function normalizeStudio(raw: RawStudio, fallbackId: string): Studio {
  const location = raw.location;

  return {
    _id: raw.slug ?? (raw._id ? String(raw._id) : fallbackId),
    title: raw.title ?? "Untitled Studio",
    category: raw.category ?? "photo-studio",
    address: raw.address ?? location?.address ?? "",
    city: raw.city ?? location?.city ?? "",
    hourlyRate: raw.hourlyRate ?? 0,
    securityDeposit: raw.securityDeposit ?? 0,
    maxCapacity: raw.maxCapacity ?? 0,
    image: raw.image ?? "",
    gallery: toStringList(raw.gallery),
    amenities: toStringList(raw.amenities),
    overview: raw.overview ?? "",
    rating: Number(raw.rating ?? 0),
    reviewCount: Number(raw.reviewCount ?? 0),
  };
}

/**
 * Server-only: BetterAuth issues the JWT from the session cookie. Never put
 * this in the client component — `next/headers` and `auth` only run on the
 * server.
 */
async function getJwtToken(): Promise<string | null> {
  try {
    const token = await auth.api.getToken({ headers: await headers() });
    return token?.token ?? null;
  } catch {
    // Logged-out visitors can still browse; the backend just gets no token.
    return null;
  }
}

/** Fetches from the Express backend, forwarding the JWT so it knows the user. */
async function fetchBackendStudio(
  id: string,
  jwtToken: string | null,
): Promise<Studio | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/studio-explore/${id}`, {
      headers: jwtToken ? { authorization: `Bearer ${jwtToken}` } : undefined,
      cache: "no-store",
    });

    if (!res.ok) return null;

    const payload = (await res.json()) as RawStudio | { studio?: RawStudio };
    const raw = (payload as { studio?: RawStudio }).studio ?? (payload as RawStudio);

    return raw ? normalizeStudio(raw, id) : null;
  } catch {
    // Backend down/unreachable — the caller falls back to the local API.
    return null;
  }
}

/* ---------- Page (Server Component) ---------- */

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Run the session/JWT lookup and the slug-friendly local lookup in parallel.
  const [jwtToken, localStudio] = await Promise.all([
    getJwtToken(),
    getStudioById(id),
  ]);

  // Prefer the Express backend (with JWT); fall back to the app's Mongo API.
  const backendStudio = await fetchBackendStudio(id, jwtToken);
  const studio =
    backendStudio ??
    (localStudio ? normalizeStudio(localStudio, id) : null);

  /* ---------- Not found / API error state ---------- */
  if (!studio) {
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

  return <StudioDetails studio={studio} />;
}
