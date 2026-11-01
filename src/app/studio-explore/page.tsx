import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

/* ---------- Types ---------- */
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
  gallery?: string | string[];
  amenities?: string | string[];
  overview: string;
}

/* ---------- Helpers ---------- */
async function getStudios(): Promise<Studio[]> {
  try {
    const res = await fetch(`${API_URL}/studio-explore`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch studios (${res.status})`);
    const data: Studio[] = await res.json();
    if (!Array.isArray(data)) return [];

    // skip incomplete documents
    return data.filter(
      (s) =>
        s.title?.trim() &&
        s.image?.trim() &&
        s.hourlyRate !== undefined &&
        s.hourlyRate !== "",
    );
  } catch (err) {
    console.error(err);
    return [];
  }
}

// amenities can be an array, a plain "A, B" string, or an old '["A","B"]' string -> string[]
function parseAmenities(raw?: string | string[] | null): string[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.map((a) => String(a).trim()).filter(Boolean);
  }

  return String(raw)
    .replace(/[\[\]\\"]/g, "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
}

// "photo-studio" -> "Photo Studio"
function formatCategory(cat?: string): string {
  if (!cat) return "";
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
              href={`/studio-explore/${studio._id}`}
              className="rounded-md border border-red-600 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
            >
              Room Detail
            </Link>
            <Link
              href={`/studio-explore/${studio._id}`}
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
const StudioExplorePage = async () => {
  const studios = await getStudios();

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Explore All Studios
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Find your perfect creative space from our curated collection
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Showing {studios.length} {studios.length === 1 ? "studio" : "studios"}
        </p>

        {studios.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center text-gray-500">
            No studios found.
          </div>
        )}
      </section>
    </main>
  );
};

export default StudioExplorePage;
