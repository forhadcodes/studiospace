import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import EditStudioPageClient from "@/components/studio/EditStudioPageClient";
import type { Studio } from "@/components/studio/StudioDetails";
import { auth } from "@/lib/auth";
import { getStudioById } from "@/lib/studios";

export const metadata: Metadata = {
  title: "Edit Studio | StudioSpace",
  description: "Update your studio listing details.",
};

type RawStudio = {
  slug?: string;
  _id?: unknown;
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
};

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
  };
}

export default async function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [viewerEmail, studioDoc] = await Promise.all([
    auth.api
      .getSession({ headers: await headers() })
      .then((s) => s?.user?.email ?? null)
      .catch(() => null),
    getStudioById(id),
  ]);

  if (!studioDoc) notFound();

  const studio = normalizeStudio(studioDoc, id);
  return <EditStudioPageClient studio={studio} viewerEmail={viewerEmail} />;
}
