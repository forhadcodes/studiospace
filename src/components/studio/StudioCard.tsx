import Link from "next/link";

import { apiUrl } from "@/lib/api-url";

/* ---------- Types ---------- */
interface Studio {
  _id: string;
  title: string;
  category: string;
  address: string;
  city: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  image: string;
  gallery: string;
  amenities: string;
  overview: string;
  rating?: number;
  reviewCount?: number;
}

async function getStudios(): Promise<Studio[]> {
  try {
    const res = await fetch(apiUrl("/studio-explore"), {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch studios");
    const data: Studio[] = await res.json();

    // empty/incomplete document bad dao
    return data.filter((s) => s.title?.trim() && s.image?.trim() && s.hourlyRate);
  } catch (err) {
    console.error(err);
    return [];
  }
}

// malformed amenities string ke array te convert kore
function parseAmenities(raw: string): string[] {
  if (!raw) return [];
  return raw
    .replace(/[\[\]\\"]/g, "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
}

// "photo-studio" -> "Photo Studio"
function formatCategory(cat: string): string {
  return cat
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ---------- Icons (no package needed) ---------- */
const IconPin = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-red-600" fill="currentColor">
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-red-600" fill="currentColor">
    <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zM8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8 2c-2.7 0-8 1.3-8 4v3h16v-3c0-2.7-5.3-4-8-4zM8 13c-.3 0-.6 0-1 .1C5.2 13.4 1 14.6 1 17v3h6v-3c0-1.4.7-2.6 1.8-3.5A9 9 0 0 0 8 13z" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-red-600" fill="currentColor">
    <path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z" />
  </svg>
);

/* ---------- Card ---------- */
function StudioCard({ studio }: { studio: Studio }) {
  const amenities = parseAmenities(studio.amenities);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-lg">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden rounded-xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.image}
          alt={studio.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {formatCategory(studio.category)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-1 pt-5">
        <h3 className="text-2xl font-semibold text-gray-900">{studio.title}</h3>
        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm text-gray-600">
          {studio.overview}
        </p>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] text-gray-600"
              >
                {a}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] text-gray-600">
                +{amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Specs */}
        <div className="mt-4 flex items-center justify-between gap-2 border-y border-gray-200 py-3 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <IconPin />
            {studio.city}
          </span>
          <span className="flex items-center gap-1.5">
            <IconUsers />
            Up to {Number(studio.maxCapacity)}
          </span>
          <span className="flex items-center gap-1.5">
            <IconShield />${Number(studio.securityDeposit)} deposit
          </span>
        </div>

        {/* Price + actions */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-3xl font-semibold text-gray-900">
            ${Number(studio.hourlyRate)}
            <span className="ml-1 text-sm font-normal text-gray-500">/ Hour</span>
          </p>

          <div className="flex gap-2">
            <Link
              href={`/studios/${studio._id}`}
              className="rounded-md border border-red-600 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
            >
              Room Detail
            </Link>
            <Link
              href={`/booking/${studio._id}`}
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