"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LoaderCircleIcon, RefreshCwIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import MyListingCard, {
  type ListingStudio,
} from "@/components/my-listings/MyListingCard";

/* ---------- Types ---------- */

// Shape returned by GET /api/studios (nested location, slug id).
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
  ownerEmail: string;
}

/* ---------- Helpers ---------- */

// Flatten the API studio (nested location, slug id) into the card's shape
// — same mapping the studio details page uses.
function normalizeStudio(studio: ApiStudio): ListingStudio {
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
    ownerEmail: studio.ownerEmail,
  };
}

const DATE_KEY = "title";

// Alphabetical listing keeps the table stable between refetches.
function sortByTitle(a: ListingStudio, b: ListingStudio): number {
  return a[DATE_KEY].localeCompare(b[DATE_KEY]);
}

/* ---------- Page ---------- */

export default function MyListingsPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user;

  const [studios, setStudios] = useState<ListingStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  // Bumped by the retry button on the error screen to re-run the fetch.
  const [refreshToken, setRefreshToken] = useState(0);

  /* ---------- GET /api/studios?ownerEmail=... ---------- */
  const email = user?.email;

  useEffect(() => {
    if (!email) return;

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(
          `/api/studios?ownerEmail=${encodeURIComponent(email)}&sort=newest&limit=48`,
          { cache: "no-store" },
        );

        if (cancelled) return;

        if (!res.ok) {
          setFailed(true);
          return;
        }

        const data = (await res.json()) as { studios: ApiStudio[] };
        setStudios(
          Array.isArray(data.studios)
            ? data.studios.map(normalizeStudio).sort(sortByTitle)
            : [],
        );
        setFailed(false);
      } catch (err) {
        console.error(err);
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [email, refreshToken]);

  /* ---------- Actions ---------- */

  // Trigger a refetch after the Edit dialog saves new data.
  function refreshListings() {
    setRefreshToken((token) => token + 1);
  }

  function removeListing(id: string) {
    setStudios((prev) => prev.filter((s) => s._id !== id));
  }

  /* ---------- Loading state (session resolving, or list fetching) ---------- */
  if (sessionPending || (!!email && loading)) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <span className="flex items-center gap-3 text-sm text-gray-500">
          <LoaderCircleIcon className="size-5 animate-spin text-red-600" />
          Loading your listings…
        </span>
      </main>
    );
  }

  /* ---------- Not logged in ---------- */
  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Please log in
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            You need a host account to manage your studio listings.
          </p>
          <Link
            href="/login"
            className={`${buttonVariants({
              className: "mt-8",
            })} bg-red-600 text-white hover:bg-red-600/90`}
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  /* ---------- API error state ---------- */
  if (failed) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Couldn&apos;t load your listings
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Something went wrong fetching your studios. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={refreshListings}
            className="mt-8 text-red-600 hover:bg-red-50 hover:text-red-600"
          >
            <RefreshCwIcon data-icon="inline-start" />
            Try again
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
              My Studio Listings
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Studio spaces you own — update or remove them anytime
            </p>
          </div>
          <Link
            href="/add-studio"
            className={buttonVariants({
              className: "bg-red-600 text-white hover:bg-red-600/90",
            })}
          >
            Add New Studio
          </Link>
        </div>

        <div className="mt-8 space-y-5 border-t border-gray-200 pt-8">
          {studios.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                No listings yet
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                List your first studio and it will show up here.
              </p>
              <Link
                href="/add-studio"
                className={`${buttonVariants({
                  variant: "outline",
                  className: "mt-6",
                })} text-red-600 hover:text-red-600`}
              >
                Add a Studio
              </Link>
            </div>
          ) : (
            studios.map((studio) => (
              <MyListingCard
                key={studio._id}
                studio={studio}
                onDeleted={removeListing}
                onUpdated={() => refreshListings()}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
