import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

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

/* ---------- Types ---------- */

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
  ownerEmail?: string;
  ownerName?: string;
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

// Flatten the studio document into the flat shape the UI expects.
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
    ownerEmail: raw.ownerEmail ?? "",
    rating: Number(raw.rating ?? 0),
    reviewCount: Number(raw.reviewCount ?? 0),
  };
}

/**
 * Server-only: the BetterAuth session never runs in a client component.
 * We only need the e-mail to decide whether the viewer may edit/delete.
 */
async function getViewerEmail(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user?.email ?? null;
  } catch {
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

  // Local Mongo lookup accepts both ObjectId and slug; the viewer e-mail
  // decides whether edit/delete controls render at all.
  const [viewerEmail, studioDoc] = await Promise.all([
    getViewerEmail(),
    getStudioById(id),
  ]);
  const studio = studioDoc ? normalizeStudio(studioDoc, id) : null;

  /* ---------- Not found ---------- */
  // Renders the custom app/not-found.tsx (with the studio illustration).
  if (!studio) notFound();

  return <StudioDetails studio={studio} viewerEmail={viewerEmail} />;
}
